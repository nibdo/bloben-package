import React, { createContext, useReducer } from 'react';

import Reducer from './reducer';

const initialContext = {
  isDark: false,
  isLoading: false,
  isMobile: false,
  snackbarIsVisible: false,
  snackbar: {},
};

const StoreProvider = ({ children }: any) => {
  const [store, dispatch] = useReducer(Reducer, initialContext);

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
};

export const setContext = (dispatchContext: any, type: string, payload: any) =>
  dispatchContext({ type, payload });

// @ts-ignore
export const Context = createContext();
export default StoreProvider;
