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
#include <SPI.h>              // include libraries
#include <LoRa.h>

const int csPin = 15;          // LoRa radio chip select
const int resetPin = 16;       // LoRa radio reset
const int irqPin = 0; 
const int motorLed = 5;         // change for your board; must be a hardware interrupt pin
const int LED = 2;
const int switchinput = 4;
String outgoing;              // outgoing message
String motorStatus="off";
byte msgCount = 0;            // count of outgoing messages
byte localAddress = 0xAA;     // address of this device
byte destination = 0xBB;      // destination to send to
long lastSendTime = 0;        // last send time
int interval = 2000;    
bool clicked=false;      // interval between sends
bool canISend=true;
void setup() {
   pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  pinMode(motorLed, OUTPUT);
  digitalWrite(motorLed, LOW);
   pinMode(switchinput, INPUT); 
  Serial.begin(115200);                   // initialize serial
  Serial.println("LoRa Duplex RECEIVED");

  // override the default CS, reset, and IRQ pins (optional)
  LoRa.setPins(csPin, resetPin, irqPin);// set CS, reset, IRQ pin

  if (!LoRa.begin(433E1)) {             // initialize ratio at 915 MHz
    Serial.println("LoRa init failed. Check your connections.");
    while (true);                       // if failed, do nothing
  }

  Serial.println("LoRa init succeeded.");
}

void loop() { 
  if(digitalRead(switchinput)==LOW&&clicked==false)
  {
    clicked=true;
   if(motorStatus=="on")
   { 
         sendMessage("moff");
         motorStatus="off";
         digitalWrite(motorLed, LOW);
   }
   else{
      sendMessage("mon");
      motorStatus="on";
      digitalWrite(motorLed, HIGH);
   }
    lastSendTime = millis();            // timestamp the message
    interval = random(2000) + 1000; 
  }
  else if(digitalRead(switchinput)==HIGH)
  { 
clicked=false;
  }
   
  if (millis() - lastSendTime > interval) {
    sendMessage(motorStatus);
    Serial.println("Sending " + motorStatus);
    lastSendTime = millis();            // timestamp the message
    interval = random(2000) + 1000;    // 2-3 seconds
  }
   if(motorStatus=="on")
   {
      digitalWrite(motorLed, HIGH);
   }
   else 
   {
      digitalWrite(motorLed, LOW);
   }
  // parse for a packet, and call onReceive with the result:
  onReceive(LoRa.parsePacket());
}

void sendMessage(String outgoing) {
  LoRa.beginPacket();                   // start packet
  LoRa.write(destination);              // add destination address
  LoRa.write(localAddress);             // add sender address
  LoRa.write(msgCount);                 // add message ID
  LoRa.write(outgoing.length());        // add payload length
  LoRa.print(outgoing);                 // add payload
  LoRa.endPacket();                     // finish packet and send it
  msgCount++;                           // increment message ID
}

void onReceive(int packetSize) {
  if (packetSize == 0) return;          // if there's no packet, return

  // read packet header bytes:
  int recipient = LoRa.read();          // recipient address
  byte sender = LoRa.read();            // sender address
  byte incomingMsgId = LoRa.read();     // incoming msg ID
  byte incomingLength = LoRa.read();    // incoming msg length

  String incoming = "";

  while (LoRa.available()) {
    incoming += (char)LoRa.read();
  }
  if(incoming=="on"||incoming=="off")
 { 
   motorStatus=incoming;
   canISend=false;
 }
  
  if (incomingLength != incoming.length()) {   // check length for error
    Serial.println("error: message length does not match length"+incoming);
    return;                             // skip rest of function
  }

  // if the recipient isn't this device or broadcast,
  if (recipient != localAddress && recipient != destination) {
    Serial.println("This message is not for me.");
    return;                             // skip rest of function
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

