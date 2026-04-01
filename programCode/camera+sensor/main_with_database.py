import os
import cv2
import time
import random
import datetime
import tkinter as tk

import torch
import torch.nn as nn
from torchvision import models, transforms

from PIL import Image, ImageTk
from threading import Thread, Event

from Firebase import write_detection
from sender import ArduinoSender


# =========================
# Config
# =========================
SORTER_PORT = "/dev/ttyACM0"
SORTER_BAUD = 9600

CKPT_PATH = "waste3_best.pt"

CONF_THRESHOLD = 0.70
CAPTURE_DURATION = 2.0
COUNTDOWN_SECONDS = 1
LISTEN_WINDOW = 2.0

CORRECTION_DIR = "corrections"
os.makedirs(CORRECTION_DIR, exist_ok=True)

VALID_LABELS = {"paper", "plastic", "garbage"}
MIC_INDEX = None


# =========================
# Device setup
# =========================
try:
    import torch_directml
    DEVICE = torch_directml.device()
except Exception:
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", DEVICE)


# =========================
# Model setup
# =========================
ckpt = torch.load(CKPT_PATH, map_location="cpu", weights_only=False)
classes = ckpt["classes"]
print("Classes:", classes)

model = models.mobilenet_v3_small(weights=None)
model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(classes))
model.load_state_dict(ckpt["model"])
model.to(DEVICE)
model.eval()

MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])


def to_tensor(bgr_frame):
    rgb = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)
    return tf(Image.fromarray(rgb)).unsqueeze(0).to(DEVICE)


# =========================
# Speech recognition setup
# =========================
try:
    import speech_recognition as sr
    SR_AVAILABLE = True
except Exception:
    SR_AVAILABLE = False


def parse_label(transcript: str):
    if not transcript:
        return None

    t = transcript.lower().strip()
    tokens = [tok.strip(".,!?;:()[]{}\\\"'") for tok in t.split()]

    for tok in tokens:
        if tok == "gabage":
            return "garbage"
        if tok in VALID_LABELS:
            return tok

    return None


def listen_window(duration_sec=5.0):
    if not SR_AVAILABLE:
        return None

    r = sr.Recognizer()
    r.dynamic_energy_threshold = True
    end_time = time.time() + duration_sec

    try:
        with sr.Microphone(device_index=MIC_INDEX) as source:
            r.adjust_for_ambient_noise(source, duration=0.6)

            while time.time() < end_time:
                remaining = max(0.1, end_time - time.time())
                timeout = min(remaining, 1.2)
                phrase_limit = min(remaining, 2.5)

                try:
                    audio = r.listen(source, timeout=timeout, phrase_time_limit=phrase_limit)
                except sr.WaitTimeoutError:
                    continue

                transcript = ""
                try:
                    transcript = r.recognize_google(audio)
                except sr.UnknownValueError:
                    try:
                        transcript = r.recognize_sphinx(audio)
                    except Exception:
                        transcript = ""
                except sr.RequestError:
                    try:
                        transcript = r.recognize_sphinx(audio)
                    except Exception:
                        transcript = ""

                label = parse_label(transcript)
                if label in VALID_LABELS:
                    print(f"Voice correction heard: {label}")
                    return label

            return None

    except Exception as e:
        print("listen_window error:", e)
        return None


# =========================
# Camera setup
# =========================
def open_camera():
    for idx in (0, 1, 2):
        cap_try = cv2.VideoCapture(idx)
        if cap_try.isOpened():
            cap_try.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap_try.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

            ok, _ = cap_try.read()
            if ok:
                print("Camera opened on index:", idx)
                return cap_try, idx

        try:
            cap_try.release()
        except Exception:
            pass

    return None, None


cap, CAM_INDEX = open_camera()


# =========================
# Sorter Arduino setup
# =========================
arduino = ArduinoSender(
    port=SORTER_PORT,
    baud=SORTER_BAUD,
    startup_delay=2.0,
    debug=True
)

arduino_connected = arduino.connect()
print("Sorter Arduino connected:", arduino_connected)


# =========================
# UI setup
# =========================
root = tk.Tk()
root.title("ECOllector Detector")

result_var = tk.StringVar(value="Starting camera...")
status_var = tk.StringVar(value="Ready")

preview = tk.Label(root)
preview.pack(padx=6, pady=(6, 0))

result_label = tk.Label(root, textvariable=result_var, font=("Arial", 14))
result_label.pack(pady=4)

status_label = tk.Label(root, textvariable=status_var, font=("Arial", 11), fg="gray")
status_label.pack(pady=(0, 6))

stop_event = Event()
is_running = [False]
freeze_preview = [False]
last_frame_bgr = [None]


# =========================
# Shutdown
# =========================
def shutdown():
    stop_event.set()

    try:
        if cap is not None:
            cap.release()
    except Exception:
        pass

    try:
        arduino.close()
    except Exception:
        pass

    try:
        root.destroy()
    except Exception:
        pass


