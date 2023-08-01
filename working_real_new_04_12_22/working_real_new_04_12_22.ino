#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
int SSR = 14;  //d5
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
         digitalWrite(SSR, LOW);  
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

 
void loop()
{
      while (Serial.available() > 0)
      {
        char ch = Serial.read();
        client.write(ch);
        if(ch=='A')
      {
        Serial.println("LED ON===>>>>");
         digitalWrite(SSR, HIGH); 
         digitalWrite(LED, HIGH); 
      }
      else if(ch=='a')
      {
         Serial.println("LED OFF===>>>>");
           digitalWrite(LED, LOW); 
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
    //Serial.println("WOW Amazing zing zing");
   // client.write("H");

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
      //client.write(ch);
        //client.flush();
    }
    
  }
}
