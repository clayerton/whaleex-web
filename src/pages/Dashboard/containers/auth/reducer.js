import { fromJS } from 'immutable';
import { RESET_STATE, REFRESH_STATE, UPLOAD_PIC } from './constants';

const initialState = fromJS({
  store: {},
});
const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_PIC:
    case REFRESH_STATE: {
      const keys = Object.keys(action.data);
      return keys.reduce((tmpState, key) => {
        return tmpState.setIn(['store', key], fromJS(action.data[key]));
      }, state);
    }
    default:
      return state;
  }
};

// export const adminSelector = state => state.get('pages').admin;

export default adminReducer;
