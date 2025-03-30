import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const requestNotificationPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted");
    } else {
        console.log("Notification permission denied");
    }
}

const getToken = async () => {
    try {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
    } catch (error) {
        console.error("Error getting FCM token:", error);
    }
}

export const useNotification = () => {
    useEffect(() => {
        requestNotificationPermission();
        getToken();
    }, []);
};