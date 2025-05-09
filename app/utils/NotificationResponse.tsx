import { Linking, View, Text, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// This file handles what happens when a user taps on a notification
export function ErrorBoundary(props: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: 'red', fontSize: 16 }}>Error: {props.error.message}</Text>
    </View>
  );
}

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5D3FD3',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notification Permission Required', 
        'Please enable notifications to receive contest reminders.'
      );
      return null;
    }
    
    // Only if you need remote notifications
    // token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  return token;
}

// Schedule a notification for a contest
export const scheduleContestNotification = async (
  contestId: string,
  contestName: string,
  platform: string,
  secondsUntilNotification: number,
  url: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: contestId,
      content: {
        title: '🚀 Contest Starting Soon!',
        body: `${contestName} on ${platform} starts in 5 minutes!`,
        data: { contestId, platform, url },
      },
      trigger: { seconds: secondsUntilNotification },
    });
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

export default function NotificationResponseHandler() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Request permissions on component mount
    registerForPushNotificationsAsync();

    // Listen for new notifications while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const contestId = notification.request.content.data?.contestId;
      if (contestId) {
        // Store information that notification was received
        AsyncStorage.setItem(`notification_shown_${contestId}`, 'true');
      }
    });

    // Set up the notification response listener when component mounts
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      try {
        const data = response.notification.request.content.data;
        const url = data?.url;
        
        if (url && typeof url === 'string') {
          // Open the contest page in browser
          Linking.openURL(url).catch(err => {
            console.error('Error opening URL:', err);
            // If opening URL fails, navigate to contests screen
            router.navigate('/(app)/(Contests)');
          });
        } else {
          // Navigate to contests screen if no URL
          router.navigate('/(app)/(Contests)');
        }
      } catch (error) {
        console.error('Error handling notification response:', error);
        // Fallback to contests screen if any error occurs
        router.navigate('/(app)/(Contests)');
      }
    });

    // Clean up the listeners when component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // This component doesn't render anything visible
  return <View style={{ display: 'none' }} />;
}
