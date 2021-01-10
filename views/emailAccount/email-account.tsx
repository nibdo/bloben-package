import React, { useEffect, useReducer } from 'react';
import './email-account.scss';

import Utils from './email-account.utils';
import MobileTitle from '../../components/title/Title';
import EvaIcons from 'bloben-common/components/eva-icons';
import { useSelector } from 'react-redux';
import StateReducer from '../../utils/state-reducer';
import Landing from 'bloben-common/components/landing/Landing';
import InputForm from '../../../bloben-common/components/inputForm/InputForm';
import HeaderModal from '../../components/headerModal/HeaderModal';

const EmailStatus = (props: any) => {
  const { emailFromServer, isVerified, isDark, deleteEmail } = props;

  return (
    <div className={'email-account__container'}>
      <div className={'email-account__row'}>
        <p className={`email-account__text${isDark ? '-dark' : ''}`}>
          {emailFromServer}
        </p>
        {isVerified ? (
          <EvaIcons.Check className={'email-account__icon-success'} />
        ) : (
          <EvaIcons.Info className={'email-account__icon-warn'} />
        )}
      </div>
      <Landing.Separator />
      <Landing.Separator />

      <Landing.ButtonPrimary title={'Delete email'} onClick={deleteEmail} />
    </div>
  );
};

const EmailInput = (props: any) => {
  const { email, onChange, saveEmailAddress } = props;
  const isDark: boolean = useSelector((state: any) => state.isDark);

  return (
    <div className={'settings__container-input'}>
      <InputForm
        label={'Email'}
        name={'email'}
        value={email}
        isDark={isDark}
        onChange={onChange}
        autoFocus={false}
        isPassword={false}
        autoComplete={'off'}
        error={''}
      />
      <Landing.Separator />

      <Landing.ButtonPrimary title={'Confirm'} onClick={saveEmailAddress} />
    </div>
  );
};

const EmailAccountView = (props: any) => {
  const {
    email,
    onChange,
    isLoading,
    saveEmailAddress,
    emailFromServer,
    isVerified,
    isDark,
    deleteEmail,
  } = props;

  return (
    <div className={'column'}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Email'} />
        {emailFromServer ? (
          <EmailStatus
            emailFromServer={emailFromServer}
            isVerified={isVerified}
            isDark={isDark}
            deleteEmail={deleteEmail}
          />
        ) : (
          <EmailInput
            email={email}
            isLoading={isLoading}
            onChange={onChange}
            saveEmailAddress={saveEmailAddress}
          />
        )}
      </div>
    </div>
  );
};

const EmailAccount = (props: any) => {
  const [state, dispatchState]: any = useReducer(StateReducer, Utils.state);
  const isDark: boolean = useSelector((state: any) => state.isDark);
  const username: string = useSelector((state: any) => state.username);

  const { email, emailWarning, emailFromServer, isVerified } = state;

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };
  const resetWarnings = (): void => {
    setLocalState('emailWarning', '');
  };
  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setLocalState(name, value);
  };

  const saveEmailAddress = async (): Promise<void> => {
    const data = {
      email,
    };

    setLocalState('isLoading', false);
    setLocalState('emailFromServer', email);
    setLocalState('isVerified', false);
  };

  const deleteEmail = async (): Promise<void> => {

    await getEmailStatus();
  };

  const getEmailStatus = async (): Promise<void> => {
    // Get email status from server
    let result: any;
    if (!result.data.data) {
      setLocalState('emailFromServer', '');
      setLocalState('isVerified', false);
    }

    if (result.data.data.email) {
      // tslint:disable-next-line:no-shadowed-variable
      const { email, isVerified } = result.data.data;
      setLocalState('emailFromServer', email);
      setLocalState('isVerified', isVerified);
    }
  };



  useEffect(() => {
    // Check email status on page load
    getEmailStatus();
    // getSteam();
  }, []);

  return (
    <EmailAccountView
      username={username}
      email={email}
      emailWarning={emailWarning}
      onChange={onChange}
      saveEmailAddress={saveEmailAddress}
      emailFromServer={emailFromServer}
      isVerified={isVerified}
      isDark={isDark}
      deleteEmail={deleteEmail}
    />
  );
};

export default EmailAccount;
