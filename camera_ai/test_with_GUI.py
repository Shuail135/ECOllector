# for windows (amd gpu) only, jet nano not tested
import os, cv2, time, random, datetime
import torch, torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# directml(amd) -> cuda -> cpu
try:
    import torch_directml
    DEVICE = torch_directml.device()
except Exception:
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", DEVICE)

CKPT_PATH = "waste3_best.pt"
print("CKPT:", CKPT_PATH)

CAM_INDEX = 1  # change if needed
FRAME_W, FRAME_H = 640, 480

CONF_THRESHOLD   = 0.70   # if paper/plastic & avg conf below -> garbage
CAPTURE_DURATION = 2.0    # seconds to average over
LISTEN_WINDOW    = 5.0    # seconds to listen for correction

CORRECTION_DIR   = "corrections"
os.makedirs(CORRECTION_DIR, exist_ok=True)

# NEW: folder to save first captured image of each run
CAPTURE_DIR = "captures"
os.makedirs(CAPTURE_DIR, exist_ok=True)

MIC_INDEX = None  # None = default
VALID_LABELS = {"paper", "plastic", "garbage"}

# Voice
try:
    import speech_recognition as sr
    SR_AVAILABLE = True
except Exception:
    SR_AVAILABLE = False
    print("speech_recognition not available; voice correction disabled.")

def parse_label(transcript: str):
    if not transcript:
        return None
    t = transcript.lower().strip()
    tokens = [tok.strip(".,!?;:()[]{}\"'") for tok in t.split()]
    for tok in tokens:
        if tok == "gabage":   # common miss
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
                    return label
            return None
    except Exception:
        return None

# ---------------- Model ----------------
ckpt = torch.load(CKPT_PATH, map_location="cpu")
classes = ckpt["classes"]
print("Classes:", classes)

model = models.mobilenet_v3_small(weights=None)
model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(classes))
model.load_state_dict(ckpt["model"])
model.to(DEVICE)
model.eval()

MEAN=[0.485,0.456,0.406]; STD=[0.229,0.224,0.225]
tf = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN,STD)
])

def to_tensor(bgr_frame):
    rgb = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)
    x = tf(Image.fromarray(rgb)).unsqueeze(0).to(DEVICE)
    return x

# ---------------- Camera ----------------
cap = cv2.VideoCapture(CAM_INDEX)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_W)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_H)
if not cap.isOpened():
    raise RuntimeError(f"Could not open camera index {CAM_INDEX}")

print("Controls: Enter to analyze, q to quit\n")

def run_once():
    print(f"[+] Capturing for {CAPTURE_DURATION:.1f}s ...")
    start = time.time()

    preds, confs = [], []
    picked_frame = None
    last_frame = None
    frames_seen = 0

    # NEW: save the very first frame captured in this run
    first_frame = None
    first_saved_path = None

    while time.time() - start < CAPTURE_DURATION:
        ok, frame = cap.read()
        if not ok:
            break
        frames_seen += 1
        last_frame = frame

        if first_frame is None:
            first_frame = frame.copy()
            ts0 = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            first_name = f"{ts0}_first.jpg"
            first_saved_path = os.path.join(CAPTURE_DIR, first_name)
            cv2.imwrite(first_saved_path, first_frame)
            print(f"[+] Saved first capture → {first_saved_path}")

        # sometimes keep a random "nice" frame candidate
        if picked_frame is None or random.random() < 0.15:
            picked_frame = frame.copy()

        with torch.no_grad():
            logits = model(to_tensor(frame))
            probs = torch.softmax(logits, dim=1)[0]
            conf, idx = torch.max(probs, dim=0)
            preds.append(classes[idx.item()])
            confs.append(float(conf.item()))

    if not preds:
        print("[-] No frames captured (camera read failed).")
        return

    voted = max(set(preds), key=preds.count)
    avg_conf = sum(confs) / len(confs)

    # apply your threshold rule
    if voted in ("paper", "plastic") and avg_conf < CONF_THRESHOLD:
        voted = "garbage"

    print(f"[✓] Result: {voted} (avg conf {avg_conf:.3f}, frames {frames_seen})")

    print(f"[?] Say 'paper', 'plastic', or 'garbage' within {LISTEN_WINDOW:.0f}s to correct...")
    user_label = listen_window(LISTEN_WINDOW)

    if user_label is None:
        print("[i] No voice detected / no valid label. No action.")
        return

    print(f"[i] Voice label: {user_label}")

    if user_label != voted:
        frame_to_save = last_frame if last_frame is not None else picked_frame
        if frame_to_save is None:
            print("[!] Mismatch but no frame to save.")
            return

        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        fname = f"{ts}_pred-{voted}_corr-{user_label}_conf-{avg_conf:.3f}.jpg"
        fpath = os.path.join(CORRECTION_DIR, fname)
        ok = cv2.imwrite(fpath, frame_to_save)
        if ok:
            print(f"[+] Saved correction → {fpath}")
        else:
            print("[!] Failed to save correction image.")
    else:
        print("[✓] Voice matches model. No action.")

try:
    while True:
        cmd = input(">> ").strip().lower()
        if cmd in {"q"}:
            break
        run_once()
        print()
finally:
    cap.release()
    print("Quiting...")
