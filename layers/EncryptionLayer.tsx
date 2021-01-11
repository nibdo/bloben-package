import React, { useContext, useEffect, useState } from 'react';
import BrowserLayer from './BrowserLayer';
import {
  BIOMETRIC_SUPPORT_KEY,
  CREATE_BIOMETRIC_ENCRYPTION_ACTION,
  DECRYPT_STORAGE_ACTION,
  ENCRYPT_STORAGE_ACTION,
  GET_DECRYPT_PASSWORD_ACTION,
  PREPARE_ENCRYPT_STORAGE_ACTION,
  sendMessageToReactNative,
} from '../utils/common';
import { v4 } from 'uuid';
import GetPin from '../views/getPin/GetPin';
import { logger } from 'bloben-common/utils/common';
import { LocalForage } from '../utils/LocalForage';
import OpenPgp, { PgpKeys } from '../utils/OpenPgp';
import { MAX_PIN_UNLOCK_ATTEMPTS } from '../components/pinInput/PinInput';
import { logOut } from '../utils/logout';
import { Context } from '../context/store';
import Snackbar from '../components/snackbar/Snackbar';
import LoadingScreen from '../../bloben-common/components/loadingScreen/LoadingScreen';

const EncryptionLayer = () => {
  const [store, dispatch] = useContext(Context);

  const [isStorageEncrypted, setIsStorageEncrypted] = useState(false);
  const [state, setState] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [encryptionType, setEncryptionType] = useState('');

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const changeStorageEncryptedStatus = async (
    value: boolean
  ): Promise<void> => {
    await LocalForage.setItem('isStorageEncrypted', value);
    setIsStorageEncrypted(value);
  };

  const initEncryptionStatus = async (): Promise<void> => {
    setIsLoading(true);

    const wasInit: boolean | null = await LocalForage.getItem('wasInit');

    // Init first settings for encrypting storage
    if (!wasInit) {
      await changeStorageEncryptedStatus(false);
      await LocalForage.setItem('wasInit', true);
      await LocalForage.setItem('encryptionType', 'None');
      // @ts-ignore
      if (window && window.ReactNativeWebView) {
        await LocalForage.setItem('isReactNative', true);
        setContext('isReactNative', true);
        // Ask RN if Biometric is supported
        // TODO remove?
        sendMessageToReactNative({
          action: BIOMETRIC_SUPPORT_KEY,
          data: BIOMETRIC_SUPPORT_KEY,
        });
      }
      setIsLoading(false);
    } else {
      const isStorageEncryptedValue: boolean | null = await LocalForage.getItem(
        'isStorageEncrypted'
      );

      // @ts-ignore
      await changeStorageEncryptedStatus(isStorageEncryptedValue);

      const isReactNativeLocalValue: boolean | null = await LocalForage.getItem(
        'isReactNative'
      );
      const encryptionTypeLocalValue: string | null = await LocalForage.getItem(
        'encryptionType'
      );

      // Init state
      setIsLoading(false);

      if (isReactNativeLocalValue) {
        setContext('isReactNative', true);
      }

      // Handle Encrypted by React Native wrapper
      if (
        isStorageEncryptedValue &&
        isReactNativeLocalValue &&
        encryptionTypeLocalValue === 'Biometric'
      ) {
        // Ask RN for password
        sendMessageToReactNative({
          action: GET_DECRYPT_PASSWORD_ACTION,
          data: GET_DECRYPT_PASSWORD_ACTION,
        });
      }

      // Handle Pin encryption from web app
      if (isStorageEncryptedValue && encryptionTypeLocalValue === 'PIN') {
        setEncryptionType('PIN');
      }
    }
  };

  /**
   * Encrypt with password saved in React Native keychain
   * @param password
   */
  const encryptStorage = async (password: string) => {
    await LocalForage.setItem('encryptionType', 'Biometric');
    await LocalForage.setItem('isStorageEncrypted', true);

    const storage: any = await LocalForage.getItem('root');

    const pgpKeys: PgpKeys = await OpenPgp.generateKeys('username', password);

    await LocalForage.setItem('systemKeys', pgpKeys);

    // Encrypt storage
    const encrypted: any = await OpenPgp.encrypt(pgpKeys.publicKey, storage);

    await LocalForage.setItem('root', encrypted);

    window.location.assign('/');
  };

  /**
   * Prepare app for encryption with React Native Wrapper
   */
  const prepareEncryptStorage = async () => {
    await changeStorageEncryptedStatus(false);

    sendMessageToReactNative({
      action: CREATE_BIOMETRIC_ENCRYPTION_ACTION,
      data: v4(),
    });
  };

  /**
   * Decrypt storage
   * @param password
   */
  const decryptStorage = async (password: string) => {
    try {
      const systemKeys: any = await LocalForage.getItem('systemKeys');
      const { publicKey, privateKey } = systemKeys;

      const stateEncrypted: any = await LocalForage.getItem('root');

      const decryptedState = await OpenPgp.decrypt(
        publicKey,
        privateKey,
        password,
        stateEncrypted
      );

      if (decryptedState) {
        await handlePinUnlock(true);
        setState(decryptedState);
      }
    } catch (error) {
      await handlePinUnlock(false);
      logger(error);
    }
  };

  const handlePinUnlock = async (success: boolean) => {
    const isPinPassword: boolean = encryptionType === 'PIN';

    if (!isPinPassword) {
      return;
    }

    if (success) {
      // Reset counter
      await LocalForage.setItem('pinCodeAttempts', MAX_PIN_UNLOCK_ATTEMPTS);
    } else {
      const pinCodeAttempts: number | null = await LocalForage.getItem(
        'pinCodeAttempts'
      );

      if (pinCodeAttempts) {
        if (pinCodeAttempts === 1) {
          // Log out user and clear database
          await logOut();
        } else {
          setContext('showSnackbar', {
            text: `Wrong PIN. ${pinCodeAttempts - 1} remaining attempts.`,
          });

          await LocalForage.setItem('pinCodeAttempts', pinCodeAttempts - 1);

          return false;
        }
      }
    }
  };

  /**
   * Set listener for React Native Wrapper
   */
  useEffect(() => {
    initEncryptionStatus();
    /**
     * Different handlers for RN messages
     */
    document.addEventListener('message', (event) => {
      // @ts-ignore
      const messageObj: any = JSON.parse(event.data);
      const { action, data } = messageObj;

      if (action === BIOMETRIC_SUPPORT_KEY) {
        LocalForage.setItem(BIOMETRIC_SUPPORT_KEY, true);
      }

      if (action === PREPARE_ENCRYPT_STORAGE_ACTION) {
        prepareEncryptStorage();
      }

      if (action === ENCRYPT_STORAGE_ACTION) {
        encryptStorage(data);
      }

      if (action === DECRYPT_STORAGE_ACTION) {
        decryptStorage(data);
      }
    });
  }, []);

  // Handle different statuses
  // @ts-ignore
  const isAuthorized: boolean =
    (!isLoading && !isStorageEncrypted) ||
    (!isLoading && isStorageEncrypted && state);

  // @ts-ignore
  const isPinProtected: boolean =
    isStorageEncrypted && encryptionType === 'PIN' && !state;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isAuthorized ? (
        <BrowserLayer isDecrypted={isAuthorized} state={state} />
      ) : isPinProtected ? (
        <GetPin decryptStorage={decryptStorage} />
      ) : null}

      <Snackbar />
      {isLoading ? <LoadingScreen /> : null}
    </div>
  );
};

export default EncryptionLayer;
