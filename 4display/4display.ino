#include <TM1637Display.h>
#include "RTClib.h"
#include <SoftwareSerial.h>
#include <DFPlayer.h>
#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include <ESPAsyncWebServer.h>
#define MP3_RX_PIN              3//4     //GPIO4/D2 to DFPlayer Mini TX
#define MP3_TX_PIN            1 // 5     //GPIO5/D1 to DFPlayer Mini RX
#define MP3_SERIAL_SPEED        9600  //DFPlayer Mini suport only 9600-baud
#define MP3_SERIAL_BUFFER_SIZE  32    //software serial buffer size in bytes, to send 8-bytes you need 11-bytes buffer (start byte+8-data bytes+parity-byte+stop-byte=11-bytes)
#define MP3_SERIAL_TIMEOUT      350   //average DFPlayer response timeout 200msec..300msec for YX5200/AAxxxx chip & 350msec..500msec for GD3200B/MH2024K chip
#define EEPROM_SIZE 50

int timeArray[] = {5, 30, 6, 0, 18, 0, 19, 0, 1, 1};



AsyncWebServer server(80);
AsyncWebSocket ws("/");
RTC_DS1307 rtc;
SoftwareSerial mp3Serial;
DFPlayer       mp3;
int volumemp3 = 25;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
const int CLK = 5; //Set the CLK pin connection to the display
const int DIO = 4; //Set the DIO pin connection to the display
long lastSendTime = 0;    // last send time
int interval = 2000;      // interval between sends
const int LED = 2;
const int trigger = 0;
String timestamp = "";
String stringFormat = "00/00/00/00/00/00/00/00/1/1";
bool isTimerInititialized = true;
int numCounter = 0;
int address = 0;
bool isMusicStarted = false;
String s = "";
TM1637Display display(CLK, DIO); //set up the 4-Digit Display.
const int musicSwitch = 14;
void initWebSocket() {
  ws.cleanupClients();
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

void getFromEeprom()
{
  String splitter = "";
  int index = 0;
  for (int i = 0; i < stringFormat.length(); i++)
  {
    String singleStr = String(char(EEPROM.read(0x0F + i)));
    if (singleStr == "/")
    {
      timeArray[index] = splitter.toInt();
      splitter = "";
      index++;
    }
    else if (i == stringFormat.length() - 1)
    {
      splitter = splitter + singleStr;
      timeArray[index] = splitter.toInt();
      splitter = "";
    }
    else {
      splitter = splitter + singleStr;
    }
  }
}


void writeToEeprom(String sample)
{
  for (int i = 0; i < stringFormat.length(); i++)
  {
    EEPROM.write(0x0F + i, sample[i]); //Write one by one with starting address of 0x0F
  }
  EEPROM.commit();
  getFromEeprom();
}
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_DATA) {
    String  state = "";
    for (int i = 0; i < len; ++i) {
      state = state + String(static_cast<char>(data[i]));
    }
    if (state.endsWith("ZZ"))
    {
      if (stringFormat.length() + 2 == state.length())
      {
        writeToEeprom(state);
        getFromEeprom();
      }
      else {
        client->text("Length not matched");
      }
    }
    else if (state.endsWith("Z"))
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

    else if (state == "a")
    {
      mp3.playFolder(1, 1);
    }

    else if (state == "b")
    {
      mp3.playFolder(2, 1);
    }
    else if (state == "c")
    {
      mp3.playFolder(3, 1);
    }
    else if (state == "++")
    {
      mp3Serial.enableRx(true);
      volumemp3 = mp3.getVolume();
      mp3Serial.enableRx(false);
      if (volumemp3 < 30)
      {
        volumemp3++;
        mp3.setVolume(volumemp3);
      }
      else {
        client->text("Maximum Volume reached");
      }
      client->text(String(volumemp3));
    }
    else if (state == "--")
    {
      mp3Serial.enableRx(true);
      volumemp3 = mp3.getVolume();
      mp3Serial.enableRx(false);
      if (volumemp3 > 10)
      {
        volumemp3--;
        mp3.setVolume(volumemp3);
      }
      else {
        client->text("Minimum Volume reached");
      }
      client->text(String(volumemp3));
    }
  }
  switch (type) {
    case WS_EVT_CONNECT:
      s = "";
      for (int i = 0; i < 10; i++)
      {
        s = s + String( timeArray[i]) + "-";
      }
      client->text(s);
      mp3Serial.enableRx(true);
      client->text(isTimerInititialized ? "RTC FOund  " + String(mp3.getVolume()) : "RTC not Found");
      mp3Serial.enableRx(false);

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
void setup()
{
  EEPROM.begin(512);
  //  writeToEeprom("22/11/23/12/21/13/20/14/1/1");
  getFromEeprom();
  pinMode(musicSwitch, OUTPUT);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  digitalWrite(musicSwitch, LOW);
  Serial.begin(115200);
  display.setBrightness(0x0a); //set the diplay to maximum brightness

  WiFi.softAP("VKbhanu", "bhanu1234");
  IPAddress myIP = WiFi.softAPIP();
  if (! rtc.begin())
  {
    isTimerInititialized = false;
    digitalWrite(LED, LOW);
  }
  else
    digitalWrite(LED, HIGH);
  if (! rtc.isrunning())
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));

  initWebSocket();
  server.begin();

  mp3Serial.begin(MP3_SERIAL_SPEED, SWSERIAL_8N1, MP3_RX_PIN, MP3_TX_PIN, false, MP3_SERIAL_BUFFER_SIZE, 0); //false=signal not inverted, 0=ISR/RX buffer size (shared with serial TX buffer)

  mp3.begin(mp3Serial, MP3_SERIAL_TIMEOUT, DFPLAYER_MINI, false); //"DFPLAYER_MINI" see NOTE, false=no response from module after the command

  mp3.stop();                             //if player was runing during ESP8266 reboot

  mp3.reset();                            //reset all setting to default

  mp3.setSource(2);                       //1=USB-Disk, 2=TF-Card, 3=Aux, 4=Sleep, 5=NOR Flash

  mp3.setEQ(0);                           //0=Off, 1=Pop, 2=Rock, 3=Jazz, 4=Classic, 5=Bass
  mp3.setVolume(volumemp3);                      //0..30, module persists volume on power failure

  mp3.sleep();                            //inter sleep mode, 24mA

  mp3.wakeup(2);                          //exit sleep mode & initialize source 1=USB-Disk, 2=TF-Card, 3=Aux, 5=NOR Flash

  mp3Serial.enableRx(true);
  volumemp3 =  mp3.getVolume();
  mp3Serial.enableRx(false);              //disable interrupts on RX-pin, less overhead than mp3Serial.listen()

  mp3.enableDAC(true);
  mp3.repeatAll(true);
  display.showNumberDecEx(0, 0b11100000, true);


}


