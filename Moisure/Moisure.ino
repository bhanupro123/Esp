#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

// Replace with your network credentials
const char* ssid = "Galaxy F23 5G";
const char* password = "42994299";
bool isRequiredInit=false;
bool isTankFilled = false;
const int d1 = 5; // motor
const int d2 = 4; // sw2 kitchen //NC
const int d3 = 0; //sw1 tank //NO
int moisture_Pin= 0; // Soil Moisture Sensor input at Analog PIN A0
int moisture_value= 0, moisture_state = 0xFF;
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
  Serial.print("MOISTURE LEVEL : ");
    moisture_value= analogRead(moisture_Pin); 
    Serial.println(moisture_value);

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
  else{ 
    ws.textAll("$"+String(moisture_value));
  }
  
  if(WiFi.status() == WL_CONNECTED)
   ws.cleanupClients();
 delay(1000);
}
 

 