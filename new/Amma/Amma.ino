/***************************************************************************************************/
/*
   This is an Arduino sketch for DFPlayer Mini MP3 module

   written by : enjoyneering
   source code: https://github.com/enjoyneering/DFPlayer

   DFPlayer Mini features:
   - 3.2v..5.0v, typical 4.2v
   - 15mA without flash drive, typical 24mA
   - 24-bit DAC with 90dB output dynamic range and SNR over 85dB
   - micro SD-card, up to 32GB (FAT16, FAT32)
   - USB-Disk up to 32GB (FAT16, FAT32)
   - supports mp3 sampling rate 8KHz, 11.025KHz, 12KHz, 16KHz, 22.05KHz, 24KHz, 32KHz, 44.1KHz, 48KHz
   - supports up to 100 folders, each folder can be assigned to 001..255 songs
   - built-in 3W mono amplifier, NS8002 AB-Class with standby function
   - UART to communicate, 9600bps (parity:none, data bits:8, stop bits:1, flow control:none)

   NOTE:
   - if you hear a loud noise, add a 1K resistor in series with DFPlayer TX pin
   - move the jumper from right to left to automatically switch the amplifier to standby

   Frameworks & Libraries:
   ESP8266 Core      -  https://github.com/esp8266/Arduino
   EspSoftwareSerial -  https://github.com/plerup/espsoftwareserial


   GNU GPL license, all text above must be included in any redistribution,
   see link for details  - https://www.gnu.org/licenses/licenses.html
*/
/***************************************************************************************************/

#include <SoftwareSerial.h>
#include <TM1637Display.h>
#include "RTClib.h"
#include <DFPlayer.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <EEPROM.h>


const int CLK = 5; //Set the CLK pin connection to the display
const int DIO = 4; //Set the DIO pin connection to the display
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
bool isTimerInititialized = true;
AsyncWebServer server(80);
AsyncWebSocket ws("/");
#define MP3_RX_PIN              3//4     //GPIO4/D2 to DFPlayer Mini TX
#define MP3_TX_PIN            1 // 5     //GPIO5/D1 to DFPlayer Mini RX
#define MP3_SERIAL_SPEED        9600  //DFPlayer Mini suport only 9600-baud
#define MP3_SERIAL_BUFFER_SIZE  32    //software serial buffer size in bytes, to send 8-bytes you need 11-bytes buffer (start byte+8-data bytes+parity-byte+stop-byte=11-bytes)
#define MP3_SERIAL_TIMEOUT      350   //average DFPlayer response timeout 200msec..300msec for YX5200/AAxxxx chip & 350msec..500msec for GD3200B/MH2024K chip
long lastSendTime = 0;    // last send time
int interval = 2000;      // interval between sends
const int LED = 2;
const int trigger = 0;
String timestamp = "";

RTC_DS3231 rtc;
SoftwareSerial mp3Serial;
DFPlayer       mp3;
TM1637Display display(CLK, DIO);

void initWebSocket() {
  ws.cleanupClients();
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}


