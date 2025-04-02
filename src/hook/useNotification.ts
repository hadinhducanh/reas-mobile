import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const useNotification = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        requestNotificationPermission();
        getToken();
    }, []);

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
            setToken(token);
            console.log("FCM Token:", token);
        } catch (error) {
            console.error("Error getting FCM token:", error);
        }
    }

    return token;
};