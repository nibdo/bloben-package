import { Dispatch } from 'redux';

import { LocalForage } from './LocalForage';
import AccountApi from '../../bloben-utils/api/account.api';
// tslint:disable-next-line:no-require-imports no-var-requires
const openpgp = require('openpgp');

export const logOut = async (dispatch?: Dispatch) => {
  await openpgp.destroyWorker();

  // Clear all localstorage keys
  await LocalForage.removeItem('wasInit');
  await LocalForage.removeItem('encryptedRoot');
  await LocalForage.removeItem('isStorageEncrypted');
  await LocalForage.removeItem('root');
  await LocalForage.removeItem('encryptionType');
  await LocalForage.removeItem('pinCodeAttempts');
  await LocalForage.removeItem('systemKeys');
  await LocalForage.removeItem('isDark');

  await LocalForage.clear();

  if (dispatch) {
    dispatch({ type: 'USER_LOGOUT' });
  }

  await AccountApi.logout();
};
