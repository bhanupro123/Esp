#include <ESP8266WiFi.h>
#include <WebSocketClient.h>

const char* ssid     = "Lohitha 2nd floor 2G"
const char* password = "lohitha123";
char path[] = "/";
char host[] = "ws://192.168.29.87:8080";
  
WebSocketClient webSocketClient;

// Use WiFiClient class to create TCP connections
WiFiClient client;

void setup() {
  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(5000);
  

  // Connect to the websocket server
  if (client.connect("echo.websocket.org", 80)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
    while(1) {
      // Hang on failure
    }
  }

  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {
    Serial.println("Handshake failed.");
    while(1) {
      Serial.println("Handshake failed.");
      // Hang on failure
    }  
  }

}


void loop() {
  String data;

  if (client.connected()) {
   webSocketClient.getData();
    if (data.length() > 0) {
      Serial.print("Received data: ");
      Serial.println(data);
    }
    webSocketClient.sendData(data);
  }   
  delay(3000);
  
}
