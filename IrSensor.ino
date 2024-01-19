 
int SSR = 5;  //d5
 
 
 
void setup () {
  pinMode(SSR, INPUT); 
  Serial.begin(115200);
 
  Serial.println();
   
}
 
void loop () {
 int state=digitalRead(SSR);
 Serial.println(String(state));
  delay(1000);
}
