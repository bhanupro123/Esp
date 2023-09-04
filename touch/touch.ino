int touch = 10;  // pin for touch sensor
int ledPin = 12; // pin for the LED
int out=5;//D1
void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(out, OUTPUT);
  pinMode(touch, INPUT);
}

void loop() {
   for(int i=125;i<=255;i++)
   {
    analogWrite(out,i);
    delay(10);
   }
  
  for(int i=255;i<125;i--)
   {
    analogWrite(out,i);
    delay(10);
   }
}
