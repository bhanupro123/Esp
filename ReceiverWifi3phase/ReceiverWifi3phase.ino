
#include <ESP8266WiFi.h>
WiFiServer server(8080);
const char* ssid = "ESP_LORA_R";
const char* password = "bhanu1234";
int flag = 1;
const char *host = "192.168.4.1";
int SSR = 5;  //d5
int LED = 2;   //d4
WiFiClient client ;
void setup()
{
  pinMode(SSR, OUTPUT);
  digitalWrite(SSR, LOW);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  Serial.begin(115200);
  Serial.println(); WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password); //Connect to wifi

  // Wait for connection
  Serial.println("Connecting to Wifi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);

  Serial.print("IP address: ");
  Serial.print(WiFi.localIP());
  client = server.available();
}

void loop()
{

  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("================================");
    delay(1000);
  }

  if (flag == 1)  {  // if true means not connected to any server
    if (client.connect(host, 8080)) { // connect to server
       flag = 0;
      Serial.println("Connected to server");
         // reflect the status of connection
    }
  }
  else {
    while (client.available()) { // check for incomming data from server
      char dataFromServer = (char) client.read();
      if (dataFromServer == 'A' || dataFromServer == '1') {
        digitalWrite(SSR, HIGH );
        digitalWrite(LED, LOW );
      }
      else if (dataFromServer == 'a' || dataFromServer == '0') {
        digitalWrite(SSR, LOW);
        digitalWrite(LED, HIGH);
      }
      Serial.println(dataFromServer);
    }
    if (client.connected()) { // check if connection exists
      client.println("e.....");
    }
    else {
      Serial.println("No server available disconnecting");                                                                   client.stop();
      flag = 1;
    }
  }
}
