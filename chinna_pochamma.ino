#include <Ticker.h>
#include <ESP8266WiFi.h>
#include "RTClib.h"
WiFiServer server(8080);
WiFiClient client;
RTC_DS1307 rtc;
Ticker blinker;
int SSR = 14;  //d5
int SB = 12;  //d6
int LDR = A0;
int timeOut =  60 * 10;
int statemode = 0; //0 ldr, 1= switch 2=client
String timeStamp="";
void changeState() {
  Serial.println("Time Out");
  statemode = 0;
  blinker.detach();
}
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

}
void startTimer()
{
  blinker.detach();
  Serial.println("Time Started");
  blinker.attach(timeOut, changeState);
}

void loop()
{
  while (!rtc.begin()) {
    if (client)
      client.write("Couldn't find RTC");
    else {
      connectt();
    }
    Serial.println("Couldn't find RTC");
    delay(1000);
  }
  DateTime now = rtc.now();
  String timeStamp=(String((now.year()))+"/"+String((now.month()))+"/"+String((now.day()))+" "+String((now.hour()))+":"+String((now.minute()))+":"+String((now.second())));
 Serial.println(timeStamp); 
  if (client)
  {
    while (client.available() > 0)
    {
      char ch = client.read();
      Serial.println(ch);
      if (ch == 'a')
      { 
        digitalWrite(SSR, LOW);
      }
      else if (ch == 'A')
      { 
        digitalWrite(SSR, HIGH);
      }
      startTimer();
      statemode = 2;
    }
  }
  else connectt();

  if (statemode == 0 && now.year() < 2030 && now.year() > 2000)
  {
    digitalWrite(SSR, (now.hour() >= 18 || (now.hour() <= 6)) ? HIGH : LOW);
  }

  if (statemode == 1 )
  {
    if (digitalRead(SB) == LOW)
    {
      digitalWrite(SSR, !digitalRead(SSR));
      delay(1500);
      statemode = 1;
      startTimer();
    }
  }
 
}
