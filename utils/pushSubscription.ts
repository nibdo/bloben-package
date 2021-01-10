import Axios from 'bloben-common/utils/axios';
import { logger } from 'bloben-common/utils/common';

const urlBase64ToUint8Array = (base64String: any) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    // eslint-disable-next-line
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
const convertedVapidKey: any = urlBase64ToUint8Array(
    process.env.REACT_APP_PUBLIC_VAPID_KEY
);

const sendSubscription = (subscription: any) => {
    return Axios.post(`/push/subscription`, {
        subscription,
        client: 'calendar',
    });
}

export const subscribeToPush = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration: ServiceWorkerRegistration) => {
                if (!registration.pushManager) {
                    logger('Push manager unavailable')

                    return;
                }
                registration.pushManager
                    .getSubscription()
                    .then((existedSubscription: PushSubscription | null) => {
                        if (existedSubscription === null) {
                            logger('No subscription detected, make a request.')
                            registration.pushManager
                                .subscribe({
                                               applicationServerKey: convertedVapidKey,
                                               userVisibleOnly: true,
                                           })
                                .then( (newSubscription: PushSubscription) => {
                                    logger('New subscription added.');
                                    sendSubscription(newSubscription);
                                })
                                .catch((e: any) => {
                                    if (Notification.permission !== 'granted') {
                                        logger('Permission was not granted.');
                                    } else {
                                        logger(
                                            'An error occurred during the subscription process.',
                                            e
                                        );
                                    }
                                });
                        } else {
                            logger('Existed subscription detected.');
                            sendSubscription(existedSubscription);
                        }
                    });
            })
            .catch((e: any) => {
                logger(
                    'An error occurred during Service Worker registration.',
                    e
                );
            });
    }
}
