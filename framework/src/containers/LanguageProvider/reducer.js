/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';

import { CHANGE_LOCALE, DEFAULT_LOCALE, CHANGE_THEME } from './constants';

const initialState = fromJS({
  locale: undefined,
});

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state.set('locale', action.locale);
    case CHANGE_THEME:
      return state.set('theme', action.theme);
    default:
      return state;
  }
}

export default languageProviderReducer;
