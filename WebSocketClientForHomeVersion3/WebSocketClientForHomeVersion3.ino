


#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;
float distanceInch = 0;
int prevDistanceInch = 0;
int nextDistanceInch = 0;
// WiFi.begin("ZTE_2.4G_bP7u3G","zu525b3G");
const char* ssid = "bhanu";          //Enter SSID
const char* password = "bhanu1234";  //Enter Password

//const char* ssid = "Tharun guvva"; //Enter SSID
//const char* password = "password@000"; //Enter Password

const char* websockets_server = "ws://192.168.0.185:8080";  //server adress and port
using namespace websockets;
WebsocketsClient client;

//Variable declarizations
bool isConnected = false;
const int trigPin = 5;  //d1
const int echoPin = 4;  // d2
const int d3 = 0;       //extra default inverse
const int d4 = 2;       //default LED BLUE
const int d5 = 14;      //fan
const int d6 = 12;      //tube light
const int d7 = 13;      //input light

//Protocal
const String proType = "#E4*";

//commands
const String fanOn = proType + "F1";
const String fanOff = proType + "F0";

const String lightsOn = proType + "L1";
const String lightsOff = proType + "L0";

const String extraOn = proType + "E1";
const String extraOff = proType + "E0";

const String bathroomLightsOn = proType + "B1";
const String bathroomLightsOff = proType + "B0";

// status
String fanStatus = fanOff;
String lightsStatus = lightsOff;
String bathroomStatus = bathroomLightsOff;
String extraStatus = extraOff;



void onMessageCallback(WebsocketsMessage message) {
  String s = message.data();
  client.send(s);

  if (s == lightsOn) {
    lightsStatus = s;
    Serial.println("Lights on");
    digitalWrite(d6, HIGH);
  }

  else if (s == lightsOff) {
    lightsStatus = s;
    Serial.println("Lights off");
    digitalWrite(d6, LOW);
  }
  else if (s == fanOn) {
    fanStatus = s;
    Serial.println("Fan on");
    digitalWrite(d5, HIGH);
  }
  else if (s == fanOff) {
    fanStatus = s;
    Serial.println("Fan off");
    digitalWrite(d5, LOW);
  }

  //  else if (s == bathroomLightsOn) {
  //    bathroomStatus = s;
  //    Serial.println("bathroom lights on");
  //    digitalWrite(d7, HIGH);
  //  }
  //
  //  else if (s == bathroomLightsOff) {
  //    bathroomStatus = s;
  //    Serial.println("bathroom lights off");
  //    digitalWrite(d7, LOW);
  //  }

  else if (s == extraOn) {
    extraStatus = s;
    Serial.println("extra on");
    digitalWrite(d3, LOW);
  }

  else if (s == extraOff) {
    extraStatus = s;
    Serial.println("extra off");
    digitalWrite(d3, HIGH);
  }

  Serial.println(s);
}

void onEventsCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    isConnected = true;
    digitalWrite(d4, LOW);
    client.send(proType);
    client.send(fanStatus);
    client.send(lightsStatus);
    client.send(bathroomStatus);
    client.send(extraStatus);
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
  Serial.begin(115200);      // Starts the serial communication
  pinMode(trigPin, OUTPUT);  // Sets the trigPin as an Output //trigPin
  pinMode(echoPin, INPUT);   // Sets the echoPin as an Input echoPin
  pinMode(d5, OUTPUT);
  digitalWrite(d5, LOW);
  pinMode(d6, OUTPUT);
  digitalWrite(d6, LOW);
  pinMode(d7, INPUT);
  //  digitalWrite(d7, LOW);
  pinMode(d4, OUTPUT);
  digitalWrite(d4, HIGH);
  pinMode(d3, OUTPUT);
  digitalWrite(d3, HIGH);
  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  Serial.println("Connecting to wifi");

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

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculate the distance
  distanceCm = duration * SOUND_VELOCITY / 2;
  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;

  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(d4, HIGH);
    Serial.println("Connecting to wifi " + proType);
    delay(2000);
  } else if (isConnected) {
    //client.ping();
    client.poll();
    while (Serial.available() > 0) {
      String s = Serial.readString();
      if (s.length() > 0)
        client.send(proType + s);
    }
    if (digitalRead(d7) == LOW)
    {
      Serial.println("123123======================");
      client.send(proType + "K1");
    }

    client.send(proType + "D" + String(distanceInch));
    delay(1000);
  } else {
    Serial.println("Retrying websocket server....");
    client.connect(websockets_server);
    digitalWrite(d4, LOW);
    delay(1000);
    digitalWrite(d4, HIGH);
    delay(1000);
  }

}
