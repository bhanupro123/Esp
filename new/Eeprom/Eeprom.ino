#include <EEPROM.h>
int addr = 0;
String datas = "00/00/00/00/00/00/00/00/1/1";
String stringFormat = "00/00/00/00/00/00/00/00/1/1";
int timeArray[] = {5, 30, 6, 0, 18, 0, 19, 0, 1, 1};
void StringSpiltter()
{
  String splitter = "";
  for (int i = 0; i < datas.length(); i++)
  {
    if (datas[i] == '/' || i == datas.length() - 1)
    {
      if (i == datas.length() - 1)
      {
        splitter = splitter + datas[i];
      }
      Serial.println(splitter);
      splitter = "";
    }
    else {
      splitter = splitter + datas[i];
    }
  }
}


void getFromEeprom()
{
  String splitter = "";
  Serial.println(); Serial.println();int index=0;
  for (int i = 0; i < stringFormat.length(); i++)
  {

    String singleStr = String(char(EEPROM.read(0x0F + i)));
    if (singleStr == "/")
    {
      timeArray[index] = splitter.toInt();
      Serial.println(splitter + "----" +index + " ----- " + String( timeArray[index]));
 splitter = "";
 index++;
    }
    else if (i == stringFormat.length() - 1)
    {
      splitter = splitter + singleStr;
      timeArray[index] = splitter.toInt();
      Serial.println(splitter + "----" + index + " ----- " + String( timeArray[index]));
 splitter = "";
    }
    else {
      splitter = splitter + singleStr;
    }
  }

  Serial.println();
  Serial.println("--------------");
  String s = "";
  for (int i = 0; i < 10; i++)
  {
    Serial.println(String(i) + "##################" + String( timeArray[i]));
  }
  Serial.println(s);
}


void writeToEeprom(String sample)
{
  for (int i = 0; i < sample.length(); i++)
  {
    EEPROM.write(0x0F + i, sample[i]); //Write one by one with starting address of 0x0F
  }
  EEPROM.commit();

}

void setup() {
  EEPROM.begin(512);  //Initialize EEPROM
  Serial.begin(115200);

  getFromEeprom();
}

void loop() {}
