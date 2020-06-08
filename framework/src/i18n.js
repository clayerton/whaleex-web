/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import koLocaleData from 'react-intl/locale-data/ko';
import jaLocaleData from 'react-intl/locale-data/ja';
import frLocaleData from 'react-intl/locale-data/fr';
import { DEFAULT_LOCALE } from './containers/LanguageProvider/constants'; // eslint-disable-line
import enTranslationMessages from './translations/en.json';
import zhTranslationMessages from './translations/zh.json';
import koTranslationMessages from './translations/ko.json';
import jaTranslationMessages from './translations/ja.json';
import frTranslationMessages from './translations/fr.json';

addLocaleData([
  ...enLocaleData,
  ...zhLocaleData,
  ...koLocaleData,
  ...jaLocaleData,
  ...frLocaleData,
]);

//以下函数不再调用
export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, zhTranslationMessages)
      : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, { [key]: message });
  }, {});
};

//平铺对象
export const flatObj = (msg, crumb = []) => {
  let r = {};
  const keys = Object.keys(msg);
  keys.forEach(i => {
    crumb.push(i);
    if (typeof msg[i] === 'string') {
      r[crumb.join('.')] = msg[i];
    } else {
      Object.assign(r, flatObj(msg[i], crumb));
    }
    crumb.pop();
  });
  return r;
};
export const translationMessages = {
  en: flatObj(enTranslationMessages), //formatTranslationMessages('en', enTranslationMessages),
  zh: flatObj(zhTranslationMessages),
  ko: flatObj(koTranslationMessages),
  ja: flatObj(jaTranslationMessages),
  fr: flatObj(frTranslationMessages),
};
export const languages = [
  { key: 'zh', label: '简体中文' },
  { key: 'en', label: 'English' },
  // { key: 'ko', label: '한국어' },
  // { key: 'ja', label: '日本語' },
  // { key: 'fr', label: 'Français' },
];
