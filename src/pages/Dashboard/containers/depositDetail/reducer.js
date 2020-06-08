import { fromJS } from 'immutable';
import { RESET_STATE, REFRESH_STATE, GET_WITHDRAWDETAIL } from './constants';

const initialState = fromJS({});
const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WITHDRAWDETAIL:
    case REFRESH_STATE: {
      const keys = Object.keys(action.data);
      return keys.reduce((tmpState, key) => {
        return tmpState.setIn(['store', key], fromJS(action.data[key]));
      }, state);
    }
    case RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
};

// export const adminSelector = state => state.get('pages').admin;

export default adminReducer;
