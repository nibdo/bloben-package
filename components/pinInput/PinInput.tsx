import React from 'react';
import './PinInput.scss';

export const PIN_CODE_LENGTH: number = 4;
export const MAX_PIN_UNLOCK_ATTEMPTS: number = 10;

interface IInputField {
  number: number | string;
}
const InputField = (props: IInputField) => {
  const { number } = props;

  return (
    <div className={'pin-input__field-wrapper'}>
      <div className={'pin-input__field-container'}>
        <p className={'pin-input__text'}>{number}</p>
      </div>
    </div>
  );
};

const renderValue = (valueProp: string) => {
  let value: string = valueProp;

  if (value.length < PIN_CODE_LENGTH) {
    for (let i = value.length; i < PIN_CODE_LENGTH; i = i + 1) {
      value = `${value} `;
    }
  }
  const numbers: string[] = value.split('');

  return numbers.map((number: string) => {
    return <InputField number={number !== ' ' ? '*' : ''} />;
  });
};

interface IPinInputRow {
  value: string;
}
const PinInputRow = (props: IPinInputRow) => {
  const { value } = props;
  const input = renderValue(value);

  return <div className={'pin-input__row'}>{input}</div>;
};

interface IPinInputViewProps {
  value: string;
}
const PinInputView = (props: IPinInputViewProps) => {
  const { value } = props;

  return (
    <div className={'pin-input__container'}>
      <PinInputRow value={value} />
    </div>
  );
};

interface IPinInputProps {
  value: string;
}
const PinInput = (props: IPinInputProps) => {
  const { value } = props;

  return <PinInputView value={value} />;
};

export default PinInput;
