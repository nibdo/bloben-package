import React, { useEffect, useState } from 'react';
import './alertTemp.scss';
import { Button, ButtonBase } from '@material-ui/core';

const AlertTemp = (props: any) => {
    return (
        <div style={{ zIndex: 9999, backgroundColor: 'rgba(255,255,255, 0.6)', position: 'fixed', top: 0, left: 0, display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: 24, maxWidth: 300, backgroundColor: 'black' }}>
                <p style={{color: 'white', fontSize: 14, marginBottom: 16}}>
                    Important information: Bloben will continue only as self hosted service
                </p>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                    <ButtonBase
                        onClick={props.closeTempAlert}
                        className={'button__container-small'}
                    >
                        Close
                    </ButtonBase>
                    <div style={{width: '20%'}}/>
                    <ButtonBase
                        onClick={props.readMoreTempAlert}
                        className={'button__container-small'}
                    >
                        Read more
                    </ButtonBase>
                </div>
            </div>

        </div>
    );
};

export default AlertTemp;
