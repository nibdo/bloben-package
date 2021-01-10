import React from 'react';
import './ModalSmall.scss';
import { useSelector } from 'react-redux';

interface IModalViewProps {
  handleClose: any;
  children: any;
  preventDefault: any;
}
const ModalView = (props: IModalViewProps) => {
  const { handleClose, children, preventDefault } = props;
  const isDark: boolean = useSelector((state: any) => state.isDark);

  const onClose = (e: any): void => {
    preventDefault(e)
    handleClose()
  }

  return (
    <div
      className={`modal-small__wrapper${isDark ? '-dark' : ''}`}
      onClick={onClose}
    >
      <div
        onClick={preventDefault}
        className={`modal-small__container${isDark ? '-dark' : ''} `}
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
