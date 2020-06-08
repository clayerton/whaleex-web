import { fromJS } from 'immutable';
import { RESET_STATE, REFRESH_STATE } from './constants';

const initialState = fromJS({
  store: {},
});
const klineReducer = (state = initialState, action) => {
  switch (action.type) {
    case REFRESH_STATE: {
      const keys = Object.keys(action.data);
      return keys.reduce((tmpState, key) => {
        return tmpState.setIn(['store', key], fromJS(action.data[key]));
      }, state);
    }
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// export const adminSelector = state => state.get('pages').admin;

export default klineReducer;
