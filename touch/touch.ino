int touch = 10;  // pin for touch sensor
int ledPin = 12; // pin for the LED
const int sensor_pin = A1;
void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(touch, INPUT);
}

void loop() {
  float moisture_percentage;
  int sensor_analog;
  sensor_analog = analogRead(sensor_pin);
  moisture_percentage = ( 100 - ( (sensor_analog / 1023.00) * 100 ) );
  Serial.print("sensor_analog = ");
  Serial.print(sensor_analog);
  Serial.print("%\n\n");
  delay(1000);
  int touchValue = digitalRead(touch);
  if (touchValue == HIGH) {
    digitalWrite(ledPin, LOW);
    Serial.println("touched");
  }
  else {
    digitalWrite(ledPin, HIGH);
    Serial.println("not touched");
  }
  delay(50);

}
