import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import RegisterAccount from '../components/authentication/registerAccount/RegisterAccount';
import LoginAccount from '../components/authentication/loginAccount/LoginAccount';
import IntroScreen from '../../views/introScreen/IntroScreen';

const history: any = createBrowserHistory();

const AnonymView = () => {

  const ReactApp = {
    width: '100%',
    height: '100%',
  };

  return (
    <div style={ReactApp}>
        <Router history={history}>
            {process.env.REACT_APP_NODE_ENV === 'development'
                ? <Route exact path={'/'} render={() => <LoginAccount /> }/>
                : <Route exact path={'/'} render={() => <IntroScreen />} />
            }
            <Route exact path={'/login'} render={() => <LoginAccount />} />
            <Route
                exact
                path={'/register'}
                render={() => <RegisterAccount />}
            />
        </Router>
    </div>
  );
};

export default AnonymView;
