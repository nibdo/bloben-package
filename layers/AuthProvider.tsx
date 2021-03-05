import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { User } from '../../bloben-utils/models/User';
import AuthorizedProvider from '../../layers/AuthorizedProvider';
import IFrame from '../../bloben-components/components/iFrame/IFrame';
import { setPassword, setUser } from '../../redux/actions';
import AccountApi from '../../bloben-utils/api/account.api';
import Crypto from '../../bloben-utils/utils/encryption';
import WebsocketProvider from './WebsocketProvider';

const AuthProvider = () => {
  const user: User = useSelector((state: any) => state.user);
  const password: string = useSelector((state: any) => state.password);

  const isLogged: boolean = user && user.username !== null;

  const dispatch: any = useDispatch();

  const getPasswordFromIFrame = async () => {
    window.onmessage = async (e: any) => {
      if (e.origin === 'http://localhost:4000') {
        const payload: any = JSON.parse(e.data);
        console.log(payload);
        if (payload['BLOBEN_PASSWORD']) {
          // Try to get password
          dispatch(setPassword(payload['BLOBEN_PASSWORD']));
        }

        // Handle login from account iframe
        if (payload['username']) {
          dispatch(setPassword(payload.password));
        }
      }
    };
  };

  const loadUser = async () => {
    if (password) {
      const userResponse: any = await AccountApi.getUserData();

      const userData = userResponse.data;
      userData.privateKey = await Crypto.decrypt(userData.privateKey, password);

      dispatch(setUser(userData));
    }
  };

  useEffect(() => {
    getPasswordFromIFrame();
  }, []);

  useEffect(() => {
    loadUser();
  }, [password]);

  return (
    <>
      {isLogged ? (
        <WebsocketProvider>
          <AuthorizedProvider />
        </WebsocketProvider>
      ) : (
        <IFrame src={process.env.REACT_APP_ACCOUNT_URL as string} />
      )}
    </>
  );
};

export default AuthProvider;
