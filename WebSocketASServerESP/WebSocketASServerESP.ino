//reference 
//https://randomnerdtutorials.com/esp8266-nodemcu-websocket-server-arduino/


#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
const int d1 = 5; // motor
const int d2 = 4; // sw2 kitchen //NC
const int d5 = 14; //sw1 tank //NO
const int d6=12; //timer lights//12 
boolean isWatered=false;
int numberOfClients=0;
String latestCommand="";
String lightsCommand="";
int moisture_Pin= 0; // Soil Moisture Sensor input at Analog PIN A0
int moisture_value= 0;
AsyncWebServer server(80);
AsyncWebSocket ws("/");
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
              if(type==WS_EVT_DATA)
              { 
      String s="";
      for (int i = 0; i < len; ++i) 
      {
      s=s+String(static_cast<char>(data[i])); 
      }
      Serial.println(s); 
      if(s=="K1")
      {
        latestCommand=s;
        Serial.println("Kitchen on"); 
         digitalWrite(d2, HIGH); 
         digitalWrite(d5, HIGH);  
         digitalWrite(d1, HIGH);
         ws.textAll(s);   
      }
     
      else if(s=="K0")
      {
        latestCommand=s;
          Serial.println("Kitchen off"); 
       digitalWrite(d5, LOW);  
         digitalWrite(d2, LOW);
         digitalWrite(d1, LOW);
         ws.textAll(s); 
      }
      else if(s=="L1")
      {
        lightsCommand=s;
          Serial.println("Lights on"); 
       digitalWrite(d6, HIGH);
         ws.textAll(s); 
      }
      else if(s=="L0")
      {
      lightsCommand=s;
          Serial.println("Lights off"); 
       digitalWrite(d6, LOW);
         ws.textAll(s); 
      }
     
        else if(s=="T1")
      {
        latestCommand=s;
        Serial.println("Tank on"); 
       digitalWrite(d5, LOW); //tank 
        digitalWrite(d2, LOW); //kitchen 
         digitalWrite(d1, HIGH);  //motor
           ws.textAll(s); 
      }
      else if(s=="T0")
      {
        latestCommand=s;
        Serial.println("Tank off"); 
       digitalWrite(d5, LOW); //tank 
        digitalWrite(d2, LOW); //kitchen 
         digitalWrite(d1, LOW);  //motor
        ws.textAll(s); 
      }
              }
               switch (type) {
    case WS_EVT_CONNECT:
      client->text(latestCommand);
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      numberOfClients=numberOfClients+1;
      client->text(lightsCommand);
      Serial.println("Number of clients "+String(numberOfClients));
      ws.textAll("N"+String(numberOfClients));
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      numberOfClients=numberOfClients-1;
      Serial.println("Number of clients "+String(numberOfClients));
      ws.textAll("N"+String(numberOfClients));
      break;
    case WS_EVT_DATA:
      break;
    case WS_EVT_PONG:
      break;
    case WS_EVT_ERROR:
      Serial.printf("WebSocket ERROR");
      break;
  }
             }

       void initWebSocket() {
        ws.cleanupClients();
  ws.onEvent(onEvent);
  server.addHandler(&ws); 
}
void setup()
{
  pinMode(d1, OUTPUT);
  digitalWrite(d1, LOW);
   pinMode(d2, OUTPUT);
  digitalWrite(d2, LOW);
   pinMode(d5, OUTPUT);
  digitalWrite(d5, LOW);
   pinMode(d6, OUTPUT);
  digitalWrite(d6, LOW);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_BHANU", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  initWebSocket(); 
  server.begin();   
}

 
void loop()
{ 
}
