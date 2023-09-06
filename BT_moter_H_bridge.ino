/*
  BTS7960-43A-Driver
  made on 22 Nov 2020
  by Amir Mohammad Shojaee @ Electropeak
  Home

*/

#define RPWM 5
#define LPWM 6
#define REN 8
#define LEN 9


int pot;
int out1;
int out2;

void setup() {
  Serial.begin(115200);
  pinMode(RPWM, OUTPUT);
  pinMode(LPWM, OUTPUT);
  pinMode(LEN, OUTPUT);
  pinMode(REN, OUTPUT);
  digitalWrite(REN, HIGH);
  digitalWrite(LEN, HIGH);

}


void loop() {

  pot = analogRead(A0);
  Serial.println(pot);
  if (pot > 512) {
    out1 = map(pot, 512, 1023, 0, 255);
    
    analogWrite(LPWM, 0);
analogWrite(RPWM, out1);
  }

  if (pot < 512) {
    out2 = map(pot, 512, 0, 0, 255);
    
    analogWrite(RPWM, 0);
analogWrite(LPWM, out2);
  }
  delay(100);
}
