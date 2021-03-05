import React, { useContext, useReducer, useState } from 'react';

import StateReducer from 'bloben-package/utils/state-reducer';
import Utils from './SetPin.utils';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAppStarting, setIsLoading } from '../../../redux/actions';
import MobileTitle from '../../components/title/Title';
import { LocalForage } from '../../utils/LocalForage';
import OpenPgp, { PgpKeys } from '../../../bloben-utils/utils/OpenPgp';
import PinInput, {
  MAX_PIN_UNLOCK_ATTEMPTS,
  PIN_CODE_LENGTH,
} from '../../components/pinInput/PinInput';
import { useHistory } from 'react-router-dom';
import InputForm from 'bloben-components/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import NumericKeyboard from '../../components/numericKeyboard/NumericKeyboard';
import { Context } from '../../context/store';
import HeaderModal from '../../components/headerModal/HeaderModal';

interface IPinInputDesktopProps {
  handleClick: any;
  handleDesktopOnChange: any;
  pinCode: string;
  repeatedPinCode: string;
}
const PinInputDesktop = (props: IPinInputDesktopProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <div
      style={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <InputForm
        name={'pinCode'}
        isPassword={true}
        label={'PIN code'}
        value={props.pinCode}
        onChange={props.handleDesktopOnChange}
        maxLength={PIN_CODE_LENGTH}
        isDark={isDark}
      />
      <Landing.Separator />
      <InputForm
        name={'repeatedPinCode'}
        isPassword={true}
        label={'Repeat PIN code'}
        value={props.repeatedPinCode}
        onChange={props.handleDesktopOnChange}
        maxLength={PIN_CODE_LENGTH}
        isDark={isDark}
      />
      <Landing.Separator />
      <Landing.ButtonPrimary title={'Confirm'} onClick={props.handleClick} />
    </div>
  );
};

interface IInputContainerProps {
  value: string;
  pinCode: string;
  repeatedPinCode: string;
  onChange: any;
  handleClick: any;
  handlePop: any;
  handleDesktopOnChange: any;
}
const InputContainer = (props: IInputContainerProps) => {
  const {
    value,
    pinCode,
    repeatedPinCode,
    onChange,
    handleDesktopOnChange,
    handleClick,
    handlePop,
  } = props;

  const [store] = useContext(Context);
  const { isMobile } = store;

  return isMobile ? (
    <div className={'settings__container-input'}>
      <PinInput value={value} />
      <NumericKeyboard handleClick={onChange} handlePop={handlePop} />
    </div>
  ) : (
    <PinInputDesktop
      pinCode={pinCode}
      repeatedPinCode={repeatedPinCode}
      handleDesktopOnChange={handleDesktopOnChange}
      handleClick={handleClick}
    />
  );
};

interface ISetPinViewProps {
  pinCode: string;
  repeatedPinCode: string;
  onChange: any;
  handleClick: any;
  handlePop: any;
  handleDesktopOnChange: any;
  title: string;
}
const SetPinView = (props: ISetPinViewProps) => {
  const {
    pinCode,
    repeatedPinCode,
    onChange,
    title,
    handleDesktopOnChange,
    handleClick,
    handlePop,
  } = props;

  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  return (
    <div className={`column${isDark ? '-dark' : ''}`}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={isMobile ? title : 'Set PIN'} forceDesktop={true} />
        <InputContainer
          pinCode={pinCode}
          value={pinCode.length === PIN_CODE_LENGTH ? repeatedPinCode : pinCode}
          repeatedPinCode={repeatedPinCode}
          onChange={onChange}
          handleDesktopOnChange={handleDesktopOnChange}
          handleClick={handleClick}
          handlePop={handlePop}
        />
      </div>
    </div>
  );
};

const SetPin = () => {
  const [state, dispatchState] = useReducer(StateReducer, Utils.state);

  const { pinCode, repeatedPinCode, warningPinCode }: any = state;
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const history: any = useHistory();

  const dispatch: any = useDispatch();

  const [title, setTitle] = useState('Set PIN');

  const handleDesktopOnChange = (e: any) => {
    const value: any = e.target.value;
    if (!isNaN(value)) {
      setLocalState(e.target.name, value);
    }
  };

  const handlePop = () => {
    if (pinCode.length < PIN_CODE_LENGTH && pinCode.length > 0) {
      setLocalState('pinCode', pinCode.slice(0, pinCode.length - 1));

      return;
    }

    if (pinCode.length === PIN_CODE_LENGTH && repeatedPinCode.length > 0) {
      setLocalState(
        'repeatedPinCode',
        repeatedPinCode.slice(0, repeatedPinCode.length - 1)
      );

      return;
    }
  };

  const handleClick = () => {
    if (
      pinCode.length === PIN_CODE_LENGTH &&
      repeatedPinCode.length === PIN_CODE_LENGTH
    ) {
      if (pinCode === repeatedPinCode) {
        encryptWithPinCode();
      }
    }
  };

  const onChange = async (number: any): Promise<void> => {
    if (!isNaN(number) && pinCode.length < PIN_CODE_LENGTH) {
      const stringNumber: string = pinCode + String(number);

      setLocalState('pinCode', stringNumber);
      if (pinCode.length + 1 === PIN_CODE_LENGTH) {
        setTitle('Confirm PIN');
      }
    } else {
      // Pin Code set, save values to repeated pin code now
      setTitle('Confirm PIN');
      if (!isNaN(number) && repeatedPinCode.length < PIN_CODE_LENGTH) {
        const stringNumberRepeated: string = repeatedPinCode + String(number);

        setLocalState('repeatedPinCode', stringNumberRepeated);

        if (
          pinCode.length === PIN_CODE_LENGTH &&
          repeatedPinCode.length + 1 === PIN_CODE_LENGTH
        ) {
          if (pinCode === stringNumberRepeated) {
            encryptWithPinCode();
          } else {
            setTitle('Set PIN');
            setLocalState('pinCode', '');
            setLocalState('repeatedPinCode', '');
          }
        }
      }
    }
  };

  const encryptWithPinCode = async () => {
    dispatch(setIsLoading(true));

    await LocalForage.setItem('encryptionType', 'PIN');
    await LocalForage.setItem('isStorageEncrypted', true);
    await LocalForage.setItem('pinCodeAttempts', MAX_PIN_UNLOCK_ATTEMPTS);

    const pgpKeys: PgpKeys = await OpenPgp.generateKeys('username', pinCode);

    // Have to store private key in browser's database, but PIN code to decrypt should be
    // enough protection for what it is
    await LocalForage.setItem('systemKeys', pgpKeys);
    //
    // // Encrypt storage
    // const encrypted: any = await OpenPgp.encrypt(pgpKeys.publicKey, store);
    //
    // await LocalForage.setItem('root', encrypted)

    dispatch(setIsAppStarting(true));
    dispatch(setIsAppStarting(false));
    history.push('/settings/security');
  };

  return (
    <SetPinView
      pinCode={pinCode}
      repeatedPinCode={repeatedPinCode}
      onChange={onChange}
      title={title}
      handleClick={handleClick}
      handleDesktopOnChange={handleDesktopOnChange}
      handlePop={handlePop}
    />
  );
};

export default SetPin;
