import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

import InputForm from 'bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';

import { setIsAppStarting } from '../../../../../redux/actions';
import { logger, parseCssDark } from 'bloben-common/utils/common';
import MobileTitle from '../../../../components/title/Title';
import HeaderModal from '../../../../components/headerModal/HeaderModal';
import { Context } from '../../../../context/store';
import EmailApi, { IGetEmailDTO } from '../../../../api/email.api';
import EvaIcons from '../../../../../bloben-common/components/eva-icons';
import { STATUS_OK } from '../../../../utils/common';
import { IUserProfile } from '../../../../types/common.types';
import AccountApi from '../../../../api/account.api';

interface IInputContainerProps {
  emailInput: string;
  onChange: any;
  setEmail: any;
  deleteEmail: any;
}

const InputContainer = (props: IInputContainerProps) => {
  const { onChange, emailInput, setEmail, deleteEmail } = props;

  const userProfile: IUserProfile = useSelector(
      (state: any) => state.userProfile
  );
  const { email, emailIsVerified } = userProfile;

  const [store] = useContext(Context);

  const { isDark } = store;


  return (
    <div className={'settings__container-input'}>
      {userProfile.email ? (
        <InputForm
          label={'Email address'}
          name={'email'}
          defaultValue={email as string}
          value={email as string}
          onChange={onChange}
          isDark={isDark}
          icon={
            emailIsVerified ? (
              <EvaIcons.Check
                className={parseCssDark('icon-svg' + ' icon-green', isDark)}
              />
            ) : null
          }
          autoFocus={false}
          isPassword={false}
          autoComplete={'off'}
        />
      ) : (
        <InputForm
          label={'Email address'}
          name={'email'}
          value={emailInput}
          onChange={onChange}
          isDark={isDark}
          autoFocus={false}
          isPassword={false}
          autoComplete={'off'}
        />
      )}
      <Landing.Separator />
      <Landing.Separator />
      {!email ? (
        <Landing.ButtonPrimary
          title={'Confirm'}
          onClick={setEmail}
          isDark={true}
        />
      ) : null}

      {email ? (
        <Landing.ButtonPrimary
          title={'Delete email'}
          onClick={deleteEmail}
          isDark={true}
        />
      ) : null}
    </div>
  );
};

interface IDeleteAccountView {
  emailInput: string;
  onChange: any;
  setEmail: any;
  deleteEmail: any;
}

const SetEmailView = (props: IDeleteAccountView) => {
  const { onChange, emailInput, setEmail, deleteEmail } = props;

  const [store] = useContext(Context);

  const { isDark } = store;

  return (
    <div className={parseCssDark('column', isDark)}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Email'} />
        <InputContainer
          onChange={onChange}
          emailInput={emailInput}
          setEmail={setEmail}
          deleteEmail={deleteEmail}
        />
      </div>
    </div>
  );
};

const initialState: IGetEmailDTO = { email: null, isVerified: null };

const SetEmail = () => {
  const [emailStatus, setEmailStatus] = useState(initialState);
  const [emailInput, setEmailInput] = useState('');
  const [store, dispatchContext] = useContext(Context);

  const dispatch: Dispatch = useDispatch();

  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ deleteAccountState, payload });
  };

  // TODO email validator

  const onChange = (e: any): void => {
    const value = e.target.value;
    setEmailInput(value);
  };

  const handleError = (data: any): void => {
    dispatch(setIsAppStarting(false));

    const { code, message } = data;
  };

  const getEmailStatus = async (): Promise<void> => {
    const resp: AxiosResponse = await EmailApi.getEmail();

    if (resp.data) {
      setEmailStatus(resp.data);
    }
  };

  const deleteEmail = async () => {
    try {
      const resp: AxiosResponse = await AccountApi.updateProfile({key: 'email', value: null});

      if (resp.data.code === 1000) {
        setContext('showSnackbar', {
          text: 'Your email was deleted',
        });

        // await getEmailStatus();
        setEmailInput('')
      }
    } catch (error) {
      setContext('showSnackbar', {
        text: 'Error: Try again',
      });
    }
  };

  const setEmail = async () => {
    const resp: AxiosResponse = await AccountApi.updateProfile({key: 'email', value: emailInput});

    setContext('showSnackbar', {
      text: 'Check your mailbox for verification email',
    });
  };
  //
  // // Load email status
  // useEffect(() => {
  //   getEmailStatus();
  // }, []);

  return (
    <SetEmailView
      onChange={onChange}
      emailInput={emailInput}
      setEmail={setEmail}
      deleteEmail={deleteEmail}
    />
  );
};

export default SetEmail;
