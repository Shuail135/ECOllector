import time
import serial

LABEL_TO_CMD = {
    "garbage": "g",
    "plastic": "p",
    "paper": "c",
    "cardboard": "c",
}

class ArduinoSender:
    def __init__(self, port="/dev/ttyACM0", baud=9600, startup_delay=2.0, debug=True):
        self.port = port
        self.baud = baud
        self.startup_delay = startup_delay
        self.debug = debug
        self.ser = None

    def connect(self):
        try:
            self.ser = serial.Serial(self.port, baudrate=self.baud, timeout=1)
            time.sleep(self.startup_delay)
            if self.debug:
                print(f"Connected to {self.port} at {self.baud}")
            return True
        except Exception as e:
            if self.debug:
                print(f"Failed to connect: {e}")
            self.ser = None
            return False

    def send_label(self, label):
        if not label:
            if self.debug:
                print("send_label: empty label")
            return False

        normalized = label.strip().lower()
        cmd = LABEL_TO_CMD.get(normalized)

        if cmd is None:
            if self.debug:
                print(f"send_label: unknown label '{label}'")
            return False

        if self.ser is None:
            if self.debug:
                print("send_label: serial port not connected")
            return False

        try:
            self.ser.write(cmd.encode("utf-8"))
            self.ser.flush()
            if self.debug:
                print(f"Sent '{cmd}' for label '{normalized}'")
            return True
        except Exception as e:
            if self.debug:
                print(f"send_label failed: {e}")
            return False

    def close(self):
        if self.ser is not None:
            self.ser.close()
            self.ser = None
            if self.debug:
                print("Serial connection closed")