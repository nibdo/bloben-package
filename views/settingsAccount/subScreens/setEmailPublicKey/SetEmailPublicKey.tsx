import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

import InputForm from 'bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';

import { logger, parseCssDark } from 'bloben-common/utils/common';
import MobileTitle from '../../../../components/title/Title';
import HeaderModal from '../../../../components/headerModal/HeaderModal';
import { Context } from '../../../../context/store';
import EmailApi, { IGetEmailDTO } from '../../../../api/email.api';
import EvaIcons from '../../../../../bloben-common/components/eva-icons';
import { STATUS_OK } from '../../../../utils/common';
import AccountApi from '../../../../api/account.api';
import { Input } from '../../../../components/input/Input';
import { InputBorder } from '../../../../components/input/InputBorder';
import { ButtonBase } from '@material-ui/core';
import { HeightHook } from '../../../../../bloben-common/utils/layout';
import { IUserProfile } from '../../../../types/common.types';

interface IInputContainerProps {
  input: string;
  onChange: any;
  handleSet: any;
  handleDelete: any;
  handleInputClick: any;
  onFileChange: any;
  inputFile: any;
}

const InputContainer = (props: IInputContainerProps) => {
  const { onChange, input, handleSet, handleDelete, handleInputClick, onFileChange, inputFile } = props;

  const userProfile: IUserProfile = useSelector(
      (state: any) => state.userProfile
  );
  const { emailPublicKey } = userProfile;

  const [store] = useContext(Context);

  const { isDark } = store;

  const height: number = HeightHook();


  return (
    <div className={'settings__container-input'}>
      <div style={{height: '50%'}}>
      {userProfile.emailPublicKey ? (
        <InputBorder
          name={'publicKey'}
          defaultValue={emailPublicKey as string}
          value={emailPublicKey as string}
          onChange={onChange}
          rows={height / 2 / 25}
          autoFocus={false}
          autoComplete={'off'}
          multiline={true}
        />
      ) : (
        <InputBorder
        type='text'
        name='publicKey'
        placeholder='Paste your public key for email'
        autoComplete={'off'}
        className={parseCssDark('event_detail__input', isDark)}
        onChange={onChange}
        value={input}
        rows={height / 2 / 25}
        multiline={true}
        />
      )}</div>
      <Landing.Separator />
      {userProfile.emailPublicKey ? null :
          <ButtonBase
              className={'landing__button-secondary'}
              onClick={handleInputClick}
          >
            <p>
              Import public key from file
            </p>
            <input
                className={'event_uploader__input'}
                type="file"
                id="file"
                ref={inputFile}
                accept={'.asc'}
                // autoFocus={true}
                onChange={onFileChange}
            />
          </ButtonBase>
      }
      <Landing.Separator />
      <Landing.Separator />
      {!emailPublicKey ? (
        <Landing.ButtonPrimary
          title={'Confirm'}
          onClick={handleSet}
          isDark={true}
        />
      ) : null}

      {emailPublicKey ? (
        <Landing.ButtonPrimary
          title={'Delete key'}
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
  onFileChange: any;
  handleInputClick: any;
  inputFile: any;
}

const SetEmailPublicKeyView = (props: IDeleteAccountView) => {
  const { onChange, input, handleSet, handleDelete, onFileChange, handleInputClick, inputFile } = props;

  const [store] = useContext(Context);

  const { isDark } = store;



  return (
    <div className={parseCssDark('column', isDark)}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Public key'} />
        <InputContainer
          onChange={onChange}
          input={input}
          handleSet={handleSet}
          handleDelete={handleDelete}
          onFileChange={onFileChange}
          handleInputClick={handleInputClick}
          inputFile={inputFile}
        />
      </div>
    </div>
  );
};

const SetEmailPublicKey = () => {
  const [input, setInput] = useState('');
  const inputFile = useRef(null);

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
      const resp: AxiosResponse = await AccountApi.updateProfile({ key: 'publicKey', value: null});

      if (resp.data.code === 1000) {
        setInput('')

        setContext('showSnackbar', {
          text: 'Your public key was deleted',
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
      const resp: AxiosResponse = await AccountApi.updateProfile({ key: 'publicKey', value: input});

    if (resp.data.code === 1000) {
      setContext('showSnackbar', {
        text: 'Your public key was set',
      });
    }
  } catch (error) {
    setContext('showSnackbar', {
      text: 'Error: Try again',
    });
  }
  };


  /**
   * Validate file type
   * @param fileObj
   */
  const validateFile = (fileObj: any): boolean => {
    const { name, size } = fileObj;

    const fileExtension: string = name.split('.').pop();

    if (fileExtension !== 'asc') {
      return false;
    }

    if (size > 30000000) {
      return false;
    }

    return true;
  };
  /**
   * Handle file select
   * @param event
   */
  const onFileChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      // Select file
      const fileFromInput: any = event.target.files[0];
      const reader: FileReader = new FileReader();
      if (fileFromInput) {
        // Validate file
        const isValidFile: boolean = validateFile(fileFromInput);

        if (!isValidFile) {
          return;
        }

        // Read file content
        reader.readAsText(fileFromInput, 'UTF-8');
        reader.onload = (evt: any) => {
          const readerResult: any = evt.target.result;
          setInput(readerResult);
        };
      } else {
        // clearData()
      }
    }
  };

  /**
   * Simulate click to hidden input
   */
  const handleInputClick = (e: any) => {
    e.stopPropagation();

    // e.preventDefault()
    // @ts-ignore
    inputFile.current.click();
  };

  return (
    <SetEmailPublicKeyView
      onChange={onChange}
      input={input}
      handleSet={handleSet}
      handleDelete={handleDelete}
      onFileChange={onFileChange}
      handleInputClick={handleInputClick}
      inputFile={inputFile}
    />
  );
};

export default SetEmailPublicKey;
