import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

import InputForm from 'bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import Utils from './LoginAccount.utils';
import AccountApi from 'bloben-package/api/account.api';
import errors from 'bloben-common/globals/errors';
import {
  TSrpChallengeType,
  TSrpCredentialsForAuthType,
  TSrpCredentialsType,
} from '../../../types/srp.types';
import Crypto from '../../../utils/encryption';
import {
  setCryptoPassword,
  setIsAppStarting,
  setIsLogged,
  setPassword,
  setPgpKeys,
  setUsername,
} from '../../../../redux/actions';
import { HTTP_STATUS_BAD_REQUEST } from '../../../utils/common';
import { logger } from 'bloben-common/utils/common';
import StateReducer from '../../../utils/state-reducer';
const { USER_NOT_FOUND, WRONG_PASSWORD } = errors;

const rfc5054: any = {
  N_base10:
    '21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819',
  g_base10: '2',
  k_base16: '5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300',
};
// tslint:disable-next-line:no-require-imports no-var-requires
const srpClient: any = require('thinbus-srp/client.js')(
  rfc5054.N_base10,
  rfc5054.g_base10,
  rfc5054.k_base16
);

interface IInputContainerProps {
  username: string;
  password: string;
  warningUsername?: string;
  warningPassword?: string;
  verifyAccount: any;
  onChange: any;
  redirectToRegister: any;
}
const InputContainer = (props: IInputContainerProps) => {
  const {
    username,
    password,
    warningUsername,
    warningPassword,
    verifyAccount,
    onChange,
    redirectToRegister
  } = props;

  const isDark: any = useSelector((state: any) => state.isDark);

  return (
    <Landing.ContainerForm>
      <Landing.Title title={'Login'} />
      <InputForm
        label={'Username'}
        name={'username'}
        value={username}
        onChange={onChange}
        isDark={isDark}
        autoFocus={false}
        isPassword={false}
        autoComplete={'on'}
        error={warningUsername}
        forceIsDarkFalse={true}
      />
      <InputForm
        label={'Password'}
        name={'password'}
        value={password}
        onChange={onChange}
        isDark={isDark}
        autoFocus={false}
        isPassword={true}
        autoComplete={'off'}
        error={warningPassword}
        forceIsDarkFalse={true}
      />
      <Landing.Separator />
      <Landing.ButtonPrimary title={'Login'} onClick={verifyAccount} />
      <Landing.Separator />
      {/*<div style={{ display: 'flex', justifyContent: 'center' }}>*/}
      {/*  <Landing.Text text={"Don't have account?"} />*/}
      {/*</div>*/}
      {/*<Landing.ButtonSecondary*/}
      {/*  title={'Register'}*/}
      {/*  onClick={redirectToRegister}*/}
      {/*/>*/}
    </Landing.ContainerForm>
  );
};

interface ILoginAccountView {
  username: string;
  password: string;
  warningUsername?: string;
  warningPassword?: string;
  verifyAccount: any;
  onChange: any;
  redirectToRegister: any;
}

const LoginAccountView = (props: ILoginAccountView) => {
  const {
    username,
    password,
    warningUsername,
    warningPassword,
    verifyAccount,
    onChange,
    redirectToRegister,
  } = props;

  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  return isMobile ? (
    <Landing.Wrapper>
      <div className={'landing__main'}>
        <Landing.Container>
          <InputContainer
            username={username}
            password={password}
            warningUsername={warningUsername}
            warningPassword={warningPassword}
            verifyAccount={verifyAccount}
            onChange={onChange}
            redirectToRegister={redirectToRegister}
          />
        </Landing.Container>
      </div>
      <Landing.Footer />
    </Landing.Wrapper>
  ) : (
    <Landing.Wrapper>
      <Landing.OneScreen background={'#c5cae9ff'}>
        <Landing.Container content={'-center'}>
          <InputContainer
            username={username}
            password={password}
            warningUsername={warningUsername}
            warningPassword={warningPassword}
            verifyAccount={verifyAccount}
            onChange={onChange}
            redirectToRegister={redirectToRegister}
          />
        </Landing.Container>
      </Landing.OneScreen>
      <Landing.Footer />
    </Landing.Wrapper>
  );
};

const LoginAccount = () => {
  const [loginState, dispatchState] = useReducer(StateReducer, Utils.state);
  const history = useHistory();
  const {
    username,
    password,
    localDatabaseError,
    warningUsername,
    warningPassword,
  }: any = loginState;

  const dispatch: Dispatch = useDispatch();

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ loginState, payload });
  };

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setLocalState(name, value);
  };

  const handleError = (data: any): void => {
    dispatch(setIsAppStarting(false));

    const { code, message } = data;
    if (code === USER_NOT_FOUND) {
      setLocalState('warningUsername', message);
    } else if (code === WRONG_PASSWORD) {
      setLocalState('warningPassword', message);
    } else {
      // TODO SNACKBAR ERROR
    }
  };

  const resetWarnings = (): void => {
    setLocalState('warningUsername', '');
    setLocalState('warningPassword', '');
  };

  const verifyAccount = async () => {
    dispatch(setIsAppStarting(true));

    // Should return dummy encryption data after login
    resetWarnings();

    try {
      const data = {
        username,
        password,
      };
      // Get salt and b challenge from server
      const serverUserSrpResponse: AxiosResponse = await AccountApi.getChallenge(
        username
      );

      if (serverUserSrpResponse.status === HTTP_STATUS_BAD_REQUEST) {
        handleError(serverUserSrpResponse.data);

        return;
      }

      const { salt, b } = serverUserSrpResponse.data as TSrpChallengeType;

      // Create SRP client
      const client: any = new srpClient();

      // Use password
      client.step1(username, password);

      // Create credentials
      const credentials: TSrpCredentialsType = client.step2(salt, b);

      const credentialsForAuth: TSrpCredentialsForAuthType = {
        ...credentials,
        ...{ username },
      };

      // Send credentials to authenticate on server
      const response: AxiosResponse = await AccountApi.login(
        credentialsForAuth
      );

      if (response.status === HTTP_STATUS_BAD_REQUEST) {
        handleError(response.data);

        return;
      }

      const { cryptoPassword, publicKey, privateKey } = response.data;

      dispatch(setIsAppStarting(false));

      if (response && (cryptoPassword || privateKey)) {
        dispatch(setIsLogged(true));
        dispatch(setUsername(username));

        // Backward compatibility for older accounts with just cryptoPassword

        if (cryptoPassword) {
          // Decrypt cryptoPassword and store it in state
          const cryptoPasswordDecrypted: any = await Crypto.decrypt(
            cryptoPassword,
            password
          );

          dispatch(setCryptoPassword(cryptoPasswordDecrypted));
        } else {
          const privateKeyArmorDecrypted: any = await Crypto.decrypt(
            privateKey,
            password
          );

          dispatch(setPassword(password));
          dispatch(
            setPgpKeys({ publicKey, privateKey: privateKeyArmorDecrypted })
          );
        }
      } else {
        if (response.status === 400) {
          handleError(response.data.error);
        }
      }
    } catch (err) {
      dispatch(setIsAppStarting(false));
      logger(err.toString());
    }
  };

  const redirectToRegister = (): void => {
    history.push('/register');
  };

  return (
    <LoginAccountView
      username={username}
      password={password}
      warningUsername={warningUsername}
      warningPassword={warningPassword}
      verifyAccount={verifyAccount}
      redirectToRegister={redirectToRegister}
      onChange={onChange}
    />
  );
};

export default LoginAccount;
