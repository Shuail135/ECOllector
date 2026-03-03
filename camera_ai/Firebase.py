import firebase_admin
from firebase_admin import credentials, db
import datetime
from zoneinfo import ZoneInfo

_DB_REF = None

def init_firebase(
    cred_path="ecollector-59983-firebase-adminsdk-fbsvc-d0f3ee6b9b.json",
    db_url="https://ecollector-59983-default-rtdb.firebaseio.com/"
):
    global _DB_REF

    if _DB_REF is not None:
        return _DB_REF

    # prevent double-initialize error if imported multiple times
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {"databaseURL": db_url})

    _DB_REF = db.reference("/")
    return _DB_REF


def write_detection(type_value, confidence_value):
    ref = init_firebase()

    conf = float(confidence_value)
    if conf <= 1.0:
        conf = conf * 100.0
    conf = int(round(conf))

    ottawa_tz = ZoneInfo("America/Toronto")
    now_ottawa = datetime.datetime.now(ottawa_tz)

    new_detection_data = {
        "type": type_value,
        "confidence": conf,
        "timestampOttawa": now_ottawa.strftime("%Y-%m-%d %I:%M %p"),
        "timestamp": int(now_ottawa.timestamp() * 1000),
    }

    ref.child("detections/current").set(new_detection_data)
    ref.child("detections/history").push(new_detection_data)


if __name__ == "__main__":
    write_detection("garbage", 66)