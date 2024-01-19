#include <TM1637Display.h>

const int CLK = 12; //Set the CLK pin connection to the display
const int DIO = 14; //Set the DIO pin connection to the display
const int Speaker = 13;
const int button = 5 ;
int numCounter = 0;
bool started = false;



TM1637Display display(CLK, DIO); //set up the 4-Digit Display.

void setup()
{
  display.setBrightness(0x0a); //set the diplay to maximum brightness
  pinMode(Speaker, OUTPUT);
  digitalWrite(Speaker, HIGH);
  pinMode(button, INPUT);
}


void loop()
{
  
 if (started==true)
  {
    for (int numCounter = 10; numCounter >= 0; numCounter--) //Iterate numCounter
    {
      display.showNumberDec(numCounter); //Display the numCounter value;
      delay(1000);
    }
    digitalWrite(Speaker, LOW);
    delay(3000);
    digitalWrite(Speaker, HIGH);
    started = false ;
  }
  else  if (digitalRead(button) == LOW)
  {
    started = true;
  }
  else {
    started = false;
    display.showNumberDec(10);
  }
  delay(500); 
}
