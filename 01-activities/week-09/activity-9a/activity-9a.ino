// DM2008 — Activity 9a
// Mapping Sensors (30 min)
//
// Adjust and refine until the response feels smooth and natural.

const int usSensorPin = A0;
const float usMaxRange = 520.0;
const float dataSize = 1023.0;

// TODO: declare your LED pin here (must be a PWM pin, marked with ~)
// const int ledPin = 9;

float sensorVal, distVal;
int ledPin = 9;
int ledPin2 = 10;
int brightness = 0;
int brightness2 = 0;

void setup() {
  Serial.begin(9600);
  // TODO: set up your LED pin here (hint: pinMode)
}

void loop() {
  sensorVal = analogRead(usSensorPin);
  distVal = sensorVal * usMaxRange / dataSize;

  // Clamp to a range that suits a desk / classroom setup (cm)
  if (distVal < 2)   distVal = 2;
  if (distVal > 50) distVal = 50;

  // map() rescales a value from one range to another
  // here: distance (5–100cm) becomes brightness (255–0)
  // the output range is flipped so that CLOSER = BRIGHTER
  // (note: Arduino's map() uses whole numbers, so decimals are dropped)
  brightness = map(distVal, 2, 50, 255, 0);
  brightness = constrain(brightness, 0, 255);

  brightness2 = map(distVal, 2, 50, 0, 255);
  brightness2 = constrain(brightness2, 0, 255);

  // TODO: use analogWrite() to send brightness to your LED pin
  analogWrite(ledPin, brightness);
  analogWrite(ledPin2, brightness2);

  Serial.print(distVal);
  Serial.println(" cm");
  Serial.print("Brightness: ");
  Serial.println(brightness);
  Serial.print("Brightness2: ");
  Serial.println(brightness2);

  delay(50);
}
