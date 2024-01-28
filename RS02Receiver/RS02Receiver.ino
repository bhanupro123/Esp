/*
  LoRa Duplex communication

  Sends a message every half second, and polls continually
  for new incoming messages. Implements a one-byte addressing scheme,
  with 0xFF as the broadcast address.

  Uses readString() from Stream class to read payload. The Stream class'
  timeout may affect other functuons, like the radio's callback. For an

  created 28 April 2017
  by Tom Igoe
*/
#include <SPI.h>  // include libraries
#include <LoRa.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <EEPROM.h>
#define EEPROM_SIZE 12
const int csPin = 15;     // LoRa radio chip select
const int resetPin = 16;  // LoRa radio reset
const int irqPin = 12;
const int motorLed = 0;  // change for your board; must be a hardware interrupt pin
const int LED = 2;
const int motorRelay = 4;
const int switchinput = 5;
String outgoing;  // outgoing message
String motorstatus = "off";
String autoStartMachine = "off";
byte msgCount = 0;         // count of outgoing messages
byte localAddress = 0xAA;  // address of this device
byte destination = 0xBB;   // destination to send to
long lastSendTime = 0;     // last send time
int interval = 2000;
bool clicked = false;  // interval between sends
bool canISend = true;
AsyncWebServer server(80);
AsyncWebSocket ws("/");
int address = 0;
byte inputDelay = 0;
void initWebSocket() {
  ws.cleanupClients();
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_DATA) {
    String state = "";
    for (int i = 0; i < len; ++i) {
      state = state + String(static_cast<char>(data[i]));
    }
    Serial.println(state);
    if (state == "M=on" && motorstatus == "off") {
      inputDelay = 2;
      // EEPROM.put(address, 1);
      // EEPROM.commit();
      client->text(state);
      motorstatus = "on";
    } else if (state == "M=off" && motorstatus == "on") {
      inputDelay = 2;
      // EEPROM.put(address, 0);
      // EEPROM.commit();
      client->text(state);
      motorstatus = "off";
    }
  }
  switch (type) {
    case WS_EVT_CONNECT:
      client->text("M=" + motorstatus);
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      client->text("A=" + autoStartMachine);
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      // ws.textAll("N"+String(numberOfClients));
      break;
    case WS_EVT_DATA:
      break;
    case WS_EVT_PONG:
      break;
    case WS_EVT_ERROR:
      Serial.println("WebSocket ERROR");
      break;
  }
}

void setup() {
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  pinMode(motorLed, OUTPUT);
  digitalWrite(motorLed, LOW);
  pinMode(switchinput, INPUT);
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);  // initialize serial
  Serial.println("LoRa Duplex RECEIVED");
  int readId;
  EEPROM.get(address, readId);
  if (readId == 0) {
    autoStartMachine = "off";
    motorstatus = "off";
  } else if (readId == 1) {
    inputDelay = 2;
    autoStartMachine = "on";
    motorstatus = "on";
  }

  // override the default CS, reset, and IRQ pins (optional)
  LoRa.setPins(csPin, resetPin, irqPin);  // set CS, reset, IRQ pin

  if (!LoRa.begin(433E1)) {  // initialize ratio at 915 MHz
    Serial.println("LoRa init failed. Check your connections.");
    while (true)
      ;  // if failed, do nothing
  }
  Serial.println("LoRa Duplex");
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_LORA_R", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  initWebSocket();
  server.begin();
  Serial.println("LoRa init succeeded.");
}

