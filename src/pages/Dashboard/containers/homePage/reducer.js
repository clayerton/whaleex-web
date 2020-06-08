import { fromJS } from 'immutable';
import * as T from './constants';
const initialState = fromJS({ store: {} });
const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case T.REFRESH_STATE: {
      const keys = Object.keys(action.data);
      return keys.reduce((tmpState, key) => {
        return tmpState.setIn(
          ['store', ...key.split('.')],
          fromJS(action.data[key])
        );
      }, state);
    }
    default:
      return state;
  }
};

// export const adminSelector = state => state.get('pages').admin;

export default Reducer;
