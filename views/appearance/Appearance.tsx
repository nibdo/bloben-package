import React, { useContext, useEffect, useState } from 'react';
import MobileTitle from '../../components/title/Title';
import SettingsItem from '../../components/settingsItem/SettingsItem';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import Dropdown from '../../components/dropdown/Dropdown';
import HeaderModal from '../../components/headerModal/HeaderModal';
import { Context } from '../../context/store';
import { LocalForage } from '../../utils/LocalForage';
import {
  DARK_THEME,
  IThemeValue,
  LIGHT_THEME,
  SYSTEM_THEME,
  triggerTheme,
} from '../../utils/changeTheme';
import { capitalStart } from '../../utils/common';

const dropdownValues: IThemeValue[] = [LIGHT_THEME, DARK_THEME, SYSTEM_THEME];

interface IAppearanceViewProps {
  openThemeDropdown: any;
  setThemeDropdown: any;
  currentTheme: IThemeValue;
  themeDropdown: any;
  handleThemeChange: any;
}
const AppearanceView = (props: IAppearanceViewProps) => {
  const {
    openThemeDropdown,
    setThemeDropdown,
    currentTheme,
    themeDropdown,
    handleThemeChange,
  } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  const renderDropdown = () => {
    return <Dropdown
        isOpen={themeDropdown}
        handleClose={() => setThemeDropdown('')}
        selectedValue={currentTheme}
        values={dropdownValues}
        onClick={handleThemeChange}
    />
  }

  const dropdown: any = renderDropdown();

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
          description={capitalStart(currentTheme)}
          dropdown={dropdown}
        />

      </div>
    </div>
  );
};

const Appearance = () => {
  const [themeDropdown, setThemeDropdown]: any = useState('');
  const [currentTheme, setCurrentTheme]: any = useState(null);

  const openThemeDropdown = (e: any) => {
    const nativeEvent: any = e.nativeEvent;
    const { clientX, clientY } = nativeEvent;
    setThemeDropdown({ clientX, clientY });
  };

  const [store, dispatchContext] = useContext(Context);

  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const handleThemeChange = async (value: IThemeValue) => {
    await triggerTheme(value, setContext);
    dispatchContext('isDark', false);
    setCurrentTheme(value);
    setThemeDropdown(null)
  };

  /**
   * Load theme on init
   */
  useEffect(() => {
    const getTheme = async () => {
      // Try to load theme from database
      const themeLocalValue: IThemeValue | null = await LocalForage.getItem(
        'theme'
      );

      if (themeLocalValue) {
        setCurrentTheme(themeLocalValue);
      }
    };

    getTheme();
  },        []);

  return currentTheme ? (
    <AppearanceView
      openThemeDropdown={openThemeDropdown}
      themeDropdown={themeDropdown}
      setThemeDropdown={setThemeDropdown}
      handleThemeChange={handleThemeChange}
      currentTheme={currentTheme}
    />
  ) : null;
};

export default Appearance;
