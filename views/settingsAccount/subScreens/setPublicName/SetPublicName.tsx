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
import AccountApi from '../../../../api/account.api';
import { IUserProfile } from '../../../../types/common.types';

interface IInputContainerProps {
  input: string;
  onChange: any;
  handleSet: any;
  handleDelete: any;
}

const InputContainer = (props: IInputContainerProps) => {
  const { onChange, input, handleSet, handleDelete } = props;

  const userProfile: IUserProfile = useSelector(
      (state: any) => state.userProfile
  );
  const { publicName } = userProfile;

  const [store] = useContext(Context);

  const { isDark } = store;


  return (
    <div className={'settings__container-input'}>
      {publicName ? (
        <InputForm
            label={'Public name'}
          name={'publicName'}
          defaultValue={publicName as string}
          value={publicName as string}
          onChange={onChange}
          isDark={isDark}
          autoFocus={false}
          isPassword={false}
          autoComplete={'off'}
        />
      ) : (
        <InputForm
          label={'Public name'}
          name={'publicName'}
          value={input}
          onChange={onChange}
          isDark={isDark}
          autoFocus={false}
          isPassword={false}
          autoComplete={'off'}
        />
      )}
      <Landing.Separator />
      <Landing.Separator />
      {!publicName ? (
        <Landing.ButtonPrimary
          title={'Confirm'}
          onClick={handleSet}
          isDark={true}
        />
      ) : null}

      {publicName ? (
        <Landing.ButtonPrimary
          title={'Delete public name'}
          onClick={handleDelete}
          isDark={true}
        />
      ) : null}
    </div>
  );
};

interface IDeleteAccountView {
  input: string;
  onChange: any;
  handleSet: any;
  handleDelete: any;
}

const SetPublicNameView = (props: IDeleteAccountView) => {
  const { onChange, input, handleSet, handleDelete } = props;

  const [store] = useContext(Context);

  const { isDark } = store;

  return (
    <div className={parseCssDark('column', isDark)}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Public name'} />
        <InputContainer
          onChange={onChange}
          input={input}
          handleSet={handleSet}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

const SetEmailPublicKey = () => {
  const [input, setInput] = useState('');
  const [store, dispatchContext] = useContext(Context);

  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ deleteAccountState, payload });
  };

  const onChange = (e: any): void => {
    const value = e.target.value;
    setInput(value);
  };

  const handleDelete = async () => {
    try {
      const resp: AxiosResponse = await AccountApi.updateProfile({ key: 'publicName', value: null});

      if (resp.data.code === 1000) {
        setInput('')

        setContext('showSnackbar', {
          text: 'Your public name was deleted',
        });

      }
    } catch (error) {
      setContext('showSnackbar', {
        text: 'Error: Try again',
      });
    }
  };

  const handleSet = async () => {
    try {
    const resp: AxiosResponse = await AccountApi.updateProfile({key: 'publicName', value: input} );

    if (resp.data.code === 1000) {
      setContext('showSnackbar', {
        text: 'Your public name was set',
      });
    }
  } catch (error) {
    setContext('showSnackbar', {
      text: 'Error: Try again',
    });
  }
  };

  return (
    <SetPublicNameView
      onChange={onChange}
      input={input}
      handleSet={handleSet}
      handleDelete={handleDelete}
    />
  );
};

export default SetEmailPublicKey;
