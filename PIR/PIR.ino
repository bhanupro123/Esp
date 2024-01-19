#define pirPin 2
int calibrationTime = 30;
long unsigned int lowIn;
long unsigned int pause = 1000;
boolean lockLow = true;
boolean takeLowTime;
int PIRValue = 0;

void setup() {
   Serial.begin(115200);
   pinMode(pirPin, INPUT);
}
void PIRSensor() {
   if(digitalRead(pirPin) == HIGH) {
         Serial.println("Motion detected.");
         delay(50);
      
   }
   if(digitalRead(pirPin) == LOW) {
      
         Serial.println("Motion ended.");
         delay(50);
      }
       delay(2000);
   }
void loop() {
   PIRSensor();
}
 

 


  
