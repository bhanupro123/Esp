#include "SoftwareSerial.h"
#include "DFRobotDFPlayerMini.h"

int Player_state = 2;

// Use pins 2 and 3 to communicate with DFPlayer Mini
static const uint8_t PIN_MP3_TX = 1; // Connects to module's RX 
static const uint8_t PIN_MP3_RX = 3; // Connects to module's TX 
SoftwareSerial softwareSerial(PIN_MP3_RX, PIN_MP3_TX);

// Create the Player object
DFRobotDFPlayerMini player;

void setup() {
 pinMode(Player_state, OUTPUT);
digitalWrite(Player_state, LOW);
  // Init USB serial port for debugging
 // Serial.begin(9600);
  // Init serial port for DFPlayer Mini
  softwareSerial.begin(9600);

  // Start communication with DFPlayer Mini
  if (player.begin(softwareSerial)) {
  // Serial.println("OK");
digitalWrite(Player_state, LOW);
    // Set volume to maximum (0 to 30).
    player.volume(20);
    // Play the first MP3 file on the SD card
    player.play(1);
  } else {
    digitalWrite(Player_state, HIGH);
   // Serial.println("Connecting to DFPlayer Mini failed!");
  }
}

void loop() {
 if (softwareSerial.available() > 0) {
    // read the incoming byte:
     digitalWrite(Player_state, LOW);
  }
 
  
 
   }
