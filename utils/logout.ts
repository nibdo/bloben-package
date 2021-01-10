import Axios from 'bloben-common/utils/axios';
import { Dispatch } from 'redux';
import { LocalForage } from './LocalForage';
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
  await LocalForage.removeItem('isReactNative');
  await LocalForage.removeItem('pinCodeAttempts');
  await LocalForage.removeItem('systemKeys');
  await LocalForage.removeItem('isDark');

  if (dispatch) {
    dispatch({type: 'USER_LOGOUT'});
  }

  Axios.get('/user/logout');
  // @ts-ignore
  setTimeout(() => {window.location.assign(process.env.REACT_APP_URL)}, 10)
};
