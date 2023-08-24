#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client; 
int SSR = 5;  //d5
bool isClient = false;
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
  pinMode(SSR, OUTPUT);
  digitalWrite(SSR, LOW);
  Serial.begin(115200);

#ifndef ESP8266
  while (!Serial); // wait for serial port to connect. Needed for native USB
#endif

 
      //DS1307_RTC.adjust(DateTime(F(__DATE__), F(__TIME__)));
  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_BHANU", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
}
void performAction(char ch) {
  if (ch == '1')
  {
    isClient = true;
    digitalWrite(SSR, HIGH);
  }
  else if (ch == '0')
  {
    isClient = false;
    digitalWrite(SSR, LOW);
  }
}
void loop () { 
  while (Serial.available() > 0)
  {
    char ch = Serial.read();
    performAction(ch);
  }
  if (!client)
  {
    connectt();
  }
  else
  {
    while (client.available() > 0)
    {
      char ch = client.read();
      performAction(ch);
    }
  }
}
