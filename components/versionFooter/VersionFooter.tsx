import React, { useContext } from 'react';

import './VersionFooter.scss';
import { Context } from '../../context/store';
import { parseCssDark } from '../../../bloben-common/utils/common';

const VersionFooter = () => {
    const [store] = useContext(Context);

    const {isDark} = store;


  return (
    <div className={'version-footer__container'}>
      <p
        className={parseCssDark('version-footer__text', isDark)}
      >{`Version ${process.env.REACT_APP_VERSION}`}</p>
    </div>
  );
};

export default VersionFooter;
