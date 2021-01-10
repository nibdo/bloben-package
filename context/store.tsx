import React, { createContext, useReducer } from 'react';
import Reducer from './reducer';

const initialContext = {
    isDark: false,
    isLoading: false,
    isMobile: false,
    isReactNative: false,
    snackbarIsVisible: false,
    snackbar: {},
};

const Store = ({ children }: any) => {
    const [store, dispatch] = useReducer(Reducer, initialContext);

    return (
        <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
);
};

// @ts-ignore
export const Context = createContext();
export default Store;
