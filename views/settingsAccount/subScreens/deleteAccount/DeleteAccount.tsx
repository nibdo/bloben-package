import React, { useContext, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

import InputForm from 'bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import Utils from './DeleteAccount.utils';
import AccountApi from 'bloben-package/api/account.api';
import errors from 'bloben-common/globals/errors';
import {
  TSrpChallengeType,
  TSrpCredentialsForAuthType,
  TSrpCredentialsType
} from 'bloben-package/types/srp.types';
import {
 setIsAppStarting,
} from '../../../../../redux/actions';
import { HTTP_STATUS_BAD_REQUEST } from 'bloben-package/utils/common';
import { logger, parseCssDark } from 'bloben-common/utils/common';
import { logOut } from '../../../../utils/logout';
import MobileTitle from '../../../../components/title/Title';
import StateReducer from '../../../../utils/state-reducer';
import HeaderModal from '../../../../components/headerModal/HeaderModal';
import { Context } from '../../../../context/store';
const {  WRONG_PASSWORD } = errors;

const rfc5054: any = {
  N_base10: "21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819",
  g_base10: "2",
  k_base16: "5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300"
}
// tslint:disable-next-line:no-require-imports max-line-length no-var-requires
const srpClient: any = require('thinbus-srp/client.js')(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);

interface IInputContainerProps {
  password: string;
  warningPassword?: string;
  verifyAccount: any;
  onChange: any;
}

const InputContainer = (props: IInputContainerProps) => {
  const {
    password,
    warningPassword,
    verifyAccount,
    onChange,
  } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  return (
      <div className={'settings__container-input'}>
      <InputForm
            label={'Confirm password'}
            name={'password'}
            value={password}
            onChange={onChange}
            isDark={isDark}
            autoFocus={false}
            isPassword={true}
            autoComplete={'off'}
            error={warningPassword}
        />
        <Landing.Separator/>
        <Landing.Separator/>
        <Landing.ButtonPrimary title={'Delete'} onClick={verifyAccount} isDark={true}/>
      </div>
  );
};

interface IDeleteAccountView {
  password: string;
  warningPassword?: string;
  verifyAccount: any;
  onChange: any;
}

const DeleteAccountView = (props: IDeleteAccountView) => {
  const {
    password,
    warningPassword,
    verifyAccount,
    onChange,
  } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  return (
      <div className={parseCssDark('column', isDark)}>
        <HeaderModal />
        <div className={'settings__container'}>
          <MobileTitle title={'Delete account'} />
          <InputContainer
                    password={password}
                    warningPassword={warningPassword}
                    verifyAccount={verifyAccount}
                    onChange={onChange}
                />
        </div>
      </div>
  )
};

const DeleteAccount = () => {
  const [deleteAccountState, dispatchState] = useReducer(StateReducer, Utils.state);
  const {
    password,
    warningPassword,
  }: any = deleteAccountState;

  const username: string = useSelector((state: any) => state.username);

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
    dispatch(setIsAppStarting(false))

    const { code, message } = data;
    if (code === WRONG_PASSWORD) {
      setLocalState('warningPassword', message);
    } else {
      // TODO SNACKBAR ERROR
    }
  };

  const resetWarnings = (): void => {
    setLocalState('warningPassword', '');
  };

  const verifyAccount = async () => {
    dispatch(setIsAppStarting(true))

    // Should return dummy encryption data after login
    resetWarnings();

    try {
      // Get salt and b challenge from server
      const serverUserSrpResponse: AxiosResponse = await AccountApi.getChallenge(username);

      if (serverUserSrpResponse.status === HTTP_STATUS_BAD_REQUEST) {
        handleError(serverUserSrpResponse.data);

        return;
      }

      const {salt, b} = serverUserSrpResponse.data as TSrpChallengeType;

      // Create SRP client
      const client: any = new srpClient();

      // Use password
      client.step1(username, password);

      // Create credentials
      const credentials: TSrpCredentialsType = client.step2(salt, b);

      const credentialsForAuth: TSrpCredentialsForAuthType = {...credentials, ...{username}}

      // Send credentials to authenticate on server
      const response: AxiosResponse = await AccountApi.delete(credentialsForAuth);

      if (response.status === HTTP_STATUS_BAD_REQUEST) {
        handleError(response.data);

        return;
      }

      await logOut(dispatch)

      dispatch(setIsAppStarting(false))

    } catch (err) {
      logger(err.toString())
    }
  };

  return (
      <DeleteAccountView
          password={password}
          warningPassword={warningPassword}
          verifyAccount={verifyAccount}
          onChange={onChange}
      />
  );
};

export default DeleteAccount;
