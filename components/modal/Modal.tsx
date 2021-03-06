import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import './Modal.scss';
import { useSelector } from 'react-redux';
import { Context } from '../../context/store';

interface IModalViewProps {
  goBack?: any;
  children: any;
  preventDefault: any;
}
const ModalView = (props: IModalViewProps) => {
  const { goBack, children, preventDefault } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  return (
    <div className={`modal__wrapper${isDark ? '-dark' : ''}`} onClick={goBack}>
      <div
        onClick={preventDefault}
        className={`modal__container${isDark ? '-dark' : ''}`}
      >
        {React.cloneElement(children, { goBack })}
      </div>
      </div>
  );
};

interface IModalProps {
  handleClose?: any;
  children: any;
  propagation?: any;
}
const Modal = (props: IModalProps) => {
  const { children, handleClose, propagation } = props;
  const history = useHistory();

  const goBack = (e: any) => {

    if (!propagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (handleClose) {
      handleClose();
    } else {
      history.goBack();
    }
  };

  const preventDefault = (e: any) => {
    if (!propagation) {
      e.preventDefault();
      e.stopPropagation();
    }

  };

  return (
    <ModalView
      goBack={goBack}
      children={children}
      preventDefault={preventDefault}
    />
  );
};

export default Modal;
