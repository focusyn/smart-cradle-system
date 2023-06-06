from firebase import firebase
import serial
import time
import schedule


firebase = firebase.FirebaseApplication(
    '', None)


def main_func():
    arduino = serial.Serial('com3', 9600)
    print('Established serial connection to Arduino')
    arduino_data = arduino.readline()

    decoded_values = str(arduino_data[0:len(arduino_data)].decode("utf-8"))
    list_values = decoded_values.split('x')

    for item in list_values:
        list_in_floats.append(float(item))

    print(f'Collected readings from Arduino: {list_in_floats}')

    # firebase

    data = {
        'Moisture': list_in_floats[0],
        'Motion': list_in_floats[1],
        'Temperature': list_in_floats[2],
        'Humidity': list_in_floats[3],
        'Sound': list_in_floats[4],
        "Weight": list_in_floats[5],
        "AvgWeight": list_in_floats[6],
    }

    print(data)

    firebase.put('/sensor', 'DATA', data)
    print('Data sent to firebase')

    arduino_data = 0
    list_in_floats.clear()
    list_values.clear()
    arduino.close()
    print('Connection closed')
    print('<----------------------------->')


# ----------------------------------------Main Code------------------------------------
# Declare variables to be used
list_values = []
list_in_floats = []

print('Program started')

# Setting up the Arduino
schedule.every(2).seconds.do(main_func)

while True:
    schedule.run_pending()
    time.sleep(1)
