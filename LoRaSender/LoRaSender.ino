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
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

AsyncWebServer server(80);
AsyncWebSocket ws("/");

const int csPin = 15;    // LoRa radio chip select
const int resetPin = 16; // LoRa radio reset
const int irqPin = 12;    // change for your board; must be a hardware interrupt pin
const int LED = 2;
const int trigger = 0;
String timestamp = "";
String outgoing; // outgoing message
#define EEPROM_SIZE 12
byte msgCount = 0;        // count of outgoing messages
byte localAddress = 0xBB; // address of this device
byte destination = 0xAA;  // destination to send to
long lastSendTime = 0;    // last send time
int interval = 2000;      // interval between sends
String motorstatus = "off";
String autoStartMachine = "off";
int address = 0;
int addressAutoStart = 1;
bool isTimerIsRunning = false;
byte inputDelay=0;
bool isTimerInititialized = true;
void initWebSocket()
{
  ws.cleanupClients();
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
  if (type == WS_EVT_DATA)
  {
    String state = "";
    for (int i = 0; i < len; ++i)
    {
      state = state + String(static_cast<char>(data[i]));
    }
    Serial.println(state+"/A "+autoStartMachine+"/M "+motorstatus);
    if (state == "M=on" && motorstatus == "off")
    {
      inputDelay=2;
      EEPROM.put(address, 1);
      EEPROM.commit();
      client->text(state);
      motorstatus = "on";
    }
    else if (state == "M=off" && motorstatus == "on")
    {
            inputDelay=2;
      EEPROM.put(address, 0);
      EEPROM.commit();
      client->text(state);
      motorstatus = "off";
    }
    else if (state == "A=on" && autoStartMachine == "off")
    {
      EEPROM.put(addressAutoStart, 1);
      EEPROM.commit();
      client->text(state);
      autoStartMachine = "on";
    }
    else if (state == "A=off" && autoStartMachine == "on")
    {
      EEPROM.put(addressAutoStart, 0);
      EEPROM.commit();
      client->text(state);
      autoStartMachine = "off";
    }
    else if (state.endsWith("Z"))
    {
      int str_len = state.length() + 1;
      char char_array[str_len];
      state.toCharArray(char_array, str_len);
      rtc.adjust(DateTime(char_array));
    }
  }
  switch (type)
  {
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
void setup()
{

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
  if (!rtc.begin())
  {
    Serial.flush();
    isTimerInititialized = false;
    digitalWrite(LED, LOW);
    while (!rtc.begin())
    {
      Serial.println("Couldn't find RTC");
      delay(1000);
    }
  }
  else
  {
    digitalWrite(LED, HIGH);
  }

  if (rtc.lostPower())
  {
    Serial.println("RTC lost power, let set the time!");
    // When time needs to be set on a new device, or after a power loss, the
    // following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    // This line sets the RTC with an explicit date & time, for example to set
    // January 21, 2014 at 3am you would call:
    // rtc.adjust(DateTime(2024, 1, 12, 19, 2, 0));
  }
  // override the default CS, reset, and IRQ pins (optional)

  LoRa.setPins(csPin, resetPin, irqPin); // set CS, reset, IRQ pin
  int readId;
  EEPROM.get(address, readId);
  if (readId == 0)
  {
    motorstatus = "off";
  }
  else if (readId == 1)
  {
    inputDelay=2;
    motorstatus = "on";
  }
  EEPROM.get(addressAutoStart, readId);
  if (readId == 0)
  {
    autoStartMachine = "off";
  }
  else if (readId == 1)
  {
    autoStartMachine = "on";
  }
  if (!LoRa.begin(433E1))
  { // initialize ratio at 915 MHz
    Serial.println("LoRa init failed. Check your connections.");
    while (true)
      ; // if failed, do nothing
  }

  Serial.println("LoRa init succeeded............");
}

void loop()
{

  if (millis() - lastSendTime > interval)
  {
    if (isTimerInititialized)
    {
      DateTime now = rtc.now();
      timestamp = String(now.year(), DEC) + '/' + String(now.month(), DEC) + '/' + String(now.day(), DEC) + " T " + String(now.hour(), DEC) + ':' + String(now.minute(), DEC) + ':' + String(now.second(), DEC);
      Serial.println(timestamp);
      ws.textAll(timestamp);
    }
    sendMessage(motorstatus + "/" + autoStartMachine);
    lastSendTime = millis();        // timestamp the message
    interval = random(2000) + 1000; // 2-3 seconds
     if(inputDelay!=0)
    {
      inputDelay = inputDelay + 2;
    }
  }
  else
  {
    // display.clear();
  }
   if(inputDelay==0)
  {
    onReceive(LoRa.parsePacket());
  }
  else if(inputDelay>=6)
  {
    onReceive(LoRa.parsePacket());
  }
  digitalWrite(trigger, motorstatus=="on"?HIGH:LOW);
}

void sendMessage(String outgoing)
{

  digitalWrite(LED, HIGH);
  LoRa.beginPacket();            // start packet
  LoRa.write(destination);       // add destination address
  LoRa.write(localAddress);      // add sender address
  LoRa.write(msgCount);          // add message ID
  LoRa.write(outgoing.length()); // add payload length
  LoRa.print(outgoing);          // add payload
  LoRa.endPacket();              // finish packet and send it
  msgCount++;
  Serial.println("Sending " + outgoing);
}

void onReceive(int packetSize)
{
  if (packetSize == 0)
    return; // if there no packet, return
inputDelay=0;
  // read packet header bytes:
  int recipient = LoRa.read();       // recipient address
  byte sender = LoRa.read();         // sender address
  byte incomingMsgId = LoRa.read();  // incoming msg ID
  byte incomingLength = LoRa.read(); // incoming msg length

  String incoming = "";

  while (LoRa.available())
  {
    incoming += (char)LoRa.read();
  }

  if (incomingLength != incoming.length())
  { // check length for error
    Serial.println("error: message length does not match length" + incoming);
    return; // skip rest of function
  }

  // if the recipient isn't this device or broadcast,
  if (recipient != localAddress && recipient != 0xFF)
  {
    Serial.println("This message is not for me.");
    return; // skip rest of function
  }

  digitalWrite(LED, LOW);
  // if message is for this device, or broadcast, print details:
  // Serial.println("Received from: 0x" + String(sender, HEX));
  // Serial.println("Sent to: 0x" + String(recipient, HEX));
  // Serial.println("Message ID: " + String(incomingMsgId));
  // Serial.println("Message length: " + String(incomingLength));
  Serial.println("Message: " + incoming);
  Serial.println();
  if (incoming == "on" && motorstatus == "off")
  {
    Serial.println("Called inside");
    ws.textAll("M=on");
    motorstatus = "on";
    EEPROM.put(address, 1);
    EEPROM.commit();
     
  }
  else if (incoming == "off" && motorstatus == "on")
  {
    Serial.println("Called inside");
    ws.textAll("M=off");
    motorstatus = "off";
    EEPROM.put(address, 0);
    EEPROM.commit();
    
  }
  Serial.println();
}
