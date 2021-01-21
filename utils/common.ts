import { formatISO, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz'

export const TIMEOUT_LONG: number = 200;
export const NO_TIMEOUT: number = 0;
// export const STATUS_OK: number = 200;

export const STATUS_OK: string = 'ok';
export const STATUS_NOK: string = 'nok';
export const HTTP_STATUS_BAD_REQUEST: number = 400;

export const BIOMETRIC_SUPPORT_KEY: string = 'isBiometricSupported';
export const CREATE_BIOMETRIC_ENCRYPTION_ACTION: string = 'createBiometricEncryption';
export const PREPARE_ENCRYPT_STORAGE_ACTION: string = 'prepareEncryptStorage';
export const ENCRYPT_STORAGE_ACTION: string = 'encryptStorage';
export const DECRYPT_STORAGE_ACTION: string = 'decryptStorage';
export const GET_DECRYPT_PASSWORD_ACTION: string = 'getDecryptPassword';

export const capitalStart = (text?: string) => {
  if (!text) {
    return '';
  }
  const stringLength: number = text.length;
  const firstLetter = text.slice(0, 1).toUpperCase();
  const restLetters = text.slice(1, stringLength);

  return firstLetter + restLetters;
};

export const isCalendarApp = (): boolean =>
  process.env.REACT_APP_URL === 'http://localhost:4003' ||
    process.env.REACT_APP_URL === 'https://calendar.bloben.com' ||
  process.env.REACT_APP_URL === 'https://calendar.nibdo.com';

export const parseToDate = (item: string | Date): Date =>
    typeof item === 'string' ? parseISO(item) : item;

export const parseDateToString = (item: string | Date): string =>
    typeof item === 'string' ? item : item.toISOString();


export const colorPalette: any = {
    'red': { dark: '#ef9a9a', light: '#e53935' },
    'pink': { dark: '#f48fb1', light: '#d81b60' },
    'purple': { dark: '#ce93d8', light: '#8e24aa' },
    'deep purple': { dark: '#b39ddb', light: '#5e35b1' },
    'indigo': { dark: '#9fa8da', light: '#3949ab' },
    'blue': { dark: '#90caf9', light: '#1e88e5' },
    'light blue': { dark: '#81d4fa', light: '#039be5' },
    'cyan': { dark: '#80deea', light: '#00acc1' },
    'teal': { dark: '#80cbc4', light: '#00897b' },
    'green': { dark: '#a5d6a7', light: '#43a047' },
    'light green': { dark: '#c5e1a5', light: '#7cb342' },
    'yellow': { dark: '#fff59d', light: '#fdd835' },
    'amber': { dark: '#ffe082', light: '#ffb300' },
    'orange': { dark: '#ffcc80', light: '#fb8c00' },
    'deep orange': { dark: '#ffab91', light: '#f4511e' },
    'brown': { dark: '#bcaaa4', light: '#6d4c41' },
    'blue grey': { dark: '#b0bec5', light: '#546e7a' },
};
export const findInArrayById = (array: any, id: string): any =>
    new Promise((resolve) => {
        if (!array || array.length === 0) {
            resolve(false);
        }

        for (let i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                resolve(array[i])
            }

            // Handle loop end
            if (i + 1 === array.length) {
                resolve(false)
            }
        }
    });
export const findIndexById = (array: any, id: string): any =>
    new Promise((resolve) => {
        if (!array || array.length === 0) {
            resolve(false);
        }

        for (let i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                resolve(i)
            }

            // Handle loop end
            if (i + 1 === array.length) {
                resolve(false)
            }
        }
    });


export const sendMessageToReactNative = (data: any) => {
    // @ts-ignore
    window.ReactNativeWebView.postMessage(JSON.stringify(data))
}

export const generateRandomString = () => {
    const stringLength: number = 256;
    const charset: string =
        "0123456789abcdefghijklmnopqrstuvwxyz,./;']`=-<>?:|}{~_+()*&^%$#@!";
    let i: number = 0;
    let result: string = '';
    while (i < stringLength) {
        result += charset.charAt(Math.random() * charset.length);
        i += 1;
    }

    return result;
};

export const generateRandomDemoString = () => {

    const stringLength: number = 16;
    const charset: string =
        "0123456789abcdefghijklmnopqrstuvwxyz";
    let i: number = 0;
    let result: string = '';
    while (i < stringLength) {
        result += charset.charAt(Math.random() * charset.length);
        i += 1;
    }

    return result;
};


export const getLocalTimezone = (): string =>
    Intl.DateTimeFormat().resolvedOptions().timeZone

const getTimezoneOffset = (date: Date): string => {
    const dateString: string = date.toString();

    return dateString.slice(dateString.indexOf('GMT'), dateString.indexOf('GMT') + 8)
}

export const parseTimezoneText = (zone: string): string => {
    if (zone === 'device') {
        const timezoneDevice: string = getLocalTimezone();

        return `Device (${timezoneDevice})`;
    }

    if (zone === 'floating') {
        return 'Floating (fixed) time';
    }

    return zone;
}

export const parseTimezoneTextWithOffset = (zone: string, currentDate?: Date): string => {
    const date: Date = currentDate ? currentDate : new Date();

    if (zone === 'device') {
        const timezoneOffsetString: string = getTimezoneOffset(date);

        const timezoneDevice: string = getLocalTimezone();

        return `Device (${timezoneDevice}) ${timezoneOffsetString}`;
    }

    return `${zone}`;
}
