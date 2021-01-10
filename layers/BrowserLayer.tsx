import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReduxLayer from './ReduxLayer';

interface IBrowserLayer {
    isDecrypted?: boolean;
    state?: any;
}
const BrowserLayer = (props: IBrowserLayer) => {
    const {isDecrypted, state} = props;

    return (
        <BrowserRouter>
            {isDecrypted ? <ReduxLayer isDecrypted={isDecrypted} state={state}/> : null}
        </BrowserRouter>
    )
}

export default BrowserLayer;
