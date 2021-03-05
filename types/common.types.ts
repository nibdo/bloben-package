type TCryptoPasswordKey = 'cryptoPassword';

export interface TCryptoPasswordObject {
  key: TCryptoPasswordKey;
  cryptoPassword: string;
  pinAttempts: number;
  pinCode: number | null;
}

export interface UserProfile {
  appEmail: string;
  publicName: string;
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
  boolValue?: boolean;
}
