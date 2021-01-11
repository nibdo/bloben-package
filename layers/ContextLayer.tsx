import React, { useContext, useEffect } from 'react';
import EncryptionLayer from './EncryptionLayer';
import { Context } from '../context/store';
import { MOBILE_MAX_WIDTH, parseCssDark } from 'bloben-common/utils/common';
import { WidthHook } from 'bloben-common/utils/layout';
import { LocalForage } from '../utils/LocalForage';
import {
    LIGHT_THEME,
    changeTheme,
    setThemeDefault,
    IThemeValue, SYSTEM_THEME, DARK_THEME,
} from '../utils/changeTheme';

/**
 * Setup init context options
 * @constructor
 */
const ContextLayer = () => {
  const [store, dispatch] = useContext(Context);

  const {isDark} = store;

  const width = WidthHook();

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  /**
   * Set mobile/desktop layout
   */
  useEffect(() => {
    if (width < MOBILE_MAX_WIDTH) {
      setContext('isMobile', true);
    } else {
      setContext('isMobile', false);
    }
  }, [width]);

  /**
   * Set theme
   */
  useEffect(() => {
    const getTheme = async () => {
      // Try to load theme from database
      const themeLocalValue: IThemeValue | null = await LocalForage.getItem(
        'theme'
      );

      // Set default theme
      if (!themeLocalValue) {
        await setThemeDefault(setContext);
      }

      // Ignore system settings here, set theme in listener
      if (themeLocalValue && themeLocalValue !== SYSTEM_THEME) {
          await changeTheme(themeLocalValue, setContext)
      }
    };

    getTheme();
  }, []);

  /*
   * Add listener for preferred color theme
   */
  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(async (e) => {
      // First check if system settings for theme are set
        // Try to load theme from database
        const themeLocalValue: IThemeValue | null = await LocalForage.getItem(
            'theme'
        );

        if (themeLocalValue && themeLocalValue === SYSTEM_THEME) {
            if (e.matches) {
                // Dark
                await changeTheme(DARK_THEME, setContext);
            } else {
                // Light
                await changeTheme(LIGHT_THEME, setContext);
            }
        }
    });
  }, []);

    return <div className={parseCssDark('root-wrapper', isDark)}><EncryptionLayer /></div>;
};

export default ContextLayer;
