import React, { useContext, useReducer } from 'react';

import StateReducer from 'bloben-package/utils/state-reducer';
import Utils from './GetPin.utils';
import MobileTitle from '../../components/title/Title';
import PinInput, { PIN_CODE_LENGTH } from '../../components/pinInput/PinInput';
import { Context } from '../../context/store';
import InputForm from '../../../bloben-common/components/inputForm/InputForm';
import Landing from 'bloben-common/components/landing/Landing';
import NumericKeyboard from '../../components/numericKeyboard/NumericKeyboard';
import HeaderModal from '../../components/headerModal/HeaderModal';
import { parseCssDark } from '../../../bloben-common/utils/common';

interface IPinInputDesktopProps {
  handleClick: any;
  handleDesktopOnChange: any;
  pinCode: string;
}
const PinInputDesktop = (props: IPinInputDesktopProps) => {
  const [store] = useContext(Context);
  const {isDark} = store;

  return (
      <div
          style={{
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
      >
        <InputForm
            autoFocus={true}
            submitEnter={props.handleClick}
            name={'pinCode'}
            isPassword={true}
            label={'PIN code'}
            value={props.pinCode}
            onChange={props.handleDesktopOnChange}
            maxLength={PIN_CODE_LENGTH}
            isDark={isDark}
        />
        <Landing.Separator/>
        <Landing.ButtonPrimary title={'Confirm'} onClick={props.handleClick}/>
      </div>
  );
}

interface IInputContainerProps {
  pinCode: string;
  onChange: any;
  handleClick: any;
  handlePop: any;
  handleDesktopOnChange: any;
}
const InputContainer = (props: IInputContainerProps) => {
  const {
    pinCode,
    onChange,
    handleClick,
    handlePop,
    handleDesktopOnChange,
  } = props;

  const [store] = useContext(Context);
  const { isMobile } = store;

  return isMobile ? (
    <div className={'settings__container-input'}>
      <PinInput value={pinCode} />
      <NumericKeyboard handleClick={onChange} handlePop={handlePop} />
      <Landing.Separator />
    </div>
  ) : (
    <PinInputDesktop
      pinCode={pinCode}
      handleDesktopOnChange={handleDesktopOnChange}
      handleClick={handleClick}
    />
  );
};

interface IGetPinViewProps {
  pinCode: string;
  onChange: any;
  handleClick: any;
  handlePop: any;
  handleDesktopOnChange: any;
}
const GetPinView = (props: IGetPinViewProps) => {
  const {
    pinCode,
    onChange,
    handleDesktopOnChange,
    handleClick,
    handlePop,
  } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  return (
    <div className={parseCssDark('column', isDark)}>
      <HeaderModal absolute={true}/>
      <div className={'settings__container'}>
        <MobileTitle title={'PIN Lock'} />
        <InputContainer
          pinCode={pinCode}
          onChange={onChange}
          handleDesktopOnChange={handleDesktopOnChange}
          handleClick={handleClick}
          handlePop={handlePop}
        />
      </div>
    </div>
  );
};

interface IGetPinProps {
  decryptStorage: any;
}
const GetPin = (props: IGetPinProps) => {
  const { decryptStorage } = props;
  const [state, dispatchState] = useReducer(StateReducer, Utils.state);

  const { pinCode }: any = state;
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const handleDesktopOnChange = (e: any) => {
    const value: any = e.target.value;
    if (!isNaN(value)) {
      setLocalState(e.target.name, value);
    }
  };

  const handlePop = () => {
    if (pinCode.length < PIN_CODE_LENGTH && pinCode.length > 0) {
      setLocalState('pinCode', pinCode.slice(0, pinCode.length - 1));

      return;
    }
  };

  const handleClick = () => {
    if (pinCode.length === PIN_CODE_LENGTH) {
      decryptStorage(pinCode);
    }
  };

  const onChange = async (number: any): Promise<void> => {
    if (!isNaN(number) && pinCode.length < PIN_CODE_LENGTH) {
      const stringNumber: string = pinCode + String(number);

      setLocalState('pinCode', stringNumber);

      if (stringNumber.length === PIN_CODE_LENGTH) {
        await decryptStorage(stringNumber);

        setLocalState('pinCode', '');
      }
    }
  };

  return (
    <GetPinView
      pinCode={pinCode}
      onChange={onChange}
      handleClick={handleClick}
      handlePop={handlePop}
      handleDesktopOnChange={handleDesktopOnChange}
    />
  );
};

export default GetPin;
