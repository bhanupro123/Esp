#include "RTClib.h"
#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
RTC_DS1307 rtc;

int SSR = 14;  //d5
int SB = 12;  //d6
int sbMode=0;
int LDR=A0;
String timeStamp="";
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

void setup()
{
  
  pinMode(SSR, OUTPUT);   
  pinMode(LDR, INPUT);   
  digitalWrite(SSR, LOW);
    pinMode(SB, INPUT);  
  Serial.begin(115200);
  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_BHANU", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
   if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1) delay(10);
  }

   //rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
}

 
void loop()
{
  int sensorValue = analogRead(LDR); 
sbMode=digitalRead(SB);
if(!isClient)
{
     digitalWrite(SSR, sensorValue>800?HIGH:LOW);
}
    DateTime now = rtc.now();
    if(sbMode==LOW)
  { 
         isClient=!isClient;
       int temp=digitalRead(SSR);
       if(temp==LOW)
       {
        isClient=true;
        digitalWrite(SSR, HIGH);
        delay(500);
       }
       else{
          isClient=false;
        digitalWrite(SSR, LOW);
        delay(500);
       }
  }
//    if (now.year() < 2030&&now.year() > 2000)
//  {
//    if(!isClient)
//    {
//      if (now.hour() >= 18 || (now.hour() <= 6))
//    {
//      digitalWrite(SSR, HIGH);
//    }
//    else
//    {
//      digitalWrite(SSR, LOW);
//    }
//    }
//  }
  
     
    timeStamp=(String((now.year()))+"/"+String((now.month()))+"/"+String((now.day()))+" "+String((now.hour()))+":"+String((now.minute()))+":"+String((now.second()))+" - "+String(sensorValue));
  Serial.println(timeStamp); 
      while (Serial.available() > 0)
      {
        char ch = Serial.read();
        client.write(ch);
        if(ch=='A')
      {
        Serial.println("LED ON===>>>>");
         digitalWrite(SSR, HIGH);  
      }
      else if(ch=='a')
      {
         Serial.println("LED OFF===>>>>"); 
         digitalWrite(SSR, LOW); 
      }
      Serial.println(ch);
      }
  if (!client)
  {
    connectt();
  }
  else
  { 
   client.println(timeStamp);
    while (client.available()>0)
    {
      char ch = client.read();
      if(ch=='A')
      {
        Serial.println("LED ON===>>>>");
         digitalWrite(SSR, HIGH); 
      }
      else if(ch=='a')
      {
         Serial.println("LED OFF===>>>>"); 
         digitalWrite(SSR, LOW); 
      }
      Serial.println(ch); 
    }
    
  }
  delay(500);
}
