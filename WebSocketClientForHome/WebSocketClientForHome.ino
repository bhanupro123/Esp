#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
// WiFi.begin("ZTE_2.4G_bP7u3G","zu525b3G");
const char* ssid = "bhanu"; //Enter SSID
const char* password = "bhanu1234"; //Enter Password

//const char* ssid = "Tharun guvva"; //Enter SSID
//const char* password = "password@000"; //Enter Password

const char* websockets_server = "ws://192.168.0.185:8080"; //server adress and port
bool isConnected = false;
const int d1 = 5; // motor
const int d2 = 4; // sw2 kitchen //NC
const int d3 = 0; //extra
const int d4 = 2;
const int d5 = 14; //sw1 tank //NO
const int d6 = 12; //timer lights//12
const int d7 = 13; //extra 1
const String proType = "#E0*";
const String tankAlive = proType + "T1";
const String motorTerminated = proType + "M0";
const String kitchenAlive = proType + "K1";
const String mainLightAlive = proType + "L1";
const String mainLightTerminated = proType + "L0";
const String extraLightsOn = proType + "E1";
const String extraLightsOff = proType + "E0";

const String extraLightsOn1 = proType + "F1";
const String extraLightsOff1 = proType + "F0";


const String motionDetected = proType + "P1";
const String motionNotDetected = proType + "P0";
bool statusOfPIR = false;
bool isPIRAllowed = false;


String latestCommand = motorTerminated;
String lightsCommand = mainLightTerminated;
String extraLightsCommand = extraLightsOff;

String extraLightsCommand1 = extraLightsOff1;
using namespace websockets;
WebsocketsClient client;

void onMessageCallback(WebsocketsMessage message) {
  String s = message.data();
 
  if (s == kitchenAlive)
  {
    latestCommand = s;
    Serial.println("Kitchen on");
    digitalWrite(d2, HIGH);
    digitalWrite(d5, HIGH);
    digitalWrite(d1, HIGH); client.send(s);
  }
  else if (s == tankAlive)
  {
    latestCommand = s;
    Serial.println("Tank on");
    digitalWrite(d5, LOW); //tank
    digitalWrite(d2, LOW); //kitchen
    digitalWrite(d1, HIGH);  //motor
     client.send(s);
  }
  else if (s == motorTerminated)
  {
    latestCommand = s;
    Serial.println("Motor off");
    digitalWrite(d5, LOW);
    digitalWrite(d2, LOW);
    digitalWrite(d1, LOW);
     client.send(s);
  }
  else if (s == motionDetected)
  {
    extraLightsCommand = s;
      isPIRAllowed = true;
  }
  else if (s == motionNotDetected)
  {
    isPIRAllowed = false;
    extraLightsCommand = s;
  }
  else if (s == mainLightAlive)
  {
    lightsCommand = s;
    Serial.println("Lights on");
    digitalWrite(d6, HIGH);
     client.send(s);
  }
  else if (s == mainLightTerminated)
  {
    lightsCommand = s;
    Serial.println("Lights off");
    digitalWrite(d6, LOW);
     client.send(s); client.send(s);
  }
  else if (s == extraLightsOn)
  {
    extraLightsCommand = s;
    Serial.println("extra lights on");
    // digitalWrite(d7, HIGH);
  }
  else if (s == extraLightsOff)
  {
    extraLightsCommand = s;
    Serial.println("extra lights off");
    //  digitalWrite(d7, LOW);
  }

  else if (s == extraLightsOff1)
  {
    extraLightsCommand1 = s;
    Serial.println("extra lights off 1");
    digitalWrite(d3, HIGH); client.send(s);
  }
  else if (s == extraLightsOn1)
  {
    extraLightsCommand1 = s;
    Serial.println("extra lights on 1");
    digitalWrite(d3, LOW);
     client.send(s);
  }
  Serial.println(s);
}
void PIRSensor() {
  if (digitalRead(d7) == HIGH) {
    Serial.println("Motion detected.");
    client.send(motionDetected);
    statusOfPIR=true;
    delay(500);
  }
  else if (digitalRead(d7) == LOW) {
    Serial.println("Motion ended.");
     client.send(motionNotDetected);
     statusOfPIR=false
     ;
    delay(500);
  }
  else{
     client.send(motionNotDetected);
    }
}
void onEventsCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    isConnected = true;
    digitalWrite(d4, LOW);
    client.send(proType);
    client.send(latestCommand);
    client.send(lightsCommand);
    client.send(extraLightsCommand);
    client.send(extraLightsCommand1);
    Serial.println("Connnection Opened");
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    isConnected = false;
    digitalWrite(d4, HIGH);
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
  pinMode(d7, INPUT);
  pinMode(d4, OUTPUT);
  digitalWrite(d4, HIGH);
  pinMode(d3, OUTPUT);
  digitalWrite(d3, HIGH);
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
  // Send a ping
  client.ping();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED)
    while (WiFi.status() != WL_CONNECTED) {
      Serial.println("...Connection to wifi");
      delay(1000);
    }
  if (isConnected)
  {
    //client.ping();
    client.poll();
    while (Serial.available() > 0)
    {
      String s = Serial.readString();
      if (s.length() > 0)
        client.send(proType + s);
    }
    if (isPIRAllowed)
      PIRSensor();
  }
  else { 
    Serial.println("Retrying websocket server....");
    client.connect(websockets_server);
    digitalWrite(d4, HIGH);
    delay(500);
    digitalWrite(d4, LOW);
    delay(500);
  }

}
