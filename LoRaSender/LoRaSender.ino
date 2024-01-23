/*
  LoRa Duplex communication

  Sends a message every half second, and polls continually
  for new incoming messages. Implements a one-byte addressing scheme,
  with 0xFF as the broadcast address.

  Uses readString() from Stream class to read payload. The Stream class'
  timeout may affect other functuons, like the radio' callback. For an

  created 28 April 2017
  by Tom Igoe
*/

#include <SPI.h>
#include <LoRa.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <EEPROM.h>
#include "RTClib.h"
RTC_DS3231 rtc;
char daysOfTheWeek[7][12] = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };

AsyncWebServer server(80);
AsyncWebSocket ws("/");

const int csPin = 15;     // LoRa radio chip select
const int resetPin = 16;  // LoRa radio reset
const int irqPin = 0;     // change for your board; must be a hardware interrupt pin
const int LED = 2;
const int trigger = 0;
String timestamp = "";
String outgoing;  // outgoing message
#define EEPROM_SIZE 12
byte msgCount = 0;         // count of outgoing messages
byte localAddress = 0xBB;  // address of this device
byte destination = 0xAA;   // destination to send to
long lastSendTime = 0;     // last send time
int interval = 2000;       // interval between sends
String motorstatus = "";
String autoStartMachine = "off";
bool timeOutOnOffStatus = false;
bool dailyRunnerStatus = false;
bool dailyRunningInProccess = false;
bool isMotorForcedOn= false;
bool address = 0;
bool addressAutoStart = sizeof(address) + 1;
bool addressTimeout = (sizeof(address) * 2) + 2;
bool addressDailyRunnerStatus = (sizeof(address) * 3) + 3;
byte timeoutHours = 0;
byte timeoutMinuts = 0;
byte timeoutDailyHours = 0;
byte timeoutDailyMinuts = 0;
byte timeoutEndHours =0;
byte timeoutEndMinuts=0;
byte addressOfTimeOutHours=(sizeof(address) * 3)+sizeof(byte)+4;
byte addressOfTimeOutMinuts=(sizeof(address) * 3)+(sizeof(byte)*2)+5;
byte addressOfTimeOutDailyHours=(sizeof(address) * 3)+(sizeof(byte)*3)+6;
byte addressOfTimeOutDailyMinuts=(sizeof(address) * 3)+(sizeof(byte)*4)+7;
bool isRTCFound = true;
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
    if (state == "M=on" && autoStartMachine != "M=on") {
      motorstatus = "on";
      if(dailyRunningInProccess)
      {
        isMotorForcedOn=true;
      }
      isMotorForcedOn=false;
      EEPROM.put(address, true);
      EEPROM.commit();
      client->text(state);
    } else if (state == "M=off" && autoStartMachine != "M=off") {
      motorstatus = "off";
        if(dailyRunningInProccess)
      {
        isMotorForcedOn=false;
      }
      dailyRunningInProccess = false;
      EEPROM.put(address, false);
      EEPROM.commit();
      client->text(state);
    } else if (state == "A=on" && autoStartMachine != "A=on") {
      EEPROM.put(addressAutoStart, true);
      EEPROM.commit();
      client->text(state);
      autoStartMachine = "on";
    } else if (state == "A=off" && autoStartMachine != "A=off") {
      EEPROM.put(addressAutoStart, false);
      EEPROM.commit();
      client->text(state);
      autoStartMachine = "off";
    } else if (state.startsWith("T=on") && !timeOutOnOffStatus) {
      EEPROM.put(addressTimeout, true);
      EEPROM.commit();
      String hours = "";
      String minuts = "";
      int index = state.indexOf("|");
      for (int i = 4; i < state.length(); i++) {
        if (i > index) {
          minuts = minuts + state.charAt(i);
        } else if (i < index) {
          hours = hours + state.charAt(i);
        }
      }
      timeoutHours = hours.toInt();
      timeoutMinuts = minuts.toInt();
      client->text(state);
      timeOutOnOffStatus = true;
    } else if (state == "T=off" && timeOutOnOffStatus) {
      EEPROM.put(addressTimeout, false);
      EEPROM.commit();
      client->text(state);
      timeOutOnOffStatus = false;
    } else if (state.startsWith("D=on") && !dailyRunnerStatus) {
      EEPROM.put(addressDailyRunnerStatus, true);
      EEPROM.commit();
      client->text(state);
      String hours = "";
      String minuts = "";
      int index = state.indexOf("|");
      for (int i = 4; i < state.length(); i++) {
        if (i > index) {
          minuts = minuts + state.charAt(i);
        } else if (i < index) {
          hours = hours + state.charAt(i);
        }
      }
      timeoutDailyHours = hours.toInt();
      timeoutDailyMinuts= minuts.toInt();
      client->text(state);
      timeOutOnOffStatus = true;

    } else if (state == "D=off" && dailyRunnerStatus) {
      EEPROM.put(addressDailyRunnerStatus, false);
      EEPROM.commit();
      client->text(state);
      dailyRunnerStatus = false;
    } else if (state.endsWith("Z")) {
      int str_len = state.length() + 1;
      char char_array[str_len];
      state.toCharArray(char_array, str_len);
      rtc.adjust(DateTime(char_array));
    }
  }
  switch (type) {
    case WS_EVT_CONNECT:
      client->text("M=" + motorstatus);
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      client->text("A=" + autoStartMachine);
      client->text(timeOutOnOffStatus ? "T=on" : "T=off");
      client->text(dailyRunnerStatus ? "D=on" : "D=off");
      client->text(dailyRunningInProccess ? "R=on" : "R=off");
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

  pinMode(trigger, OUTPUT);
  digitalWrite(trigger, LOW);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);
  Serial.println();
  Serial.println("LoRa Duplex");
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_LORA_S", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  initWebSocket();
  server.begin();
  Serial.println();
  if (!rtc.begin()) {
    Serial.flush();
    isRTCFound = false;
    digitalWrite(LED, LOW);
    while (!rtc.begin()) {
      Serial.println("Couldn't find RTC");
      delay(1000);
    }
  } else {
    digitalWrite(LED, HIGH);
  }

  if (rtc.lostPower()) {
    Serial.println("RTC lost power, let set the time!");
    // When time needs to be set on a new device, or after a power loss, the
    // following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    // This line sets the RTC with an explicit date & time, for example to set
    // January 21, 2014 at 3am you would call:
    // rtc.adjust(DateTime(2024, 1, 12, 19, 2, 0));
  }
  // override the default CS, reset, and IRQ pins (optional)

  LoRa.setPins(csPin, resetPin, irqPin);  // set CS, reset, IRQ pin
  bool readId;
  EEPROM.get(address, readId);
  if (readId == false) {
    motorstatus = "off";
  } else if (readId == true) {
    motorstatus = "on";
  }
  EEPROM.get(addressAutoStart, readId);
  if (readId == false) {
    autoStartMachine = "off";
  } else if (readId == true) {
    autoStartMachine = "on";
  }
  EEPROM.get(addressTimeout, readId);
  if (readId == false) {
    timeOutOnOffStatus = false;
  } else if (readId == true) {
    timeOutOnOffStatus = true;
  }
  EEPROM.get(addressDailyRunnerStatus, readId);
  if (readId == false) {
    dailyRunnerStatus = false;
  } else if (readId == true) {
    dailyRunnerStatus = true;
  }
  if (!LoRa.begin(433E1)) {  // initialize ratio at 915 MHz
    Serial.println("LoRa init failed. Check your connections.");
    while (true)
      ;  // if failed, do nothing
  }

  Serial.println("LoRa init succeeded............");
}

