import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken();
    }
  } else {
    // Android 13+ requires permission
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getFCMToken();
    }
  }
}

export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // Send this token to your server
    return token;
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }
}