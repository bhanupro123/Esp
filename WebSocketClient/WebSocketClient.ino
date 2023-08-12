#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
// WiFi.begin("ZTE_2.4G_bP7u3G","zu525b3G");
const char* ssid = "Tharun guvva"; //Enter SSID
const char* password = "password@000"; //Enter Password
const char* websockets_server = "ws://192.168.0.162:8080"; //server adress and port
bool isConnected = false;
const int d1 = 5; // motor
const int d2 = 4; // sw2 kitchen //NC
const int d5 = 14; //sw1 tank //NO
const int d6 = 12; //timer lights//12
const String proType="#UGESP";
String latestCommand = "T0";
String lightsCommand = "L0";
using namespace websockets;
WebsocketsClient client;
 
void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Got Message: ");
  String s = message.data();
  if (s == "K1")
  {
    latestCommand = s;
    Serial.println("Kitchen on");
    digitalWrite(d2, HIGH);
    digitalWrite(d5, HIGH);
    digitalWrite(d1, HIGH);
  }
  else if (s == "K0")
  {
    latestCommand = s;
    Serial.println("Kitchen off");
    digitalWrite(d5, LOW);
    digitalWrite(d2, LOW);
    digitalWrite(d1, LOW);
  }
  else if (s == "L1")
  {
    lightsCommand = s;
    Serial.println("Lights on");
    digitalWrite(d6, HIGH);
  }
  else if (s == "L0")
  {
    lightsCommand = s;
    Serial.println("Lights off");
    digitalWrite(d6, LOW);
  }

  else if (s == "T1")
  {
    latestCommand = s;
    Serial.println("Tank on");
    digitalWrite(d5, LOW); //tank
    digitalWrite(d2, LOW); //kitchen
    digitalWrite(d1, HIGH);  //motor
  }
  else if (s == "T0")
  {
    latestCommand = s;
    Serial.println("Tank off");
    digitalWrite(d5, LOW); //tank
    digitalWrite(d2, LOW); //kitchen
    digitalWrite(d1, LOW);  //motor
  }
  Serial.println(s);
}

void onEventsCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    isConnected = true; 
    client.send(proType+latestCommand);
    client.send(proType+lightsCommand);
    Serial.println("Connnection Opened");
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    isConnected = false;
    Serial.println("Connnection Closed");
  } else if (event == WebsocketsEvent::GotPing) {
    Serial.println("Got a Ping!");
  } else if (event == WebsocketsEvent::GotPong) {
    Serial.println("Got a Pong!");
  }
}

void setup() {
  pinMode(d1, OUTPUT);
  digitalWrite(d1, LOW);
  pinMode(d2, OUTPUT);
  digitalWrite(d2, LOW);
  pinMode(d5, OUTPUT);
  digitalWrite(d5, LOW);
  pinMode(d6, OUTPUT);
  digitalWrite(d6, LOW);
  Serial.begin(115200);
  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("...connecting to wifi");
    delay(1000);
  }
  Serial.println("Connected...");
  // Setup Callbacks
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  // Connect to server
  client.connect(websockets_server);

  // Send a message
  client.send("Hi Server!");
  // Send a ping
  client.ping();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED)
    while (WiFi.status() != WL_CONNECTED) {
      Serial.println("...Connection to wift");
      delay(1000);
    }
  if (isConnected)
  {
    client.poll();
    while (Serial.available() > 0)
    {
      String s = Serial.readString();
      if (s.length() > 0)
        client.send(proType+s);
    }
  }
  else {
    client.connect(websockets_server);
    Serial.println("Retrying websocket server....");
    delay(500);
  }

}