void loop() {

  if (millis() - lastSendTime > interval) {
    if (isRTCFound) {
      DateTime now = rtc.now();
      timestamp = String(now.year(), DEC) + '/' + String(now.month(), DEC) + '/' + String(now.day(), DEC) + " T " + String(now.hour(), DEC) + ':' + String(now.minute(), DEC) + ':' + String(now.second(), DEC);
      Serial.println(timestamp);
      ws.textAll(timestamp);
      if (timeOutOnOffStatus) {
        if (now.hour() >= timeoutHours && now.minute() >= timeoutMinuts && motorstatus == "on") {
          motorstatus = "off";
          timeOutOnOffStatus = false;
          dailyRunningInProccess = false;
          ws.textAll("M=off");
          EEPROM.put(addressTimeout, false);
          EEPROM.commit();
          ws.textAll("T=off");
        }
      } else if (dailyRunnerStatus) {
        if (now.hour() >= timeoutDailyHours && now.minute() >= timeoutDailyMinuts && now.hour() <= timeoutEndHours && now.minute() <= timeoutEndMinuts) {
          if (!dailyRunningInProccess&&!isMotorForcedOn) {
            dailyRunningInProccess = true;
            motorstatus = "on";
            ws.textAll("R=on");
            ws.textAll("M=on");
          }
        } else if (dailyRunningInProccess||isMotorForcedOn) {
          dailyRunningInProccess = false;
          ws.textAll("R=off");
            motorstatus = "on";
            isMotorForcedOn=false;
            ws.textAll("M=off");
        }
      }

    } else {
      ws.textAll("RTC not found");
    }
    sendMessage(motorstatus + "/" + autoStartMachine);
    lastSendTime = millis();         // timestamp the message
    interval = random(1000) + 1000;  // 2-3 seconds
  } else {
    // display.clear();
  }
  // parse for a packet, and call onReceive with the result:
  onReceive(LoRa.parsePacket());
}