void loop() {
  if (digitalRead(switchinput) == LOW && clicked == false) {
    clicked = true;
    inputDelay = 2;
    if (motorstatus == "on") {
      sendMessage("off");
      motorstatus = "off";
      digitalWrite(motorLed, LOW);
    } else {
      sendMessage("on");
      motorstatus = "on";
      digitalWrite(motorLed, HIGH);
    }
    lastSendTime = millis();  // timestamp the message
    interval = random(2000) + 1000;
  } else if (digitalRead(switchinput) == HIGH) {
    clicked = false;
  }

  if (millis() - lastSendTime > interval) {
    digitalWrite(LED, HIGH);
    sendMessage(motorstatus);
    Serial.println("Sending " + motorstatus);
    lastSendTime = millis();         // timestamp the message
    interval = random(2000) + 1000;  // 2-3 seconds
    if(inputDelay!=0)
    {
      inputDelay = inputDelay + 2;
    }
  }
  if (motorstatus == "on") {
    digitalWrite(motorLed, HIGH);
  } else {
    digitalWrite(motorLed, LOW);
  }
  // parse for a packet, and call onReceive with the result:
  if (inputDelay == 0) {
    onReceive(LoRa.parsePacket());
  } else if (inputDelay >= 6) {
    onReceive(LoRa.parsePacket());
  }
}

void sendMessage(String outgoing) {
  LoRa.beginPacket();             // start packet
  LoRa.write(destination);        // add destination address
  LoRa.write(localAddress);       // add sender address
  LoRa.write(msgCount);           // add message ID
  LoRa.write(outgoing.length());  // add payload length
  LoRa.print(outgoing);           // add payload
  LoRa.endPacket();               // finish packet and send it
  msgCount++;                     // increment message ID
}

void onReceive(int packetSize) {
  if (packetSize == 0) return;  // if there's no packet, return
  inputDelay = 0;
  // read packet header bytes:
  int recipient = LoRa.read();        // recipient address
  byte sender = LoRa.read();          // sender address
  byte incomingMsgId = LoRa.read();   // incoming msg ID
  byte incomingLength = LoRa.read();  // incoming msg length

  String incoming = "";
  digitalWrite(LED, LOW);
  while (LoRa.available()) {
    incoming += (char)LoRa.read();
  }
  if (incoming == "on" || incoming == "off") {
    motorstatus = incoming;
    canISend = false;
  }

  if (incomingLength != incoming.length()) {  // check length for error
    Serial.println("error: message length does not match length" + incoming);
    return;  // skip rest of function
  }

  // if the recipient isn't this device or broadcast,
  if (recipient != localAddress && recipient != destination) {
    Serial.println("This message is not for me.");
    return;  // skip rest of function
  }

  int index = incoming.indexOf("/");
  String incomingMotorState = "";
  String incomingAutoStartMotorState = "";
  if (index > -1) {
    for (int i = 0; i < index; i++) {
      incomingMotorState = incomingMotorState + (incoming.charAt(i));
    }
    if (incomingMotorState != "") {

      if (incomingMotorState == "on" && motorstatus == "off") {
        ws.textAll("M=on");
        motorstatus = "on";
      } else if (incomingMotorState == "off" && motorstatus == "on") {
        ws.textAll("M=off");
        motorstatus = "off";
      }
    }
    for (int i = index + 1; i < incoming.length(); i++) {
      incomingAutoStartMotorState = incomingAutoStartMotorState + (incoming.charAt(i));
    }
    if (incomingAutoStartMotorState != "") {

      if (incomingAutoStartMotorState == "on" && autoStartMachine == "off") {
        EEPROM.put(address, 1);
        EEPROM.commit();
        autoStartMachine = "on";
        ws.textAll("A=on");
      } else if (incomingAutoStartMotorState == "off" && autoStartMachine == "on") {
        EEPROM.put(address, 0);
        EEPROM.commit();
        autoStartMachine = "off";
        ws.textAll("M=off");
      }
    }
  }
  // if message is for this device, or broadcast, print details:
  // Serial.println("Received from: 0x" + String(sender, HEX));
  // Serial.println("Sent to: 0x" + String(recipient, HEX));
  // Serial.println("Message ID: " + String(incomingMsgId));
  // Serial.println("Message length: " + String(incomingLength));
  Serial.println("Message: " + incoming);

  // Serial.println("RSSI: " + String(LoRa.packetRssi()));
  // Serial.println("Snr: " + String(LoRa.packetSnr()));
  Serial.println();
}
