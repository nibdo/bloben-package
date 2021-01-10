import React from 'react';
import './HeaderDesktop.scss';
import { useSelector } from 'react-redux';

interface IHeaderDesktopProps {
  children: any;
}
const HeaderDesktop = (props: IHeaderDesktopProps) => {
  const isDark: boolean = useSelector((state: any) => state.isMobile);

  const { children } = props;

  return (
    <div className={`header-desktop__wrapper${isDark ? '-dark' : ''}`}>
      <div className={'header-desktop__row'}>{children}</div>
    </div>
  );
};

export default HeaderDesktop;
