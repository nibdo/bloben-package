import React, { useEffect, useState } from 'react';
import 'bloben-common/index.scss';
import AppLayer from 'layers/AppLayer';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from 'redux/reducers';
import { loadState, saveState } from '../../redux/localstorage';

export let reduxStore: Store;

interface IReduxLayerProps {
  isDecrypted: boolean;
  state?: any;
}
const ReduxLayer = (props: IReduxLayerProps) => {
  const { isDecrypted, state } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const initReduxStore = async () => {
    const persistedState: any = await loadState(state);

    reduxStore = createStore(rootReducer, persistedState);

    setIsLoaded(true);

    // TODO remove some date keys from triggering save
    reduxStore.subscribe(() => {
      saveState(reduxStore.getState());
    });
  };

  useEffect(() => {
    if (isDecrypted) {
      // REDUX STORE
      initReduxStore();
    }
  },        [isDecrypted]);

  return isLoaded ? (
    <Provider store={reduxStore}>
      {isDecrypted ? (
        reduxStore.getState().calendarView ? (
          <AppLayer initPath={window.location.href} />
        ) : null
      ) : null}
    </Provider>
  ) : null;
};

export default ReduxLayer;
