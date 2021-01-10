import React, { useContext, useState } from 'react';
import MobileTitle from '../../components/title/Title';
import SettingsItem from '../../components/settingsItem/SettingsItem';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import Dropdown from '../../components/dropdown/Dropdown';
import HeaderModal from '../../components/headerModal/HeaderModal';
import { Context } from '../../context/store';
import { LocalForage } from '../../utils/LocalForage';

const dropdownValues: string[] = ['light', 'dark', 'system'];

interface IAppearanceViewProps {
  openThemeDropdown: any;
  setThemeDropdown: any;
  theme: string;
  themeDropdown: any;
  handleThemeChange: any;
}
const AppearanceView = (props: IAppearanceViewProps) => {
  const {
    openThemeDropdown,
    setThemeDropdown,
    theme,
    themeDropdown,
    handleThemeChange,
  } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <div className={`column${isDark ? '-dark' : ''}`}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Appearance'} />
        <SettingsItem
          icon={
            <EvaIcons.Moon
              className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
            />
          }
          title={'Theme'}
          onClick={openThemeDropdown}
          description={theme}
        />
        <Dropdown
          isOpen={themeDropdown}
          handleClose={() => setThemeDropdown('')}
          selectedValue={theme}
          values={dropdownValues}
          onClick={handleThemeChange}
        />
      </div>
    </div>
  );
};

const Appearance = () => {
  const [themeDropdown, setThemeDropdown]: any = useState('');

  const openThemeDropdown = (e: any) => {
    const nativeEvent: any = e.nativeEvent;
    const { clientX, clientY } = nativeEvent;
    setThemeDropdown({ clientX, clientY });
  };

  const [store, setContext] = useContext(Context);
  const {isDark} = store;

  const handleThemeChange = async (value: string) => {
    setContext('isDark', value);
    await LocalForage.setItem('isDark', value);
  };

  return (
    <AppearanceView
      openThemeDropdown={openThemeDropdown}
      themeDropdown={themeDropdown}
      setThemeDropdown={setThemeDropdown}
      handleThemeChange={handleThemeChange}
      theme={isDark}
    />
  );
};

export default Appearance;
