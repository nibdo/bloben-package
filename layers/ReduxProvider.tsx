import React, { useEffect, useState } from 'react';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';

import 'bloben-common/index.scss';

import rootReducer from 'redux/reducers';
import { loadState, saveState } from '../../redux/localstorage';
import AuthProvider from './AuthProvider';

export let reduxStore: Store;

interface ReduxProviderProps {
  isDecrypted: boolean;
  state?: any;
}
const ReduxProvider = (props: ReduxProviderProps) => {
  const { isDecrypted, state } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const initReduxStore = async () => {
    const persistedState: any = await loadState(state);

    reduxStore = createStore(rootReducer, persistedState);

    setIsLoaded(true);

    reduxStore.subscribe(() => {
      saveState(reduxStore.getState());
    });
  };

  useEffect(() => {
    if (isDecrypted) {
      // REDUX STORE
      initReduxStore();
    }
  }, [isDecrypted]);

  return isLoaded ? (
    <Provider store={reduxStore}>
      {isDecrypted ? (
        reduxStore.getState().calendarView ? (
          <AuthProvider />
        ) : null
      ) : null}
    </Provider>
  ) : null;
};

export default ReduxProvider;
