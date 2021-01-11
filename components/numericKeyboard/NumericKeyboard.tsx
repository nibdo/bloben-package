import React, { useContext } from 'react';
import './NumericKeyboard.scss';
import { ButtonBase } from '@material-ui/core';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import { Context } from '../../context/store';
import { parseCssDark } from '../../../bloben-common/utils/common';

interface IKeyProps {
    index: string;
    disabled?: boolean;
    number: string;
    handleClick?: any;
    handlePop?: any;
}
const Key = (props: IKeyProps) => {
  const { disabled, number, handleClick, handlePop } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  const onClick = () => {
      if (handleClick) {
          handleClick(number)
      }

      if (handlePop) {
          handlePop()
      }
  }

  return (
    <div className={'key__container'}>
      <ButtonBase className={parseCssDark(`key__button${disabled ? '-disabled' : ''}`, isDark)} disabled={disabled} onClick={onClick}>
          {handlePop ? <EvaIcons.SkipBack className={'icon-svg'}/> : <p className={'key__text'}>{number}</p> }
      </ButtonBase>
    </div>
  );
};

const renderKeys = (keys: string[], handleClick: any, handlePop?: any) =>
 keys.map((key: string) => {
     if (key === '') {
         return <Key index={key} number={key} disabled={true} />;
     } else if (key === 'back') {
         return <Key index={key} number={key} handlePop={handlePop} />;
     } else {
         return <Key index={key} number={key} handleClick={handleClick} />;
     }
  })

interface IKeyboardRowProps {
    keys: string[];
    handleClick: any;
    handlePop?: any;
}
const KeyboardRow = (props: IKeyboardRowProps) => {
  const { keys, handleClick, handlePop } = props;
  const renderedKeys = renderKeys(keys, handleClick, handlePop);

  return <div className={'numeric-keyboard__row'}>{renderedKeys}</div>;
};

interface INumericKeyboardProps {
    handleClick: any;
    handlePop: any;
}
const NumericKeyboard = (props: INumericKeyboardProps) => {
  const { handleClick, handlePop } = props;

  return (
    <div className={'numeric-keyboard__container'}>
      {/* tslint:disable-next-line:no-magic-numbers */}
      <KeyboardRow keys={['1', '2', '3']} handleClick={handleClick} />
      {/* tslint:disable-next-line:no-magic-numbers */}
      <KeyboardRow keys={['4', '5', '6']} handleClick={handleClick} />
      {/* tslint:disable-next-line:no-magic-numbers */}
      <KeyboardRow keys={['7', '8', '9']} handleClick={handleClick} />
      <KeyboardRow keys={['', '0', 'back']} handleClick={handleClick} handlePop={handlePop}/>
    </div>
  );
};

export default NumericKeyboard;
