import { fromJS } from 'immutable';
import * as T from './constants';

const initialState = fromJS({ store: {} });
const tradeReducer = (state = initialState, action) => {
  switch (action.type) {
    case T.PONG_ORDER_BOOK:
    case T.PONG_LATEST_TRADE:
    case T.USER_ASSET:
    case T.USER_FEE:
    case T.SUBMIT_DELEGATE:
    case T.GET_DELEGATE:
    case T.GET_SYMBOL_MARKET:
    case T.GET_IDS:
    case T.REFRESH_STATE: {
      const keys = Object.keys(action.data);
      return keys.reduce((tmpState, key) => {
        return tmpState.setIn(['store', key], fromJS(action.data[key]));
      }, state);
    }
    default:
      return state;
  }
};

// export const tradeSelector = state => state.get('pages').trade;

export default tradeReducer;
