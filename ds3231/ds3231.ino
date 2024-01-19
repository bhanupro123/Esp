// Date and time functions using a DS3231 RTC connected via I2C and Wire lib
#include "RTClib.h"
#include <ESP8266WiFi.h>
WiFiServer server(8080);
WiFiClient client;
RTC_DS3231 rtc;
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


char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

void setup () {
  pinMode(SSR, OUTPUT);
  digitalWrite(SSR, LOW);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  Serial.begin(115200);
#ifndef ESP8266
  while (!Serial); // wait for serial port to connect. Needed for native USB
#endif
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
  if (ch == '1' || ch == 'A') {
    isClient = true;
    digitalWrite(SSR, HIGH);
  } else if (ch == '0' || ch == 'a') {
    isClient = false;
    digitalWrite(SSR, LOW);
  }
}

void writeToClient(String data) {
  if (client) client.println(data);
}
void loop () {
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
  if (! rtc.begin()) {
    digitalWrite(LED, HIGH);
    Serial.println("Couldn't find RTC");
    writeToClient("Couldn't find RTC");
    delay(2000);
  }
  else {
 //rtc.adjust(DateTime(2023, 10, 14, 10, 57, 0));
    DateTime now = rtc.now();

    String stamp = (String(now.year()) + "/" + String(now.month()) + "/" + String(now.day()) + " " + String(now.hour()) + ":" + String(now.minute()) + ":" + String(now.second()));
    if (now.year() >= 2023) {
      digitalWrite(LED, LOW);
      if (!isClient) {
        if (now.hour() >= 18 || (now.hour() <= 6)) {
          writeToClient("LIGHT ON");
          Serial.println("LIGHT ON");
          digitalWrite(SSR, HIGH);
        } else {
          digitalWrite(SSR, LOW);
        }
      }
      writeToClient(stamp);
    }
    Serial.println(stamp); 
//    Serial.print("Temperature: ");
//    Serial.print(rtc.getTemperature());
//    Serial.println(" C");
    delay(1000);
  }
}