void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_DATA) {
    String  state = "";
    for (int i = 0; i < len; ++i) {
      state = state + String(static_cast<char>(data[i]));
    }
    if (state.endsWith("Z"))
    {
      if (isTimerInititialized)
      {
        int str_len = state.length() + 1;
        char char_array[str_len];
        state.toCharArray(char_array, str_len);
        rtc.adjust(DateTime(char_array));
      }
      else {
        client->text("RTC Not Connected");
      }
    }

  }
  switch (type) {
    case WS_EVT_CONNECT:
      //  client->text(s);
      //Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());

      break;
    case WS_EVT_DISCONNECT:

      break;
    case WS_EVT_DATA:
      break;
    case WS_EVT_PONG:
      break;
    case WS_EVT_ERROR:

      break;
  }
}
/**************************************************************************/
/*
    setup()

    Main setup

    NOTE:
    - moduleType:
      - DFPLAYER_MINI:
        - DFPlayer Mini module
        - MP3-TF-16P module
        - FN-M16P module
        - YX5200 chip
        - YX5300 chip
        - JL AAxxxx chip
      - DFPLAYER_FN_X10P:
        - FN-M10P module
        - FN-S10P module
        - FN6100 chip
      - DFPLAYER_HW_247A:
        - HW-247A module
        - GD3200B chip
      - DFPLAYER_NO_CHECKSUM:
        - no checksum calculation (not recomended for MCU without external
          crystal oscillator)
*/
/**************************************************************************/
void setup()
{
  display.setBrightness(0x0a);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  WiFi.softAP("VKbhanu", "bhanu1234");
  IPAddress myIP = WiFi.softAPIP();
  if (!rtc.begin())
  {
    Serial.flush();
    isTimerInititialized = false;
    digitalWrite(LED, LOW);
  }
  else
  {
    digitalWrite(LED, HIGH);
  }
  if (rtc.lostPower())
  {

    // When time needs to be set on a new device, or after a power loss, the
    // following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    // This line sets the RTC with an explicit date & time, for example to set
    // January 21, 2014 at 3am you would call:
    // rtc.adjust(DateTime(2024, 1, 12, 19, 2, 0));
  }
  initWebSocket();
  server.begin();
  mp3Serial.begin(MP3_SERIAL_SPEED, SWSERIAL_8N1, MP3_RX_PIN, MP3_TX_PIN, false, MP3_SERIAL_BUFFER_SIZE, 0); //false=signal not inverted, 0=ISR/RX buffer size (shared with serial TX buffer)

  mp3.begin(mp3Serial, MP3_SERIAL_TIMEOUT, DFPLAYER_MINI, false); //"DFPLAYER_MINI" see NOTE, false=no response from module after the command

  mp3.stop();                             //if player was runing during ESP8266 reboot

  mp3.reset();                            //reset all setting to default

  mp3.setSource(2);                       //1=USB-Disk, 2=TF-Card, 3=Aux, 4=Sleep, 5=NOR Flash

  mp3.setEQ(0);                           //0=Off, 1=Pop, 2=Rock, 3=Jazz, 4=Classic, 5=Bass
  mp3.setVolume(25);                      //0..30, module persists volume on power failure

  mp3.sleep();                            //inter sleep mode, 24mA

  mp3.wakeup(2);                          //exit sleep mode & initialize source 1=USB-Disk, 2=TF-Card, 3=Aux, 5=NOR Flash

  mp3Serial.enableRx(true);               //enable interrupts on RX-pin for better response detection, less overhead than mp3Serial.listen()

  //Serial.println(mp3.getStatus());        //0=stop, 1=playing, 2=pause, 3=sleep or standby, 4=communication error, 5=unknown state
  // Serial.println(mp3.getVolume());        //0..30
  // Serial.println(mp3.getCommandStatus()); //1=module busy, 2=module sleep, 3=request not fully received, 4=checksum not match
  //5=requested folder/track out of range, 6=requested folder/track not found
  //7=advert available while track is playing, 8=SD card not found, 9=???, 10=module sleep
  //11=OK command accepted, 12=OK playback completed, 13=OK module ready after reboot

  mp3Serial.enableRx(false);              //disable interrupts on RX-pin, less overhead than mp3Serial.listen()
  mp3.playTrack(1);
  
}


/**************************************************************************/
/*
    loop()

    Main loop
*/
/**************************************************************************/
void loop()
{
  if (millis() - lastSendTime > interval)
  {
    DateTime now = rtc.now();
    if (isTimerInititialized && now.year() >= 2024 && now.year() <= 2030)
    {
      timestamp = String(now.year(), DEC) + '/' + String(now.month(), DEC) + '/' + String(now.day(), DEC) + " T " + String(now.hour(), DEC) + ':' + String(now.minute(), DEC) + ':' + String(now.second(), DEC);
      display.clear();  delay(100);
      display.showNumberDecEx(((now.hour() > 12 ? now.hour() - 12 : now.hour()) * 100) + now.minute(), 0b11100000, true);
      ws.textAll(timestamp);
      digitalWrite(LED, !digitalRead(LED));
    }
    lastSendTime = millis();        // timestamp the message
    interval = random(2000) + 1000; // 2-3 seconds
  }
}


//play track #1, don’t copy 0003.mp3 and then 0001.mp3, because 0003.mp3 will be played firts
//mp3.playMP3Folder(1); //1=track, folder name must be "mp3" or "MP3" & files in folder must start with 4 decimal digits with leading zeros
//mp3.playFolder(1, 2); //1=folder/2=track, folder name must be 01..99 & files in folder must start with 3 decimal digits with leading zeros

// delay(60000);         //play for 60 seconds

// mp3.pause();

// delay(10000);
