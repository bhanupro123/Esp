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
int volumemp3 = 30;
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
bool isLightStarted = false;
bool isForcedMusicByUser = false;
String s = "";
TM1637Display display(CLK, DIO); //set up the 4-Digit Display.
const int MusicSwitch = 14;
const int inputSwitch = 12;
int startTotalMinutes = 0;
int endTotalMinutes = 0;
int currentTotalMinutes = 0;

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
    else if (state == "STOP")
    {
      stopPlayer();
    }
    else if (state == ">>")
    {
      mp3.next();
    }

    else if (state == "<<")
    {
      mp3.previous();
    }
    else if (state.startsWith("##"))
    {
      isForcedMusicByUser = true;
      isMusicStarted = true;
      if (state == "##11")
        startMusicPlayer(1, false);
      else if (state == "##12")
        startMusicPlayer(1, true);
      else if (state == "##21")
        startMusicPlayer(2, false);
      else if (state == "##22")
        startMusicPlayer(2, true);
      else if (state == "##31")
        startMusicPlayer(3, false);
      else if (state == "##32")
        startMusicPlayer(3, true);
      else if (state == "##41")
        startMusicPlayer(4, false);
      else if (state == "##42")
        startMusicPlayer(4, true);
      else if (state == "##51")
        startMusicPlayer(5, false);
      else if (state == "##52")
        startMusicPlayer(5, true);
      else if (state == "##61")
        startMusicPlayer(6, false);
      else if (state == "##62")
        startMusicPlayer(6, true);
      else if (state == "##71")
        startMusicPlayer(7, false);
      else if (state == "##72")
        startMusicPlayer(7, true);
      else if (state == "##81")
        startMusicPlayer(8, false);
      else if (state == "##91")
        startMusicPlayer(9, false);
      else if (state == "##101")
        startMusicPlayer(10, false);
      else if (state == "##111")
        startMusicPlayer(11, false);
    }
    else if (state == "START")
    {
      startPlayer();
    }
    else if (state == "b")
    {
      mp3.playFolder(2, 2);  mp3.repeatAll(true);
    }  else if (state == "c")
    {
      mp3.playFolder(3, 1);  mp3.repeatAll(true);
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
      client->text("Volume "+String(volumemp3));
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
      client->text("Volume "+String(volumemp3));
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
      client->text(isTimerInititialized ? "Volume " + String(mp3.getVolume()) : "Volume not Found");
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

void isMusicPlaying()
{
  isMusicStarted = false;
  mp3.pause();
  digitalWrite(MusicSwitch, LOW);
}
void startPlayer()
{
  isForcedMusicByUser = true;
  if (isTimerInititialized)
  {
    playSongsByNow(rtc.now());
  }
  else {
    mp3.playFolder(3, 1);
    mp3.repeatAll(true);
  }

}
void stopPlayer()
{
  isForcedMusicByUser = false;
  isMusicPlaying();

}
void startMusicPlayer(int dayofthweek, bool ispm)
{
  mp3.playFolder(dayofthweek, ispm ? 2 : 1);
  isMusicStarted = true;
  mp3.repeatAll(true);
  digitalWrite(MusicSwitch, HIGH);
}



void setup()
{
  EEPROM.begin(512);
  //  writeToEeprom("22/11/23/12/21/13/20/14/1/1");
  getFromEeprom();
  pinMode(MusicSwitch, OUTPUT);
  pinMode(LED, OUTPUT);
  pinMode(inputSwitch, INPUT);
  digitalWrite(LED, HIGH);
  digitalWrite(MusicSwitch, LOW);
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

  display.showNumberDecEx(0, 0b11100000, true);

}

void playSongsByNow( DateTime now )
{
  if ( now.year() >= 2024 && now.year() <= 2050)
  {
    if ((now.month() == 8 && now.day() == 15) || (now.month() == 1 && now.day() == 26) || (now.month() == 2 && now.day() == 14))
    {
      startMusicPlayer(10, false);
    }
    else  if (now.month() == 5 && (now.day() == 18 || now.day() == 9))
    {
      startMusicPlayer(9, true);
    }
    else  if (now.day() == 8)
    {
      startMusicPlayer(8, now.hour() > 12);
    }
    else  if (now.day() == 9)
    {
      startMusicPlayer(9, now.hour() > 12);
    }
    else
    {
      startMusicPlayer( now.dayOfTheWeek() + 1, now.hour() > 12);
    }
  }
  else
  {
    startMusicPlayer( 3, false);
  }
}

void playSongsByDate(int startTotalMinutes, int endTotalMinutes, int currentTotalMinutes, DateTime now)
{
  if (startTotalMinutes > 0 && currentTotalMinutes >= startTotalMinutes - 1 && currentTotalMinutes <= endTotalMinutes && !isMusicStarted) {
    digitalWrite(MusicSwitch, HIGH);
  }
  if (startTotalMinutes > 0 && currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes) {

    if (!isMusicStarted)
    { 
      playSongsByNow(now);
    }

  }
  else if (isMusicStarted) {
    isMusicPlaying();
  }
}

void loop()
{
  if (digitalRead(inputSwitch) == LOW)
  {
    if (isMusicStarted)
    {
      stopPlayer();
      volumemp3 = 30;
      mp3.setVolume(volumemp3);
    }
    else
    { 
      startPlayer();
      volumemp3 = 11;
       mp3.setVolume(11);
    }
    delay(2000);
  }
  if (millis() - lastSendTime > interval )
  {
    if (isTimerInititialized)
    {
      DateTime now = rtc.now();
      if (!isForcedMusicByUser)
      {

        if ( now.year() >= 2024 && now.year() <= 2050)
        {
          timestamp = String(now.year(), DEC) + '/' + String(now.month(), DEC) + '/' + String(now.day(), DEC) + " T " + String(now.hour(), DEC) + ':' + String(now.minute(), DEC) + ':' + String(now.second(), DEC);
          ws.textAll(timestamp);
          if (timeArray[8] == 1&&now.hour()<12)
          {
            startTotalMinutes = (timeArray[0] * 60) + timeArray[1];
            endTotalMinutes = (timeArray[2] * 60) + timeArray[3];
            currentTotalMinutes = (now.hour() * 60) + now.minute();
            playSongsByDate(startTotalMinutes, endTotalMinutes, currentTotalMinutes, now);
          }
          else if (timeArray[9] == 1&&now.hour()>=12)
          {
            startTotalMinutes = (timeArray[4] * 60) + timeArray[5];
            endTotalMinutes = (timeArray[6] * 60) + timeArray[7];
            currentTotalMinutes = (now.hour() * 60) + now.minute();
            playSongsByDate(startTotalMinutes, endTotalMinutes, currentTotalMinutes, now);
          }
          else if (isMusicStarted) {
            isMusicPlaying();
          }

        }
        display.clear();
        display.showNumberDecEx(((now.hour() > 12 ? now.hour() - 12 : (now.hour() == 0 ? 12 : now.hour())) * 100) + now.minute(), 0b11100000, true);

      }
      else { 
        display.clear();
        display.showNumberDecEx(((now.hour() > 12 ? now.hour() - 12 : (now.hour() == 0 ? 12 : now.hour())) * 100) + now.minute(), 0b11100000, true);

      }
    }
    else {
      display.clear();
      display.showNumberDecEx(9999, 0b11100000, true);
    }

    lastSendTime = millis();        // timestamp the message
    interval = random(2000) + 3000; // 2-3 seconds
  }
}
