#include "RTClib.h"
#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
RTC_DS1307 DS1307_RTC;
int SSR = 14;  //d5
int LED = 2;   //d4
bool isClient = false;
void connectt() {
  client = server.available();
  if (client) {
    Serial.println("Connected to client");
    client.write("Well Come Back");
  }
}

char Week_days[7][12] = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };

void setup() {
  pinMode(SSR, OUTPUT);
  digitalWrite(SSR, HIGH);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  Serial.begin(115200);

#ifndef ESP8266
  while (!Serial)
    ;  // wait for serial port to connect. Needed for native USB
#endif

  // if (!DS1307_RTC.begin()) {
  //   Serial.println("Couldn't find RTC");
  //   while (1);
  // }
  // DS1307_RTC.adjust(DateTime(F(__DATE__), F(__TIME__)));
  Serial.println();
  server.begin();
  Serial.print("Setting soft-AP ... ");
  Serial.println(WiFi.softAP("ESP_BHANU", "bhanu1234") ? "Ready" : "Failed!");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  connectt();
}
void performAction(char ch) {
  if (ch == '1'||ch == 'A') {
    isClient = true;
    digitalWrite(SSR, LOW);
  } else if (ch == '0'||ch == 'a') {
    isClient = false;
    digitalWrite(SSR, HIGH);
  }
}

void writeToClient(String data) {
  if (client) client.println(data);
}
void loop() {
  if (!DS1307_RTC.begin()) {
    digitalWrite(LED, HIGH);
    Serial.println("Couldn't find RTC");
    writeToClient("Couldn't find RTC");
  } else {
    DateTime now = DS1307_RTC.now();
    String stamp = (String(now.year()) + "/" + String(now.month()) + "/" + String(now.day()) + " " + String(now.hour()) + ":" + String(now.minute()) + ":" + String(now.second()));
    if (now.year() >= 2023) {
      digitalWrite(LED, LOW);
      if (!isClient) {
        if (now.hour() >= 18 || (now.hour() <= 6)) {
          writeToClient("LIGHT ON");
          Serial.println("LIGHT ON");
          digitalWrite(SSR, LOW);
        } else {
          digitalWrite(SSR, HIGH);
        }
      }
      writeToClient(stamp);
    }
    Serial.println(stamp);
    delay(1000);
  }
  while (Serial.available() > 0) {
    char ch = Serial.read();
    performAction(ch);
  }
  if (!client) {
    connectt();
  } else {
    while (client.available() > 0) {
      char ch = client.read();
      performAction(ch);
    }
  }
}