import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './src/services/notificationHandle';
import { UserProvider } from './src/context/UserContext';
import { FCMProvider } from './src/services/FCMContext'; 
import SplashScreen from 'react-native-splash-screen';


const App = () => {
  useEffect(() => {
    SplashScreen.hide(); 
  }, []);


  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open:', remoteMessage);
        }
      });

    return unsubscribe;
  }, []);


  return (
    <FCMProvider>
      <NavigationContainer>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </NavigationContainer>
    </FCMProvider>
  );
};

export default App;
