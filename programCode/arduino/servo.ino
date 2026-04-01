#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// PCA9685 object
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(0x40);

// Servo pulse calibration
#define SERVOMIN 125
#define SERVOMAX 575

// Channels
const uint8_t DROPPER_CH = 0;
const uint8_t RIGHT_CH   = 2;
const uint8_t LEFT_CH    = 1;

// Timing
const unsigned long STEP_INTERVAL      = 20;    // ms per 1 degree step
const unsigned long DROPPER_DELAY      = 400;   // wait after movers finish
const unsigned long DROPPER_OPEN_HOLD  = 1000;  // hold dropper open

// Dropper angles
const int DROPPER_CLOSED = 0;
const int DROPPER_OPEN   = 90;

// Starting position = garbage (middle open layout)
const int LEFT_START_ANGLE  = 45;
const int RIGHT_START_ANGLE = 135;

// Servo movement struct
struct ServoMover {
  uint8_t channel;
  int currentAngle;
  int targetAngle;
  int step;
  unsigned long lastStepTime;
  bool initialized;
};

ServoMover leftMover;
ServoMover rightMover;
ServoMover dropperMover;

// Dropper state machine
enum DropperState {
  DROPPER_IDLE,
  DROPPER_MOVING_TO_OPEN,
  DROPPER_WAIT_OPEN,
  DROPPER_MOVING_TO_CLOSED
};

DropperState dropperState = DROPPER_IDLE;
unsigned long dropperStateStart = 0;

// Scheduler for delayed drop
bool dropScheduled = false;
unsigned long moversFinishedTime = 0;

// Convert angle to PCA9685 pulse
int angleToPulse(int angle) {
  return map(angle, 0, 180, SERVOMIN, SERVOMAX);
}

// Initialize servo mover with known angle
void initMoverWithAngle(ServoMover &m, uint8_t channel, int initialAngle) {
  m.channel = channel;
  m.currentAngle = initialAngle;
  m.targetAngle = initialAngle;
  m.step = 0;
  m.lastStepTime = millis();
  m.initialized = true;
  pwm.setPWM(channel, 0, angleToPulse(initialAngle));
}

// Start a smooth move
void startMove(ServoMover &m, int targetAngle) {
  if (!m.initialized) return;

  m.targetAngle = targetAngle;

  if (m.targetAngle > m.currentAngle) {
    m.step = 1;
  } else if (m.targetAngle < m.currentAngle) {
    m.step = -1;
  } else {
    m.step = 0;
  }
}

// Update one servo smoothly
void updateMover(ServoMover &m) {
  if (!m.initialized || m.step == 0) return;

  unsigned long now = millis();
  if (now - m.lastStepTime >= STEP_INTERVAL) {
    m.lastStepTime = now;
    m.currentAngle += m.step;

    if ((m.step > 0 && m.currentAngle >= m.targetAngle) ||
        (m.step < 0 && m.currentAngle <= m.targetAngle)) {
      m.currentAngle = m.targetAngle;
      m.step = 0;
    }

    pwm.setPWM(m.channel, 0, angleToPulse(m.currentAngle));
  }
}

// Check if both routing servos finished
bool bothMoversFinished() {
  return (leftMover.step == 0 && rightMover.step == 0);
}

// Routing positions
// Plastic = left
void moveToPlastic() {
  startMove(leftMover, 45);
  startMove(rightMover, 45);
}

// Cardboard = right
void moveToCardboard() {
  startMove(leftMover, 135);
  startMove(rightMover, 135);
}

// Garbage = middle open
void moveToGarbage() {
  startMove(leftMover, 45);
  startMove(rightMover, 135);
}

// Schedule drop after movers finish
void scheduleDropper() {
  dropScheduled = true;
  moversFinishedTime = 0;
}

// Trigger dropper state machine
void triggerDropper() {
  if (dropperState == DROPPER_IDLE) {
    startMove(dropperMover, DROPPER_OPEN);
    dropperState = DROPPER_MOVING_TO_OPEN;
  }
}

// Update delayed scheduler
void updateDropperScheduler() {
  unsigned long now = millis();

  if (dropScheduled) {
    if (bothMoversFinished()) {
      if (moversFinishedTime == 0) {
        moversFinishedTime = now;
      }

      if (now - moversFinishedTime >= DROPPER_DELAY) {
        triggerDropper();
        dropScheduled = false;
        moversFinishedTime = 0;
      }
    } else {
      moversFinishedTime = 0;
    }
  }
}

// Update dropper state machine
void updateDropper() {
  unsigned long now = millis();

  switch (dropperState) {
    case DROPPER_IDLE:
      break;

    case DROPPER_MOVING_TO_OPEN:
      updateMover(dropperMover);
      if (dropperMover.step == 0) {
        dropperState = DROPPER_WAIT_OPEN;
        dropperStateStart = now;
      }
      break;

    case DROPPER_WAIT_OPEN:
      if (now - dropperStateStart >= DROPPER_OPEN_HOLD) {
        startMove(dropperMover, DROPPER_CLOSED);
        dropperState = DROPPER_MOVING_TO_CLOSED;
      }
      break;

    case DROPPER_MOVING_TO_CLOSED:
      updateMover(dropperMover);
      if (dropperMover.step == 0) {
        dropperState = DROPPER_IDLE;
      }
      break;
  }
}

void setup() {
  Serial.begin(9600);

  pwm.begin();
  pwm.setPWMFreq(60);
  delay(500);

  // Start in garbage position
  initMoverWithAngle(leftMover, LEFT_CH, LEFT_START_ANGLE);
  initMoverWithAngle(rightMover, RIGHT_CH, RIGHT_START_ANGLE);
  initMoverWithAngle(dropperMover, DROPPER_CH, DROPPER_CLOSED);
}

void loop() {
  if (Serial.available()) {
    char state = tolower(Serial.read());

    switch (state) {
      case 'p':   // plastic = left
        moveToPlastic();
        scheduleDropper();
        break;

      case 'c':   // cardboard = right
        moveToCardboard();
        scheduleDropper();
        break;

      case 'g':   // garbage = middle
        moveToGarbage();
        scheduleDropper();
        break;
    }
  }

  updateMover(leftMover);
  updateMover(rightMover);
  updateDropperScheduler();
  updateDropper();
}