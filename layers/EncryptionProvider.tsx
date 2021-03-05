import React, { useContext, useEffect, useState } from 'react';

import BrowserProvider from './BrowserProvider';
import GetPin from '../views/getPin/GetPin';
import { logger } from 'bloben-common/utils/common';
import { LocalForage } from '../utils/LocalForage';
import OpenPgp from '../../bloben-utils/utils/OpenPgp';
import { MAX_PIN_UNLOCK_ATTEMPTS } from '../components/pinInput/PinInput';
import { logOut } from '../utils/logout';
import { Context } from '../context/store';
import Snackbar from '../components/snackbar/Snackbar';
import LoadingScreen from '../../bloben-common/components/loadingScreen/LoadingScreen';

const EncryptionProvider = () => {
  const [store, dispatch] = useContext(Context);
  const { isDark } = store;

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

      setIsLoading(false);
    } else {
      const isStorageEncryptedValue: boolean | null = await LocalForage.getItem(
        'isStorageEncrypted'
      );

      // @ts-ignore
      await changeStorageEncryptedStatus(isStorageEncryptedValue);

      const encryptionTypeLocalValue: string | null = await LocalForage.getItem(
        'encryptionType'
      );

      // Init state
      setIsLoading(false);

      // Handle Pin encryption from web app
      if (isStorageEncryptedValue && encryptionTypeLocalValue === 'PIN') {
        setEncryptionType('PIN');
      }
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

  /**
   * Set listener for React Native Wrapper
   */
  useEffect(() => {
    initEncryptionStatus();
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
        <BrowserProvider isDecrypted={isAuthorized} state={state} />
      ) : isPinProtected ? (
        <GetPin decryptStorage={decryptStorage} />
      ) : null}
      <Snackbar />
      {isLoading ? <LoadingScreen isDark={isDark} /> : null}
    </div>
  );
};

export default EncryptionProvider;