void sendMessage(String outgoing) {

  digitalWrite(LED, HIGH);
  LoRa.beginPacket();             // start packet
  LoRa.write(destination);        // add destination address
  LoRa.write(localAddress);       // add sender address
  LoRa.write(msgCount);           // add message ID
  LoRa.write(outgoing.length());  // add payload length
  LoRa.print(outgoing);           // add payload
  LoRa.endPacket();               // finish packet and send it
  msgCount++;
  Serial.println("Sending " + outgoing);
}

void onReceive(int packetSize) {
  if (packetSize == 0) return;  // if there no packet, return

  // read packet header bytes:
  int recipient = LoRa.read();        // recipient address
  byte sender = LoRa.read();          // sender address
  byte incomingMsgId = LoRa.read();   // incoming msg ID
  byte incomingLength = LoRa.read();  // incoming msg length

  String incoming = "";

  while (LoRa.available()) {
    incoming += (char)LoRa.read();
  }

  if (incomingLength != incoming.length()) {  // check length for error
    Serial.println("error: message length does not match length" + incoming);
    return;  // skip rest of function
  }

  // if the recipient isn't this device or broadcast,
  if (recipient != localAddress && recipient != 0xFF) {
    Serial.println("This message is not for me.");
    return;  // skip rest of function
  }


  digitalWrite(LED, LOW);
  // if message is for this device, or broadcast, print details:
  // Serial.println("Received from: 0x" + String(sender, HEX));
  // Serial.println("Sent to: 0x" + String(recipient, HEX));
  // Serial.println("Message ID: " + String(incomingMsgId));
  // Serial.println("Message length: " + String(incomingLength));
  Serial.println("Message: " + incoming);
  Serial.println();
  if (incoming == "mon" && motorstatus == "off") {
    Serial.println("Called inside");
    ws.textAll("on");
    motorstatus = "on";
    EEPROM.put(address, 1);
    EEPROM.commit();
    digitalWrite(trigger, LOW);
  } else if (incoming == "moff" && motorstatus == "on") {
    Serial.println("Called inside");
    ws.textAll("off");
    motorstatus = "off";
    EEPROM.put(address, 0);
    EEPROM.commit();
    digitalWrite(trigger, HIGH);
  }
  Serial.println();
}
