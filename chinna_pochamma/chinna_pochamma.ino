#include "RTClib.h"
#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
RTC_DS1307 DS1307_RTC;
int SSR = 14;  //d5 
bool isClient=false;
void connectt()
{
  client = server.available();
  if (client)
  {
    Serial.println("Connected to client");
    client.write("Well Come Back");
  }
}


char Week_days[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

void setup () {
   pinMode(SSR, OUTPUT);   
   digitalWrite(SSR, LOW); 
   Serial.begin(115200);

#ifndef ESP8266
  while (!Serial); // wait for serial port to connect. Needed for native USB
#endif

  if (!DS1307_RTC.begin()) {
    Serial.println("Couldn't find RTC");
    while(1);
  }
//    DS1307_RTC.adjust(DateTime(F(__DATE__), F(__TIME__)));
  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_BHANU", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
}
void performAction(char ch){
    if(ch=='1')
      {  
      isClient=true;
         digitalWrite(SSR, HIGH);     
      }
      else if(ch=='0')
      {  
            isClient=false;
         digitalWrite(SSR, LOW);    
      } 
}
void loop () {
    DateTime now = DS1307_RTC.now();
     if(now.year()>2000&&!isClient)
     { 
      if(now.hour()>=18||(now.hour()<=6))
      {
         digitalWrite(SSR, HIGH);   
      }
      else
      {
         digitalWrite(SSR, LOW);     
      }
     }
    Serial.print(now.year(), DEC);
    Serial.print('/');
    Serial.print(now.month(), DEC);
    Serial.print('/');
    Serial.print(now.day(), DEC);
    Serial.print(" "); 
    Serial.print(now.hour(), DEC);
    Serial.print(':');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    Serial.print(now.second(), DEC);
    Serial.println();
    delay(1000);
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
    while (client.available()>0)
      {
      char ch = client.read();
      performAction(ch);
      }
    }  
}
