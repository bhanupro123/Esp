#include <Ticker.h>
#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client; 
Ticker blinker;
int SSR = 14;  //d5
int SB = 12;  //d6  
int LDR = A0; 
int timeOut =  60 * 5;
int statemode = 0; //0 ldr, 1= switch 2=client

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
  if (client)
  {
    while (client.available() > 0)
    {
      char ch=client.read();
      Serial.println(ch); 
      if(ch=='a')
      {
//        Serial.println("matched with aaaa");
        digitalWrite(SSR,LOW);
      }
      else if(ch=='A')
      {
//        Serial.println("matched with AAAA");
      digitalWrite(SSR,HIGH);
      }
      startTimer();
      statemode = 2;
    }
  }
  else connectt();
  if (statemode == 0)
  {
    int sensorValue = analogRead(LDR);
    if (sensorValue<=760)
    { 
      digitalWrite(SSR, LOW);
    }
    else if(sensorValue>=860)
    {
      digitalWrite(SSR, HIGH);
    }
    Serial.println(String(sensorValue));
  }
  if (statemode == 1 || statemode == 0)
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


 
