 
 // WiFi.begin("ZTE_2.4G_bP7u3G","zu525b3G");
 
#include <Arduino.h>
#include "WebSocketClient.h"
#include "ESP8266WiFi.h"
    
WebSocketClient ws(false);
    
void setup() {
  Serial.begin(115200);
 WiFi.begin("ZTE_2.4G_bP7u3G","zu525b3G");
    
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}
    
void loop() {
  if (!ws.isConnected()) {
    ws.connect("ws://192.168.1.3", "/", 8080);
    Serial.println("Not connected!");
  } else {
    ws.send("hello");
    
    String msg;
    if (ws.getMessage(msg)) {
      Serial.println(msg);
    }
  }
  delay(500);
}
