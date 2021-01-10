import { Dispatch } from 'redux';
import { setIsDark } from '../../redux/actions';

const HEADER_DARK: string = '#1D1F26';
const HEADER_LIGHT: string = '#f6f6f6';

export const changeStatusbarColor = (color: string) => {
  // @ts-ignore
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', color);
};

export const triggerTheme =  (themeValue: string, setContext: any) => {
  changeStatusbarColor(
    themeValue === 'dark' ? HEADER_DARK : HEADER_LIGHT
  );
};
export const changeTheme =  (theme: string, dispatch: Dispatch) => {
  if (theme === 'dark') {
    dispatch(setIsDark(true));
    changeStatusbarColor(HEADER_DARK);
  } else {
    dispatch(setIsDark(false));
    changeStatusbarColor(HEADER_LIGHT);
  }
};

export const setThemeDefault = (dispatch: Dispatch) =>
  new Promise((resolve) => {
    dispatch(setIsDark(false));
    changeStatusbarColor(HEADER_LIGHT);
    resolve();
  });

export const setTheme = async (dispatch: Dispatch) =>
  new Promise(async (resolve) => {
    // Find local settings for theme
    await setThemeDefault(dispatch);
    resolve();
  });
