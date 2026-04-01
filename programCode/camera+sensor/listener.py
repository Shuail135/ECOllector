import os
import cv2
import time
import random
import datetime
import tkinter as tk
import serial

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
SORTER_PORT = "/dev/ttyACM0"   # sorter Arduino
SORTER_BAUD = 9600

SENSOR_PORT = "/dev/ttyACM1"   # ultrasonic Arduino
SENSOR_BAUD = 9600
TRIGGER_LINE = "TRIGGER,1"

CKPT_PATH = "waste3_best.pt"

CONF_THRESHOLD = 0.70
CAPTURE_DURATION = 2.0
LISTEN_WINDOW = 2.0

CORRECTION_DIR = "corrections"
os.makedirs(CORRECTION_DIR, exist_ok=True)

VALID_LABELS = {"paper", "plastic", "garbage"}
MIC_INDEX = None

POST_DETECTION_COOLDOWN = 2.0
CLEAR_WAIT_TIMEOUT = 3.0
CLEAR_STABLE_TIME = 0.5

# Sensor trigger stability
SENSOR_STARTUP_DELAY = 2.0
SENSOR_TRIGGER_REQUIRED_HITS = 3
SENSOR_TRIGGER_WINDOW = 0.25


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
# Ultrasonic sensor setup
# =========================
sensor_ser = None

try:
    sensor_ser = serial.Serial(SENSOR_PORT, SENSOR_BAUD, timeout=0.05)
    time.sleep(SENSOR_STARTUP_DELAY)

    # Flush any startup junk / false trigger data
    sensor_ser.reset_input_buffer()
    sensor_ser.reset_output_buffer()

    print("Ultrasonic sensor connected on", SENSOR_PORT)
except Exception as e:
    print("Sensor connection failed:", e)
    sensor_ser = None


def read_sensor_line():
    global sensor_ser

    if sensor_ser is None:
        return None

    try:
        line = sensor_ser.readline().decode(errors="ignore").strip()
        return line if line else None
    except Exception as e:
        print("Sensor read error:", e)
        return None


def sensor_triggered(required_hits=SENSOR_TRIGGER_REQUIRED_HITS, window=SENSOR_TRIGGER_WINDOW):
    """
    Accept trigger only if we receive several TRIGGER lines within a short window.
    This filters startup noise and random false positives.
    """
    if sensor_ser is None:
        return False

    hits = 0
    start = time.time()

    while time.time() - start < window and not stop_event.is_set():
        line = read_sensor_line()

        if line:
            print("Sensor:", line)

        if line == TRIGGER_LINE:
            hits += 1
            if hits >= required_hits:
                return True

        time.sleep(0.01)

    return False


def wait_until_object_cleared(timeout=CLEAR_WAIT_TIMEOUT, stable_time=CLEAR_STABLE_TIME):
    """
    Wait until trigger is absent for a stable duration, or until timeout.
    """
    start = time.time()
    clear_start = None

    while time.time() - start < timeout and not stop_event.is_set():
        line = read_sensor_line()

        if line == TRIGGER_LINE:
            clear_start = None
        else:
            if clear_start is None:
                clear_start = time.time()
            elif time.time() - clear_start >= stable_time:
                return True

        time.sleep(0.02)

    return True


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
last_detection_time = [0.0]


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
        if sensor_ser is not None:
            sensor_ser.close()
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
        result_var.set("Camera not available")
        root.after(1000, update_frame)
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
        result_var.set("Object detected, classifying...")

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
            status_var.set("Waiting for next object")
            return

        voted = max(set(preds), key=preds.count)
        avg_conf = sum(confs) / len(confs)

        if voted in ("paper", "plastic") and avg_conf < CONF_THRESHOLD:
            voted = "garbage"

        result_var.set(f"Result: {voted}, conf {avg_conf:.3f}")

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

        try:
            write_detection(final_label, final_conf)
        except Exception as e:
            print("Firebase write failed:", e)

        result_var.set(f"Final: {final_label}, conf {final_conf:.3f}")
        status_var.set("Waiting for object to clear...")

        wait_until_object_cleared()

        last_detection_time[0] = time.time()
        status_var.set("Ready for next object")

    finally:
        freeze_preview[0] = False
        is_running[0] = False


# =========================
# Continuous trigger loop
# =========================
def trigger_loop():
    if stop_event.is_set():
        return

    if cap is None:
        status_var.set("No camera found")
        root.after(500, trigger_loop)
        return

    if sensor_ser is None:
        status_var.set("Sensor not connected")
        root.after(500, trigger_loop)
        return

    if is_running[0]:
        root.after(100, trigger_loop)
        return

    if time.time() - last_detection_time[0] < POST_DETECTION_COOLDOWN:
        status_var.set("Cooldown...")
        root.after(100, trigger_loop)
        return

    status_var.set("Waiting for object...")
    result_var.set("Standby")

    if sensor_triggered():
        Thread(target=run_analysis_flow, daemon=True).start()
        root.after(100, trigger_loop)
        return

    root.after(100, trigger_loop)


root.protocol("WM_DELETE_WINDOW", shutdown)
update_frame()
root.after(200, trigger_loop)
root.mainloop()