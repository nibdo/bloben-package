import React from 'react';
import { useSelector } from 'react-redux';

import './VersionFooter.scss';

const VersionFooter = () => {
  const isDark: boolean = useSelector((state: any) => state.isDark);

  return (
    <div className={'version-footer__container'}>
      <p
        className={`version-footer__text${isDark ? '-dark' : ''}`}
      >{`Version ${process.env.REACT_APP_VERSION}`}</p>
    </div>
  );
};

export default VersionFooter;
