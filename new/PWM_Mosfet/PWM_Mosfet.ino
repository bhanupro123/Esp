
// const int ledPin = 5; 
// const int led = 4; 

// void setup() {
//  analogWriteRange(1023);
//   analogWriteFreq(1000*100);


//   Serial.begin(115200);
// }




// void loop() {
//   // increase the LED brightness
//   for(int dutyCycle = 0; dutyCycle < 1023; dutyCycle++){   
//     // changing the LED brightness with PWM
//     analogWrite(ledPin, 1023);
//      analogWrite(led, dutyCycle);
//     delay(100);
//   }

//   // decrease the LED brightness
//   for(int dutyCycle = 1023; dutyCycle > 0; dutyCycle--){
//     // changing the LED brightness with PWM
//    analogWrite(ledPin, 520);
//      analogWrite(led, dutyCycle);
//     delay(100);
//   }
// }

void setup()  
{  
  pinMode(6, OUTPUT); // the declared pin must be among the PWM pins.  
}  
void loop()  
{  
  analogWrite(6, 255); // brightness increases as value increases  
  delay(1000);   
  analogWrite(6, 180);// brightness level  
  delay(1000);   
  analogWrite(6, 80);   
  delay(1000);   
  analogWrite(6, 20); // brightness decreases as value decreases  
  delay(1000);   
}  