#include <SPI.h>
#include <LoRa.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
WiFiServer server(8080);
WiFiClient client;
#define ss 15
#define rst 16
#define dio0 2
int LED = 2;
String state = "1";
void connectt() {
  client = server.available();
  if (client) {
    Serial.println("Connected to client state == " + state);
    client.println(state);
  }
}
void setup() {
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  Serial.begin(115200);
  Serial.println("LoRa Sender");
  LoRa.setPins(ss, rst, dio0);
  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_LORA_S", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
}
void writeToClient(String data) {
  if (client) client.println(data);
}

void loop() {
  Serial.print("Sending packet: ");
  Serial.println(state);
  if (!client) {
    connectt();
  }
  else if (client.available())
  {
    String dataFromServer = client.readStringUntil('\r');
    writeToClient(dataFromServer);
    if (dataFromServer == "A" || dataFromServer == "1") {
      state = dataFromServer;
      digitalWrite(LED, LOW );
    }
    else if (dataFromServer == "a" || dataFromServer == "0") {

      state = dataFromServer;
      digitalWrite(LED, HIGH);
    }
    Serial.println(dataFromServer);
  }
  LoRa.beginPacket();
  LoRa.print(state);
  LoRa.endPacket();
}
