import { connect } from 'react-redux';

import { bindActionCreators, compose } from 'redux';
import { getConditions } from './trade.js';
export const preCondition = (type, app, history, extendData, callBack) => {
  let condition;
  const curConditions = getConditions({ history, extendData }).filter(
    ({ key }) => key.includes(type)
  );
  const allSatisfy = curConditions.every(
    ({ path, pathValue = false, confirm }) => {
      if (!!_.get(app, path) === pathValue) {
        condition = confirm;
        return false;
      }
      return true;
    }
  );
  if (allSatisfy) {
    return callBack;
  } else {
    return condition;
  }
};
export function mapStateToProps(state) {
  return state.get('app');
}

export const withConnect = connect(mapStateToProps);

export default compose(withConnect)(preCondition);
