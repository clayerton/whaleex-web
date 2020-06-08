import { fromJS } from 'immutable';
import { RESET_STATE } from './constants';

const initialState = fromJS({
  a: 1231,
});
const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_STATE:
      return initialState.set('b', 999);
    default:
      return state;
  }
};

// export const adminSelector = state => state.get('pages').admin;

export default adminReducer;
