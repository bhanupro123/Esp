#include "RTClib.h" 
RTC_DS1307 DS1307_RTC; 
 


char Week_days[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

void setup () {       
  Serial.begin(115200);

#ifndef ESP8266
  while (!Serial); // wait for serial port to connect. Needed for native USB
#endif

  if (!DS1307_RTC.begin()) {
    Serial.println("Couldn't find RTC");
    while(1);
  }
  
  Serial.println();  
  
}
 
void loop () {
    DateTime now = DS1307_RTC.now();
    
    Serial.print(now.year(), DEC);
    Serial.print('/');
    if((now.month())<10)
    Serial.print('0');
    Serial.print(now.month(), DEC);
    Serial.print('/');
    if((now.day())<10)
    Serial.print('0');
    Serial.print(now.day(), DEC);  
    Serial.print(' ');
    if((now.hour())<10)
    Serial.print('0');
    Serial.print(now.hour(), DEC);
    Serial.print(':');
    if((now.minute())<10)
    Serial.print('0');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    if((now.second())<10)
    Serial.print('0');
    Serial.print(now.second(), DEC);
    Serial.println();
    delay(1000);   
}
