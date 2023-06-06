
//---------------------------------------------------------READINGS--------------------
//-----------------------Weight Scale-------------------------
// weight reading= 114,894.6
// actual weight = 250g
// calibaration factor = 114,894.6/250 = 459.5784
//


#include <Arduino.h>
#include <Servo.h>
#include "HX711.h"
#include "DHT.h"

#define DHTTYPE DHT11

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = 4;
const int LOADCELL_SCK_PIN = 5;
// IR Sensor
int IRSensor = 7;

//buzzer to arduino pin 9
const int buzzer = 9;

// temperature/humidity pin
const int DHTPIN = 6;
const int SERVO_PIN = 8;  // Arduino pin connected to servo motor's pin


int angle = 0;
float weight = 0.00;
int speed = 30;
int mapSpeed = 0;
bool servoState = 0;

HX711 scale;

DHT dht(DHTPIN, DHTTYPE);
Servo servo;  // create servo object to control a servo


void setup() {
  Serial.begin(9600);

  // attaches the servo on pin 8 to the servo object
  servo.attach(SERVO_PIN);
  servo.write(angle);

  // initialize temperature/ humidity the sensor
  dht.begin();
  // Set buzzer - pin 9 as an output
  pinMode(buzzer, OUTPUT);
  // IR Sensor pin INPUT
  pinMode(IRSensor, INPUT);


  //Serial.println("Initializing the scale");
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  scale.set_scale(459.5784);
  //scale.set_scale(-471.497);                      // this value is obtained by calibrating the scale with known weights;
  scale.tare();  // reset the scale to 0
}

void moistureSensor() {
  int sensorValue = analogRead(A0);                     // Read the analog value from sensor
  int outputValue = map(sensorValue, 0, 1023, 255, 0);  // map the 10-bit data to 8-bit data
  if (outputValue > 100) {
    for (int i = 0; i < 5; i++) {
      tone(buzzer, 1000);  // Send 1KHz sound signal...
      delay(1000);         // ...for 1 sec
      noTone(buzzer);      // Stop sound...
      delay(1000);         // ...for 1sec
    }
  }
  Serial.print(outputValue);
  Serial.print("x");
}

int motionSensor() {
  int sensorStatus = digitalRead(IRSensor);  // Set the GPIO as Input
  if (sensorStatus != 1)                     // Check if the pin high or not
  {
    //Serial.println("Motion Detected!");  // print Motion Detected! on the serial monitor window
    tone(buzzer, 1000);                  // Send 1KHz sound signal...
    delay(2000);                         // ...for 1 sec
    noTone(buzzer);                      // Stop sound...
    delay(1000);                         // ...for 1sec
  }
  Serial.print(sensorStatus);
  Serial.print("x");
}

void readTempHumData() {
  float humi = dht.readHumidity();
  // read temperature as Celsius
  float tempC = dht.readTemperature();

  Serial.print(tempC);
  Serial.print("x");
  Serial.print(humi);

  if (tempC > 35) {
    tone(buzzer, 1000);  // Send 1KHz sound signal...
    delay(2000);         // ...for 1 sec
    noTone(buzzer);      // Stop sound...
    delay(1000);         // ...for 1sec
  }
  if (tempC < 12) {
    tone(buzzer, 1000);  // Send 1KHz sound signal...
    delay(2000);         // ...for 1 sec
    noTone(buzzer);      // Stop sound...
    delay(1000);         // ...for 1sec
  }
}

void readSoundData() {
  int sensorValue = analogRead(A1);                     // Read the analog value from sensor
  int outputValue = map(sensorValue, 0, 1023, 255, 0);  // map the 10-bit data to 8-bit data
  Serial.print("x");
  Serial.print(outputValue);
  if (outputValue > 127) {
    tone(buzzer, 1000);  // Send 1KHz sound signal...
    delay(2000);         // ...for 1 sec
    noTone(buzzer);      // Stop sound...
    delay(1000);         // ...for 1sec
  }
}



// void servoController(int speed) {

//   mapSpeed = map(speed, 0, 30, 30, 0);

//   // change angle of servo motor
//   for (angle = 0; angle < 180; angle += 2) {
//     servo.write(angle);
//     delay(mapSpeed);
//   }
//   // now scan back from 180 to 0 degrees
//   for (angle = 180; angle > 0; angle -= 2) {
//     servo.write(angle);
//     delay(mapSpeed);
//   }
// }

void readWeightSensor() {
  Serial.print("x");
  Serial.print(scale.get_units(), 1);
  Serial.print("x");
  Serial.println(scale.get_units(10), 5);
}

void loop() {
  //Calling the functions
  delay(1000);
  moistureSensor();
  delay(100);
  motionSensor();
  delay(100);
  readTempHumData();
  delay(100);
  readSoundData();
  delay(100);
  readWeightSensor();
  delay(100);
  // change angle of servo motor
  for (angle = 0; angle < 180; angle++) {
    servo.write(angle);
    delay(15);
  }
  // now scan back from 180 to 0 degrees
  for (angle = 180; angle > 0; angle--) {
    servo.write(angle);
    delay(15);
  }
}
