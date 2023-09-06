 
 
/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

const int d2 = 12; 

void setup() {
  pinMode(d2, OUTPUT);
}

void loop() {
 digitalWrite(d2, HIGH);
 delay(1000); 
 delay(1000);
}










// 
//const int sensor_pin = A1;
//int buzzer = 12;
//void setup() {
//  Serial.begin(115200);  
//  pinMode(buzzer,OUTPUT);
//}
//
//void loop() {
//  
// int sensor_analog = analogRead(sensor_pin);
//   Serial.print("sensor_analog = ");
//  Serial.print(sensor_analog);
//  Serial.print("%\n");
//  if(sensor_analog<380)
//  { 
//    digitalWrite(buzzer,HIGH);
//  }
//  else{
//    digitalWrite(buzzer,LOW);
//  }
//  delay(1000);
//  
//
//}
