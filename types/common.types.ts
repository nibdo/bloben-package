type TCryptoPasswordKey = 'cryptoPassword';

export type TCryptoPasswordObject = {
    key: TCryptoPasswordKey;
    cryptoPassword: string;
    pinAttempts: number;
    pinCode: number | null;
}