void loop()
{
  if (millis() - lastSendTime > interval )
  {
    if (! rtc.begin()) {
      isTimerInititialized = false;  digitalWrite(LED, LOW);
    }
    else
    {
      isTimerInititialized = true;
      DateTime now = rtc.now();
      if ( now.year() >= 2024 && now.year() <= 2050)
      {
        timestamp = String(now.year(), DEC) + '/' + String(now.month(), DEC) + '/' + String(now.day(), DEC) + " T " + String(now.hour(), DEC) + ':' + String(now.minute(), DEC) + ':' + String(now.second(), DEC);
        ws.textAll(timestamp);


        if (timeArray[9] == 1 || timeArray[8] == 1)
        {
          display.clear();  delay(100);
          if (timeArray[9] == 1 && timeArray[8] == 1)
            display.showNumberDec(1111, true);
          else  if (timeArray[8] == 1)
            display.showNumberDec(1100, true);
          else  if (timeArray[9] == 1)  display.showNumberDec(11, true);
            
          else  display.showNumberDec(0, true);
          
          if (timeArray[8] == 1 && now.hour() >= timeArray[0] &&
              now.minute() >= timeArray[1] &&
              now.hour() <= timeArray[2] &&
              now.minute() <= timeArray[3])
          {

            if (!isMusicStarted)
            {
              digitalWrite(musicSwitch, HIGH);
              mp3.playFolder(1, 1);
              isMusicStarted = true;
              digitalWrite(LED, LOW);
            }
          }
          else  if (timeArray[9] == 1 && now.hour() >= timeArray[4] &&
                    now.minute() >= timeArray[5] &&
                    now.hour() <= timeArray[6] &&
                    now.minute() <= timeArray[7]
                   )
          {
            if (!isMusicStarted)
            {
              digitalWrite(musicSwitch, HIGH);
              mp3.playFolder(3, 1);
              isMusicStarted = true;
              digitalWrite(LED, LOW);
            }
          }
          else if (isMusicStarted) {
            isMusicStarted = false;
            mp3.pause();
            digitalWrite(musicSwitch, LOW);
            digitalWrite(LED, HIGH);
          }
        }
        else if (isMusicStarted) {
          isMusicStarted = false;
          mp3.pause();
          digitalWrite(musicSwitch, LOW);
          digitalWrite(LED, HIGH); display.showNumberDec(0, true);
        }
        delay(500); display.clear();
        display.showNumberDecEx(((now.hour() > 12 ? now.hour() - 12 : (now.hour() == 0 ? 12 : now.hour())) * 100) + now.minute(), 0b11100000, true);

      }
    }
    lastSendTime = millis();        // timestamp the message
    interval = random(2000) + 3000; // 2-3 seconds
  }
}
