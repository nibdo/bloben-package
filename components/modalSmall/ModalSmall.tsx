import React, { useContext } from 'react';
import './ModalSmall.scss';
import { useSelector } from 'react-redux';
import { Context } from '../../context/store';
import { parseCssDark } from '../../../bloben-common/utils/common';

interface IModalViewProps {
  handleClose: any;
  children: any;
  preventDefault: any;
}
const ModalView = (props: IModalViewProps) => {
  const { handleClose, children, preventDefault } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  const onClose = (e: any): void => {
    preventDefault(e)
    handleClose()
  }

  return (
    <div
      className={parseCssDark('modal-small__wrapper', isDark)}
      onClick={onClose}
    >
      <div
        onClick={preventDefault}
        className={parseCssDark('modal-small__container', isDark)}
      >
        {children}
      </div>
    </div>
  );
};

interface IModalSmallProps {
  handleClose: any;
  children: any;
  isOpen: any;
}
const ModalSmall = (props: IModalSmallProps) => {
  const { children, handleClose, isOpen } = props;

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return isOpen ? (
    <ModalView
      handleClose={handleClose}
      children={children}
      preventDefault={preventDefault}
    />
  ) : null;
};

export default ModalSmall;
