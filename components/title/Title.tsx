import React, { useContext } from 'react';
import './Title.scss';
import { Context } from '../../context/store';

interface IMobileTitleProviderProps {
  title: string;
  forceDesktop?: boolean;
}
const MobileTitleView = (props: IMobileTitleProviderProps) => {
  const { title, forceDesktop } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
      <h3 className={`${forceDesktop ? 'mobile-title__text-desktop' : 'mobile-title__text'} ${isDark
       ? 'dark_text' : 'light_text'}`}>
        {title}
      </h3>
  );
};

const MobileTitle = (props: any) => {
  const { title, forceDesktop } = props;

  return (
      <MobileTitleView title={title} forceDesktop={forceDesktop}/>
  );
};

export default MobileTitle;
