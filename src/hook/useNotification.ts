import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const useNotification = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        requestNotificationPermission();
        // getToken();
        requestUserPermission();
    }, []);

    const requestNotificationPermission = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Notification permission granted");
        } else {
            console.log("Notification permission denied");
        }
    }

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL

        if (enabled) {
            console.log('Authorization status:', authStatus);
            getToken();
        }
    };

    useEffect(() => {
        PushNotification.createChannel(
            {
                channelId: "default-channel-id",
                channelName: "default Channel",
                channelDescription: "A default channel",
                soundName: "default",
                importance: 4,
                vibrate: true
            },
            (created: any) => console.log(`Channel created: ${created}`)
        )
    }, [])

    // Foreground Notification Handling
    useEffect(() => {
        requestUserPermission();

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('Notification received in foreground:', remoteMessage);

            PushNotification.localNotification({
                channelId: 'default-channel-id',
                title: 'REAS',
                message: remoteMessage.notification?.body,
                playSound: true, // Play default sound
                soundName: 'default', // Ensure sound is set
                importance: 4,
                vibrate: true,
            });
        });

        return unsubscribe;
    }, [])

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