/*
 *
 * LanguageProvider actions
 *
 */
import Cookies from 'js-cookie';
import { CHANGE_LOCALE, CHANGE_THEME } from './constants';
import * as themes from 'whaleex/components/ThemeSwitch/theme/index.js';

export function changeLocale(languageLocale) {
  const lanMap = { zh: 1, en: 1, fr: 1, ko: 1, ja: 1 };
  if (lanMap[languageLocale]) {
    sessionStorage.setItem('userLan', languageLocale);
    Cookies.set('whaleex-lan', languageLocale);
    document.getElementsByTagName('html')[0].lang = languageLocale;
    return {
      type: CHANGE_LOCALE,
      locale: languageLocale,
    };
  } else {
    sessionStorage.setItem('userLan', 'en');
    Cookies.set('whaleex-lan', 'en');
    document.getElementsByTagName('html')[0].lang = 'en';
    return {
      type: CHANGE_LOCALE,
      locale: 'en',
    };
  }
}
export function changeTheme(theme) {
  let _theme = theme || Cookies.get('wal-theme') || 'themeDay';
  Cookies.set('wal-theme', _theme);
  if (_config.theme_switch) {
    window.less.modifyVars(themes[_theme] || themes['themeDay']);
  }
  return {
    type: CHANGE_THEME,
    theme: _theme,
  };
}
export function getTheme() {
  const theme = Cookies.get('wal-theme') || 'themeDay';
  return themes[theme] || themes['themeDay'];
}
