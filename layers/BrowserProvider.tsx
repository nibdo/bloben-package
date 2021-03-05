import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import ReduxProvider from './ReduxProvider';
import { createBrowserHistory } from 'history';

// BROWSER HISTORY
createBrowserHistory();

interface BrowserLayerProps {
  isDecrypted?: boolean;
  state?: any;
}
const BrowserProvider = (props: BrowserLayerProps) => {
  const { isDecrypted, state } = props;

  return (
    <BrowserRouter>
      {isDecrypted ? (
        <ReduxProvider isDecrypted={isDecrypted} state={state} />
      ) : null}
    </BrowserRouter>
  );
};

export default BrowserProvider;
