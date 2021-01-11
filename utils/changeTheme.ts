import { LocalForage } from './LocalForage';

export const LIGHT_THEME: IThemeValue = 'light';
export const DARK_THEME: IThemeValue = 'dark';
export const SYSTEM_THEME: IThemeValue = 'system';

export type IThemeValue = 'light' | 'dark' | 'system';

const HEADER_DARK: string = '#1D1F26';
const HEADER_LIGHT: string = '#f6f6f6';

/**
 * Change status bar color with editing meta theme-color tag
 * @param color
 */
export const changeStatusbarColor = (color: string) => {
  // @ts-ignore
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', color);
};

/**
 * Change theme settings and set new theme
 * @param themeValue
 * @param setContext
 */
export const triggerTheme = async (themeValue: IThemeValue, setContext: any) => {
    await LocalForage.setItem('theme', themeValue);

    changeTheme(themeValue, setContext);
};

export const changeTheme = (theme: IThemeValue, setContext: any) => {
  if (theme === DARK_THEME) {
      setContext('isDark', true);
      changeStatusbarColor(HEADER_DARK);
  }

  if (theme === LIGHT_THEME) {
    setContext('isDark', false);
    changeStatusbarColor(HEADER_LIGHT);
  }
};

/**
 * Set default (light) theme settings
 * @param setContext
 */
export const setThemeDefault = async (setContext: any) => {
  setContext('isDark', false);

  await LocalForage.setItem('theme', LIGHT_THEME);

  changeStatusbarColor(HEADER_LIGHT);
};
