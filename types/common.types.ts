type TCryptoPasswordKey = 'cryptoPassword';

export type TCryptoPasswordObject = {
    key: TCryptoPasswordKey;
    cryptoPassword: string;
    pinAttempts: number;
    pinCode: number | null;
}

export interface IUserProfile {
    appEmail: string | null;
    publicName: string | null;
    email: string | null;
    emailIsVerified: false;
    emailPublicKey: string | null;
}

export interface IEmailAlarm {
    subject: string;
    body: string;
}

export interface IPatchUpdate {
    key: string;
    value?: string | null;
    boolValue?: boolean
}
