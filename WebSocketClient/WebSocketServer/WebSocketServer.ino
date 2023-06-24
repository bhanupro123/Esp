#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

// Replace with your network credentials
const char* ssid = "aa";
const char* password = "00000000";
bool isRequiredInit=false;
bool isTankFilled = false;
const int d1 = 5; // motor
const int d2 = 4; // sw2 kitchen //NC
const int d3 = 0; //sw1 tank //NO

// Create AsyncWebServer object on port 80
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
        Serial.println("Kitchen on"); 
         digitalWrite(d2, HIGH); 
         digitalWrite(d3, HIGH);  
         digitalWrite(d1, HIGH);   
      }
      else if(s=="K0")
      {
          Serial.println("Kitchen off"); 
       digitalWrite(d3, LOW);  
         digitalWrite(d2, LOW);
         digitalWrite(d1, LOW);
             
      }
     
        else if(s=="T1")
      {
        Serial.println("Tank on"); 
       digitalWrite(d3, LOW); //tank 
        digitalWrite(d2, LOW); //kitchen 
         digitalWrite(d1, HIGH);  //motor
      }
      else if(s=="T0")
      {
        Serial.println("Tank off"); 
       digitalWrite(d3, LOW); //tank 
        digitalWrite(d2, LOW); //kitchen 
         digitalWrite(d1, LOW);  //motor
      }
       
         
              }
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      break;
    case WS_EVT_PONG:
      break;
    case WS_EVT_ERROR: 
      break;
  }
}

void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws); 
}

 

void setup(){
  // Serial port for debugging purposes
  Serial.begin(115200);

  pinMode(d1, OUTPUT);
  digitalWrite(d1, LOW);
   pinMode(d2, OUTPUT);
  digitalWrite(d2, LOW);
   pinMode(d3, OUTPUT);
  digitalWrite(d3, LOW);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
 
}

void loop() {
    while (WiFi.status() != WL_CONNECTED) {
    isRequiredInit=true;
    delay(1000);
    Serial.println("Connecting to WiFi..");
     Serial.println(WiFi.localIP()); 
  } 
  if(isRequiredInit)
  {
    isRequiredInit=false;
     initWebSocket();
  // Start server
  server.begin();
  }
  
  if(WiFi.status() == WL_CONNECTED)
   ws.cleanupClients();
 
}
