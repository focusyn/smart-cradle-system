import React, { Component, useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES, FONTS, icons, images } from '../../constants';
import { RTDB } from '../../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const games = require('../../assets/icons/games.png');
const USER_NAME = 'USER_NAME';

export default function Home() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [userName, setUserName] = useState('');
  const [temperature, setTemperature] = useState(32.5);
  const [humidity, setHumidity] = useState(60.8);
  const [moisture, setMoisture] = useState(20);
  const [soundLevel, setSoundLevel] = useState(50);
  const [weight, setWeight] = useState(20);
  const [avgWeight, setAvgWeight] = useState(0);
  const [motion, setMotion] = useState(1);
  const [swing, setSwing] = useState(false);

  async function createNotification({ title, body }) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 1 },
    });
  }

  const fetchSensorData = () => {
    onValue(ref(RTDB), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data?.sensor?.DATA);
        setTemperature(data?.sensor?.DATA?.Temperature);
        setHumidity(data?.sensor?.DATA?.Humidity);
        setMoisture(data?.sensor?.DATA?.Moisture);
        setSoundLevel(data?.sensor?.DATA?.Sound);
        setWeight(data?.sensor?.DATA?.Weight);
        setAvgWeight(data?.sensor?.DATA?.AvgWeight);
        setMotion(data?.sensor?.DATA?.Motion);

        // console length of data collection
      } else {
        console.log('No data available');
      }
    });
  };

  const checkMotion = async () => {
    if (motion !== 1) {
      //  TODO: addNotification
      await createNotification({
        title: 'Motion detected',
        body: 'Please check it out, your baby might be awake!',
      });
    }
  };

  const checkMoisture = async () => {
    if (moisture > 50) {
      //  TODO: addNotification
      await createNotification({
        title: 'Moisture detected',
        body: 'Please check it out, your baby might be peeing!',
      });
    }
  };

  const checkTemperature = async () => {
    if (temperature > 35) {
      //  TODO: addNotification
      await createNotification({
        title: 'High Temperature detected',
        body: 'Please check it out, your baby might be burning!',
      });
    }
    if (temperature < 12) {
      //  TODO: addNotification
      await createNotification({
        title: 'Low Temperature detected',
        body: 'Please check it out, your baby might be freezing!',
      });
    }
  };

  const checkSound = async () => {
    if (soundLevel > 127) {
      //  TODO: addNotification
      await createNotification({
        title: 'High Sound detected',
        body: 'Please check it out, your baby might be crying!',
      });
    }
  };
  const checkWeight = async () => {
    if (weight < 10) {
      //  TODO: addNotification
      await createNotification({
        title: 'Low Weight detected',
        body: 'Please check it out, your baby might be missing!',
      });
    }
  };

  useEffect(() => {
    const getPermission = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Enable push notifications to use the app!');
          await storage.setItem('expopushtoken', '');
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await storage.setItem('expopushtoken', token);
      } else {
        alert('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    getPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    saveUserName();
    setInterval(() => {
      fetchSensorData();
    }, 3000);

    return () => {
      clearInterval();
    };
  }, []);

  useEffect(() => {
    checkMotion();
    checkMoisture();
    checkTemperature();
    checkSound();
    checkWeight();
  }, [motion, moisture, temperature, soundLevel, weight]);

  async function saveUserName() {
    await AsyncStorage.getItem(USER_NAME).then((name) => {
      setUserName(name);
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <WebView
        source={{ uri: 'https://smart-cradle-system.vercel.app/admin/home' }}
        style={{
          width,
          resizeMode: 'cover',
          flex: 1,
        }}
        scalesPageToFit={false}
      />
    </SafeAreaView>
  );
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