# =========================
# Preview update
# =========================
def update_frame():
    if stop_event.is_set():
        return

    if cap is None:
        status_var.set("No camera found")
        result_var.set("Closing")
        root.after(800, shutdown)
        return

    if not freeze_preview[0]:
        ok, frame = cap.read()
        if ok:
            last_frame_bgr[0] = frame.copy()
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = ImageTk.PhotoImage(Image.fromarray(rgb))
            preview.imgtk = img
            preview.configure(image=img)
        else:
            status_var.set("Camera read failed")

    root.after(30, update_frame)


# =========================
# Core analysis flow
# =========================
def run_analysis_flow():
    is_running[0] = True
    freeze_preview[0] = True

    try:
        status_var.set("Analyzing...")
        start = time.time()
        preds, confs = [], []
        picked_frame = None

        while time.time() - start < CAPTURE_DURATION and not stop_event.is_set():
            ok, frame = cap.read()
            if not ok:
                break

            if picked_frame is None or random.random() < 0.15:
                picked_frame = frame.copy()

            with torch.no_grad():
                logits = model(to_tensor(frame))
                probs = torch.softmax(logits, dim=1)[0]
                conf, idx = torch.max(probs, dim=0)

                preds.append(classes[idx.item()])
                confs.append(float(conf.item()))

        if not preds:
            result_var.set("No frames captured")
            status_var.set("Closing")
            root.after(1200, shutdown)
            return

        voted = max(set(preds), key=preds.count)
        avg_conf = sum(confs) / len(confs)

        # Low-confidence recyclable -> garbage
        if voted in ("paper", "plastic") and avg_conf < CONF_THRESHOLD:
            voted = "garbage"

        result_var.set(f"Result: {voted}, conf {avg_conf:.3f}")

        # Send first result to sorter
        if arduino_connected:
            try:
                ok_send = arduino.send_label(voted)
                if ok_send:
                    status_var.set(
                        f"Sent to sorter, say paper plastic or garbage within {LISTEN_WINDOW:.0f}s"
                    )
                else:
                    status_var.set(
                        f"Sorter send failed, say paper plastic or garbage within {LISTEN_WINDOW:.0f}s"
                    )
            except Exception as e:
                status_var.set(
                    f"Sorter error: {e}, say paper plastic or garbage within {LISTEN_WINDOW:.0f}s"
                )
        else:
            status_var.set(
                f"Sorter not connected, say paper plastic or garbage within {LISTEN_WINDOW:.0f}s"
            )

        # Voice correction
        user_label = listen_window(LISTEN_WINDOW)

        final_label = voted
        final_conf = avg_conf

        if user_label is None:
            print("No voice correction received")
        else:
            if user_label != voted:
                final_label = user_label

                frame_to_save = last_frame_bgr[0] if last_frame_bgr[0] is not None else picked_frame
                if frame_to_save is not None:
                    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                    fname = f"{ts}_pred_{voted}_corr_{user_label}_conf_{avg_conf:.3f}.jpg"
                    fpath = os.path.join(CORRECTION_DIR, fname)
                    cv2.imwrite(fpath, frame_to_save)
                    print("Saved correction image:", fpath)

                if arduino_connected:
                    try:
                        arduino.send_label(final_label)
                    except Exception as e:
                        print("Sorter correction send failed:", e)
            else:
                print("Voice matches prediction")

        # Firebase write
        try:
            write_detection(final_label, final_conf)
        except Exception as e:
            print("Firebase write failed:", e)

        result_var.set(f"Final: {final_label}, conf {final_conf:.3f}")
        status_var.set("Done, closing...")
        root.after(1500, shutdown)

    finally:
        freeze_preview[0] = False
        is_running[0] = False


# =========================
# Countdown
# =========================
def countdown_tick(remaining):
    if stop_event.is_set():
        return

    if remaining <= 0:
        result_var.set("Analyzing now")
        Thread(target=run_analysis_flow, daemon=True).start()
        return

    result_var.set(f"Auto analyze in {remaining}s")
    status_var.set("Camera preview running")
    root.after(1000, lambda: countdown_tick(remaining - 1))


def start_sequence():
    if cap is None:
        result_var.set("No camera detected")
        status_var.set("Closing")
        root.after(800, shutdown)
        return

    result_var.set(f"Auto analyze in {COUNTDOWN_SECONDS}s")

    if arduino_connected:
        status_var.set("Camera preview running | Sorter connected")
    else:
        status_var.set("Camera preview running | Sorter not connected")

    countdown_tick(COUNTDOWN_SECONDS)


root.protocol("WM_DELETE_WINDOW", shutdown)
update_frame()
root.after(200, start_sequence)
root.mainloop()