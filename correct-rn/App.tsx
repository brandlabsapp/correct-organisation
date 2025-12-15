import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

function App(): React.JSX.Element {
  const ref = useRef<WebView>(null);
  const APP_URL = 'https://correctapp.in';

  const [channelId, setChannelId] = useState<string | null>(null);

  // --------------- CONFIGURE PUSH NOTIFICATION ---------------

  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  // --------------- CREATE FCM TOKEN ---------------

  const createFCMToken = () => {
    messaging().requestPermission();

    // Get the FCM token
    messaging()
      .getToken()
      .then(async token => {
        if (token) {
          console.log('FCM Token:', token);
        } else {
          console.log('No FCM token available');
        }
      })
      .catch(error => {
        console.log('Error getting FCM token:', error);
      });
  };

  // --------------- CREATE NOTIFICATION CHANNEL ---------------

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel_1',
        channelName: 'My channel',
        channelDescription: 'A channel for notifications',
        playSound: false,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      () => {
        PushNotification.getChannels(channelIds => {
          console.log(channelIds);
          setChannelId(channelIds[0]);
        });
      },
    );
  };

  // --------------- REQUEST NOTIFICATION PERMISSION ---------------

  async function requestNotificationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // --------------- HOOKS ---------------

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestNotificationPermission();
    }
  }, []);

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log('A new foreground notification arrived:', remoteMessage);
      PushNotification.localNotification({
        channelId: channelId || 'channel_1',
        id: Date.now().toString(),
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body || '',
        playSound: true,
        soundName: 'default',
        importance: 'high',
        vibrate: true,
        vibration: 300,
        actions: ['yes', 'no'],
      });
    });

    // Listen for notifications when the app is in the background or terminated
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('A new background notification arrived:', remoteMessage);
      PushNotification.localNotification({
        channelId: channelId || 'channel_1',
        id: Date.now().toString(),
        title: remoteMessage?.notification?.title || '',
        message: remoteMessage?.notification?.body || '',
        playSound: true,
        soundName: 'default',
        importance: 'high',
        vibrate: true,
        vibration: 300,
        actions: ['yes', 'no'],
      });
    });
  }, [channelId]);

  useEffect(() => {
    const notificationListener = async () => {
      await messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:');
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.data,
        );
      });

      const initialNoti = await messaging().getInitialNotification();
      if (initialNoti) {
        console.log(
          'Notification caused app to open from quit state:',
          initialNoti.data,
        );
      }
    };
    notificationListener();
  }, []);

  useEffect(() => {
    createChannel();
    createFCMToken();
  }, []);

  return (
    <>
      <WebView ref={ref} source={{uri: APP_URL}} />
    </>
  );
}

export default App;
