import React, { useContext, useReducer } from 'react';
import Utils from './ChangePassword.utils';
import MobileTitle from '../../components/title/Title';
import StateReducer from '../../utils/state-reducer';
import InputForm from '../../../bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import { Context } from '../../context/store';
import HeaderModal from '../../components/headerModal/HeaderModal';

interface IInputContainerProps {
  currentPassword: string;
  password: string;
  repeatedPassword: string;
  warningPassword?: string;
  onChange: any;
}
const InputContainer = (props: IInputContainerProps) => {
  const {
    currentPassword,
    password,
    repeatedPassword,
    warningPassword,
    onChange,
  } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <div className={'settings__container-input'}>
      <InputForm
        label={'Current password'}
        name={'currentPassword'}
        value={currentPassword}
        onChange={onChange}
        autoFocus={false}
        isPassword={true}
        isDark={isDark}
        autoComplete={'off'}
        error={''}
      />
      <Landing.Separator />
      <InputForm
        label={'New password'}
        name={'password'}
        value={password}
        onChange={onChange}
        isDark={isDark}
        autoFocus={false}
        isPassword={true}
        autoComplete={'off'}
        error={''}
      />
      <Landing.Separator />

      <InputForm
        label={'Repeat password'}
        name={'repeatedPassword'}
        value={repeatedPassword}
        onChange={onChange}
        autoFocus={false}
        isPassword={true}
        autoComplete={'off'}
        error={warningPassword}
        isDark={isDark}

      />
    </div>
  );
};

interface IChangePasswordViewProps {
  currentPassword: string;
  password: string;
  repeatedPassword: string;
  onChange: any;
  validateAccount: any;
}
const ChangePasswordView = (props: IChangePasswordViewProps) => {
  const {
    currentPassword,
    password,
    repeatedPassword,
    onChange,
    validateAccount,
  } = props;

  return (
    <div className={'column'}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Account'} />
        <InputContainer
          currentPassword={currentPassword}
          password={password}
          repeatedPassword={repeatedPassword}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [changePasswordState, dispatchState]: any = useReducer(
    StateReducer,
    Utils.state
  );

  const { currentPassword, password, repeatedPassword } = changePasswordState;

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setLocalState(name, value);
  };

  // TODO
  const validateAccount = () => {
    return;
  };

  return (
    <ChangePasswordView
      currentPassword={currentPassword}
      password={password}
      repeatedPassword={repeatedPassword}
      onChange={onChange}
      validateAccount={validateAccount}
    />
  );
};

export default ChangePassword;
