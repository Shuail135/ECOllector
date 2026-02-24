import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import datetime # Import the datetime module
from zoneinfo import ZoneInfo

cred = credentials.Certificate('ecollector-59983-firebase-adminsdk-fbsvc-d0f3ee6b9b.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://ecollector-59983-default-rtdb.firebaseio.com/'
})

ref = db.reference('/')

def write_detection(type_value, confidence_value):
    ottawa_tz = ZoneInfo("America/Toronto")

    now_ottawa = datetime.datetime.now(ottawa_tz)

    new_detection_data = {
        "type": type_value,
        "confidence": confidence_value,
        # Ottawa time stored explicitly
        "timestampOttawa": now_ottawa.strftime("%Y-%m-%d %I:%M %p"),
        # Optional: keep epoch for sorting
        "timestamp": int(now_ottawa.timestamp() * 1000)
    }

    ref.child("detections/current").set(new_detection_data)
    ref.child("detections/history").push(new_detection_data)

if __name__ == "__main__":
    #write_detection("paper", 76)
    #write_detection("plastic", 95)
    write_detection("garbage", 70)

