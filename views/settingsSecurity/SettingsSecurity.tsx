import React, { useContext, useEffect, useState } from 'react';
import './SettingsSecurity.scss';
import MobileTitle from '../../components/title/Title';
import SettingsItem from '../../components/settingsItem/SettingsItem';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../../components/dropdown/Dropdown';
import {
  BIOMETRIC_SUPPORT_KEY,
  PREPARE_ENCRYPT_STORAGE_ACTION,
} from '../../utils/common';
import { useHistory } from 'react-router';
import SetPin from '../setPin/SetPin';
import { LocalForage } from '../../utils/LocalForage';
import { setIsAppStarting } from '../../../redux/actions';
import Modal from '../../components/modal/Modal';
import HeaderModal from '../../components/headerModal/HeaderModal';
import { Context } from '../../context/store';

const SettingsSecurityRouter = (props: any) => (
  <div>
    <Route path={'/settings/security/pin'}>
      <Modal {...props}>
        <SetPin />
      </Modal>
    </Route>
  </div>
);

interface ISettingsSecurityViewProps {
  openLockDropdown: any;
  setLockDropdown: any;
  lockStatus: any;
  lockDropdownValues: any;
  lockDropdown: any;
  handleLockDropdownChange: any;
}
const SettingsSecurityView = (props: ISettingsSecurityViewProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const {
    openLockDropdown,
    setLockDropdown,
    lockStatus,
    lockDropdownValues,
    lockDropdown,
    handleLockDropdownChange,
  } = props;

  return (
    <div className={`column${isDark ? '-dark' : ''}`}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Security'} />
        <SettingsItem
          icon={
            <EvaIcons.Lock
              className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
            />
          }
          title={'Encryption'}
          description={lockStatus}
          onClick={openLockDropdown}
        />
        <Dropdown
            isOpen={lockDropdown}
            handleClose={() => setLockDropdown('')}
            selectedValue={lockStatus}
            values={lockDropdownValues}
            onClick={handleLockDropdownChange}
        />
      </div>

      <SettingsSecurityRouter />
    </div>
  );
};

const SettingsSecurity = () => {
  const [lockStatus, setLockStatus]: any = useState('None');
  const [lockDropdown, setLockDropdown]: any = useState('');
  const [lockDropdownValues, setLockDropdownValues] = useState(['PIN', 'None']);

  const dispatch: any = useDispatch();
  const history: any = useHistory();
  const isAppStarting: boolean = useSelector(
    (state: any) => state.isAppStarting
  );

  const openLockDropdown = (e: any) => {
    const nativeEvent: any = e.nativeEvent;
    const { clientX, clientY } = nativeEvent;
    setLockDropdown({ clientX, clientY });
  };

  const handleLockDropdownChange =  (value: string) => {
    if (value === 'Biometric') {
      // TODO ADD better password
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: PREPARE_ENCRYPT_STORAGE_ACTION,
          data: PREPARE_ENCRYPT_STORAGE_ACTION,
        })
      );
    } else if (value === 'PIN') {
      history.push('/settings/security/pin');
    } else if (value === 'None') {
      handleDisableEncryption();
    }

    setLockDropdown('');
  };

  const handleDisableEncryption = async () => {
    const isEncrypted: boolean | null = await LocalForage.getItem(
      'isStorageEncrypted'
    );

    if (isEncrypted) {
      await LocalForage.removeItem('systemKeys');
      await LocalForage.removeItem('encryptionType');
      await LocalForage.removeItem('pinCodeAttempts');
      await LocalForage.setItem('isStorageEncrypted', false);

      setLockStatus('None');
      dispatch(setIsAppStarting(true));
      dispatch(setIsAppStarting(false));
      history.push('/settings/security');
    }
  };

  const checkBiometricSupport = async () => {
    const isBiometricSupported: true | null = await LocalForage.getItem(
      BIOMETRIC_SUPPORT_KEY
    );

    if (isBiometricSupported) {
      setLockDropdownValues([...lockDropdownValues, 'Biometric']);
    }
  };

  const changeLockStatus = async () => {
    const currentStatus: string | null = await LocalForage.getItem(
      'encryptionType'
    );

    if (currentStatus) {
      setLockStatus(currentStatus);
    }
  };

  // Check if biometrics are supported
  useEffect(() => {
    changeLockStatus();
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    changeLockStatus();
  }, [isAppStarting]);

  return (
    <SettingsSecurityView
      handleLockDropdownChange={handleLockDropdownChange}
      openLockDropdown={openLockDropdown}
      lockDropdown={lockDropdown}
      setLockDropdown={setLockDropdown}
      lockStatus={lockStatus}
      lockDropdownValues={lockDropdownValues}
    />
  );
};

export default SettingsSecurity;
