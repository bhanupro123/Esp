#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
int left = 5;  //d1
int right = 4;  //d2
int front = 14;  //d5
int back = 12;  //d6
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
  pinMode(left, OUTPUT);
  digitalWrite(left, LOW);
  pinMode(right, OUTPUT);
  digitalWrite(right, LOW);
  pinMode(front, OUTPUT);
  digitalWrite(front, LOW);
  pinMode(back, OUTPUT);
  digitalWrite(back, LOW);
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
    digitalWrite(back, LOW);
    digitalWrite(front, HIGH);
  }
  else if (ch == "S")
  {
    digitalWrite(front, LOW);
    digitalWrite(back, HIGH);
  }
  else if (ch == "A")
  {
    digitalWrite(right, LOW);
    digitalWrite(left, HIGH);
  }
  else if (ch == "D")
  {
    digitalWrite(left, LOW);
    digitalWrite(right, HIGH);
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
  }
  else if (ch == "d")
  {
    digitalWrite(right, LOW);
  }
  
}
void loop () {

  while (Serial.available() > 0)
  {
    char ch=Serial.read();
    if(ch!= '\0' )
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
      char ch=client.read();
       if(ch!= '\0' )
    {
      performAction(String(ch));
    }
    }
  }
}
