#include <SPI.h>
#include <LoRa.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
WiFiServer server(8080);
WiFiClient client;
 String state = "0";
int LED = 2;   //d4
#define ss 15
#define rst 16
#define dio0 2
bool isClient = false;
void connectt() {
  client = server.available();
  if (client) { 
  if (digitalRead(LED)==HIGH) {
    client.println("a");
  }
  else  {
     client.println("A");
  } 
   Serial.println("Connected to client");
  }
     
     
}
void setup() { 
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  Serial.begin(115200);  
  Serial.println("LoRa Receiver");
LoRa.setPins(ss, rst, dio0);
  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_LORA_R", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
}
void writeToClient(String data1) {
    if (data1 == "A" || data1 == "1") {
       state = data1;
    digitalWrite(LED, LOW );
  }
  else if (data1 == "a" || data1 == "0") {
    digitalWrite(LED, HIGH);
      state = data1;
  }
 if (client) 
  { 
  client.println(data1);
  } 
  Serial.println(data1);
}
 
void loop() {
  // try to parse packet
   if (!client) {
    connectt();
  } 
  int packetSize = LoRa.parsePacket();
  if (packetSize) { 
    while (LoRa.available()) {
      String c=LoRa.readString(); 
        writeToClient(c);
    } 
  } 
}
