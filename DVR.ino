#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
int left = 5;  //d1
int right = 4;  //d2
int front = 14;  //d5
int back = 12;  //d6
int light = 13; //d7
int horn = 2; //d4
int m1=110;
int nPWM=125;
bool isNeutral=false;
int minStepSize=50; 
void connectt()
{
  client = server.available();
  if (client)
  {
    Serial.println("Connected to client");
    client.write("Well Come Back");
  }
}

void setup () {
  pinMode(horn, OUTPUT);
  digitalWrite(horn, HIGH);

  pinMode(left, OUTPUT);
  digitalWrite(left, LOW);

  pinMode(right, OUTPUT);
  digitalWrite(right, LOW);

  pinMode(front, OUTPUT);
  digitalWrite(front, LOW);

  pinMode(back, OUTPUT);
  digitalWrite(back, LOW);

  pinMode(light, OUTPUT);
  digitalWrite(light, LOW);

  Serial.begin(115200);

#ifndef ESP8266
  while (!Serial); // wait for serial port to connect. Needed for native USB
#endif

  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_BHANU", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
}
 
 
void performAction(String ch) {
  Serial.println(ch);
  if (ch == "W")
  { 
    digitalWrite(front, LOW);
    digitalWrite(back, LOW); 
    if(isNeutral)
     analogWrite(front, nPWM);
     else 
     analogWrite(front, 255);
  }
  else if (ch == "S")
  {
    digitalWrite(back, LOW);
    digitalWrite(front, LOW);
    if(isNeutral)
     analogWrite(back, nPWM);
     else 
     analogWrite(back, 255); 
  }
  else if (ch == "A")
  {
    digitalWrite(left, LOW);
    digitalWrite(right, LOW);
     analogWrite(left, m1);  
  }
  else if (ch == "D")
  {
    digitalWrite(right, LOW);
    digitalWrite(left, LOW);
     analogWrite(right, m1);   
  }
  else if (ch == "w")
  {
    digitalWrite(front, LOW);
  }
  else if (ch == "s")
  {
    digitalWrite(back, LOW);
  }
  else if (ch == "a")
  {
    digitalWrite(left, LOW);
     analogWrite(right, m1); 
    delay(minStepSize);
    digitalWrite(right, LOW);
  }
  else if (ch == "d")
  {
    digitalWrite(right, LOW);
  analogWrite(left, m1); 
    delay(minStepSize);
    digitalWrite(left, LOW);
  }
  else if (ch == "L")
  {
    digitalWrite(light, HIGH);
  }
  else if (ch == "l")
  {
    digitalWrite(light, LOW);
  }
  else if (ch == "B")
  {
   digitalWrite(horn, LOW);  
  }
  else if (ch == "b")
  {
   digitalWrite(horn, HIGH);
  }
   else if (ch == "N")
  {
   isNeutral=true;
  }
    else if (ch == "n")
  {
   isNeutral=false;
  }
}
void loop () {

  while (Serial.available() > 0)
  {
    char ch = Serial.read();
    if (ch != '\0' )
    {
      performAction(String(ch));
    }
  }

  if (!client)
    connectt();
  else
  {
    while (client.available() > 0)
    {
      char ch = client.read();
      if (ch != '\0' )
      {
        performAction(String(ch));
      }
    }
  }
}
