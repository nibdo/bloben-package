import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

import InputForm from 'bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import AccountApi from 'bloben-package/api/account.api';
import {
  TSrpChallengeType,
  TSrpCredentialsForAuthType,
  TSrpCredentialsType,
} from 'bloben-package/types/srp.types';
import { setIsAppStarting } from '../../../../redux/actions';
import { HTTP_STATUS_BAD_REQUEST } from 'bloben-package/utils/common';
import { logger, parseCssDark } from 'bloben-common/utils/common';
import { logOut } from '../../../utils/logout';
import MobileTitle from '../../title/Title';
import StateReducer from '../../../utils/state-reducer';
import HeaderModal from '../../headerModal/HeaderModal';
import { Context } from '../../../context/store';
import EmailApi, { IGetEmailDTO } from '../../../api/email.api';

interface IInputContainerProps {
  onChange: any;
  emailStatus: IGetEmailDTO;
}

const InputContainer = (props: IInputContainerProps) => {
  const { onChange, emailStatus } = props;

  const [store] = useContext(Context);

  const { isDark } = store;

  const { email, isVerified } = emailStatus;

  return (
    <div className={'settings__container-input'}>
      <InputForm
        label={'Confirm password'}
        name={'password'}
        value={''}
        onChange={onChange}
        isDark={isDark}
        autoFocus={false}
        isPassword={true}
        autoComplete={'off'}
      />
      <Landing.Separator />
      <Landing.Separator />
      <Landing.ButtonPrimary
        title={'Delete'}
        onClick={onChange}
        isDark={true}
      />
    </div>
  );
};

interface IDeleteAccountView {
  onChange: any;
  emailStatus: IGetEmailDTO;
}

const SetEmailView = (props: IDeleteAccountView) => {
  const { onChange, emailStatus } = props;

  const [store] = useContext(Context);

  const { isDark } = store;

  return (
    <div className={parseCssDark('column', isDark)}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Email'} />
        <InputContainer onChange={onChange} emailStatus={emailStatus} />
      </div>
    </div>
  );
};

const initialState: IGetEmailDTO = { email: null, isVerified: null };

const SetEmail = () => {
  const [emailStatus, setEmailStatus] = useState(initialState);

  const dispatch: Dispatch = useDispatch();

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ deleteAccountState, payload });
  };

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setLocalState(name, value);
  };

  const handleError = (data: any): void => {
    dispatch(setIsAppStarting(false));

    const { code, message } = data;
  };

  const getEmailStatus = async (): Promise<void> => {
    const resp: AxiosResponse = await EmailApi.getEmail();

    console.log(resp);

    if (resp.data) {
      setEmailStatus(resp.data);
    }
  };

  // Load email status
  useEffect(() => {
    getEmailStatus()
  }, []);

  return <SetEmailView emailStatus={emailStatus} onChange={onChange} />;
};

export default SetEmail;
