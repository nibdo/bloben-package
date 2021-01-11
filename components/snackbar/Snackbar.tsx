import React, { useContext, useEffect, useState } from 'react';
import './Snackbar.scss';
import { useSelector } from 'react-redux';
import { Context } from '../../context/store';
import { parseCssDark } from '../../../bloben-common/utils/common';

const AUTO_HIDE: number = 3500;
const ANIMATION_DELAY: number = 300;

const Snackbar = (props: any) => {
  const { handleClose, handleConfirm, title, body } = props;

  const [store, dispatch] = useContext(Context);
  const {isDark, snackbarIsVisible, snackbar} = store;

  const [animation, setAnimation] = useState('')

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  useEffect(() => {
    if (snackbarIsVisible) {
      setAnimation('snackbar__up')

      if (!snackbar.timeout) {
        setTimeout(() => {
          setAnimation('snackbar__down')
        },         AUTO_HIDE)
        setTimeout(() => {
          setContext('hideSnackbar', {})
        },         AUTO_HIDE + ANIMATION_DELAY)
      }
          }

  }, [snackbarIsVisible])

  return (
    <div
      className={`${parseCssDark(`snackbar__container${snackbarIsVisible ? '-visible' : ''}`, isDark)} ${animation}`}
      onClick={handleClose}
    >
      <p className={parseCssDark('snackbar__text', isDark)}>{snackbar.text}</p>
    </div>
  );
};

export default Snackbar;
