import CryptoJS from 'crypto-js';

//
//Encrypt and decrypt with Crypto
//
const encryptData = (dataForEncryption: any, cryptoPassword: string) =>
  CryptoJS.AES.encrypt(
    JSON.stringify(dataForEncryption),
    cryptoPassword
  ).toString();
const Crypto = {
  encrypt: (dataForEncryption: any, cryptoPassword: string): Promise<string> =>
    new Promise((resolve) => {
      resolve(encryptData(dataForEncryption, cryptoPassword));
    }),
  decrypt(encryptedData: string, cryptoPassword: string): Promise<object> {
    return new Promise((resolve, reject) => {
      // Decrypt data with Crypto
      const bytes = CryptoJS.AES.decrypt(encryptedData, cryptoPassword);
      const originalText: string = bytes.toString(CryptoJS.enc.Utf8);
      const jsonObj: object = JSON.parse(originalText);
      if (jsonObj) {
        resolve(jsonObj);
      } else {
        reject();
      }
    });
  },

  verify(encryptedData: string, cryptoPassword: string): Promise<boolean> {
    // Decrypt data with Crypto
    return new Promise((resolve, reject) => {
      const bytes = CryptoJS.AES.decrypt(encryptedData, cryptoPassword);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (originalText !== undefined && originalText.length > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  },

  validate(password: string, repeatedPassword: string) {
    return new Promise((resolve, reject) => {
      if (password !== repeatedPassword) {
        reject('Passwords are not matching');
        // tslint:disable-next-line:no-magic-numbers
      } else if (password.length < 4 || repeatedPassword.length < 4) {
        reject('Password is too short');
      } else {
        resolve();
      }
    });
  },
};
export default Crypto;
