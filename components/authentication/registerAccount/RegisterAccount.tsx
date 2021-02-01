import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';

import InputForm from 'bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import Utils from './RegisterAccount.utils';
import AccountApi from 'bloben-package/api/account.api';
import register from '../../../utils/register-account';
import {
  setIsLogged,
  setPassword,
  setPgpKeys,
  setUsername,
} from '../../../../redux/actions';
import { logger } from 'bloben-common/utils/common';
import Axios from 'bloben-common/utils/axios';
import StateReducer from 'bloben-package/utils/state-reducer';

// RFC 5054 2048bit constants
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
  repeatedPassword: string;
  warningUsername?: string;
  warningPassword?: string;
  onChange: any;
  validateAccount: any;
}
const InputContainer = (props: IInputContainerProps) => {
  const {
    username,
    password,
    repeatedPassword,
    warningUsername,
    onChange,
    validateAccount,
  } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  return (
    <Landing.ContainerForm>
      <Landing.Title title={'Register'} />
      <InputForm
        label={'Username'}
        name={'username'}
        value={username}
        onChange={onChange}
        isDark={isDark}
        autoFocus={false}
        isPassword={false}
        autoComplete={'off'}
        error={warningUsername}
        forceIsDarkFalse={true}
      />
      {/*<div style={{ width: 24 }} />*/}
      <InputForm
        label={'Password'}
        name={'password'}
        value={password}
        isDark={isDark}
        onChange={onChange}
        autoFocus={false}
        isPassword={true}
        autoComplete={'off'}
        forceIsDarkFalse={true}
      />
      <InputForm
        label={'Confirm password'}
        name={'repeatedPassword'}
        value={repeatedPassword}
        isDark={isDark}
        onChange={onChange}
        autoFocus={false}
        isPassword={true}
        autoComplete={'off'}
        forceIsDarkFalse={true}
      />
      <Landing.Separator />
      <Landing.Separator />

      <Landing.ButtonPrimary onClick={validateAccount} title={'Continue '} />
      <Landing.Separator />
    </Landing.ContainerForm>
  );
};

interface IRegisterAccountViewProps {
  username: string;
  password: string;
  repeatedPassword: string;
  warningUsername?: string;
  warningPassword?: string;
  onChange: any;
  validateAccount: any;
}
const RegisterAccountView = (props: IRegisterAccountViewProps) => {
  const {
    username,
    password,
    repeatedPassword,
    warningUsername,
    warningPassword,
    onChange,
    validateAccount,
  } = props;

  return (
    <Landing.Wrapper>
      <Landing.OneScreen>
        <Landing.Container content={'-center'}>
          <InputContainer
            username={username}
            password={password}
            repeatedPassword={repeatedPassword}
            warningUsername={warningUsername}
            warningPassword={warningPassword}
            onChange={onChange}
            validateAccount={validateAccount}
          />
        </Landing.Container>
      </Landing.OneScreen>
      <Landing.Footer />
    </Landing.Wrapper>
  );
};

const RegisterAccount = () => {
  const [registerState, dispatchState] = useReducer(StateReducer, Utils.state);
  const dispatch: any = useDispatch();

  const {
    username,
    password,
    repeatedPassword,
    warningUsername,
    warningPassword,
    isLoading,
  }: any = registerState;

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ registerState, payload });
  };

  const handleError = (text: string) => {
    if (text === 'errorUsername') {
      setLocalState('warningUsername', 'Username taken');
    } else {
      setLocalState('warningPassword', 'Wrong password');
    }
  };
  const resetWarnings = (): void => {
    setLocalState('warningUsername', '');
    setLocalState('warningPassword', '');
  };
  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setLocalState(name, value);
  };

  /**
   * Create verifier and salt from new SRP client
   */
  const createVerifier = () => {
    const client: any = new srpClient();

    const salt: any = client.generateRandomSalt();

    const verifier: any = client.generateVerifier(salt, username, password);

    return {
      salt,
      verifier,
    };
  };

  const validateName = () =>
    new Promise(async (resolve, reject) => {
      setLocalState('warningUsername', '');
      setLocalState('isLoading', true);
      const data = {
        username,
      };

      try {
        const response: AxiosResponse = await AccountApi.checkUsername(data);
        if (response.data.isTaken) {
          setLocalState('warningUsername', 'Username is taken');
          reject();
        }

        resolve();
      } catch (e) {
        reject(e)
      }
    });

  const validateAccount = async () => {
    resetWarnings();
    try {
      // Validate password
      try {
        await Utils.validateAccountPassword(password, repeatedPassword);
      } catch (error) {
        setLocalState('warningPassword', error);

        return;
      }

      // Validate username
      await validateName();
      // TODO: Handle reject

      try {
        const srpData = createVerifier();
        const { salt, verifier } = srpData;

        const result: any = await register(username, password, salt, verifier);

        // Save PGP keys
        dispatch(setPgpKeys(result.pgpKeys));

        // Send data and register
        const response = await Axios.post('/user/register', result.data);

        if (response.status === 200) {
          dispatch(setPassword(password));

          // Handle local data
          dispatch(setUsername(username));
          // await saveCryptoPasswordLocal(cryptoPasswordReal, false);
          dispatch(setIsLogged(true));

          // Handle settings
          // await initUser(dispatch);
        }
      } catch (error) {
        logger(error);
      }

      // Save user's data to store for next step
      // setContext('tempAuthData', tempAuthData);
    } catch (error) {
      logger(error);
    }
  };

  return (
    <RegisterAccountView
      username={username}
      password={password}
      repeatedPassword={repeatedPassword}
      warningUsername={warningUsername}
      warningPassword={warningPassword}
      onChange={onChange}
      validateAccount={validateAccount}
    />
  );
};

export default RegisterAccount;
