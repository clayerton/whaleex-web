import { combineReducers } from 'redux';
import klineChartReducer from './containers/klineChart/reducer';
import tradeReducer from './containers/trade/reducer';
import assetReducer from './containers/asset/reducer';
import depoWithListReducer from './containers/depoWithList/reducer';
// import addressReducer from './containers/address/reducer';
import tradeDetailReducer from './containers/tradeDetail/reducer';
import userReducer from './containers/user/reducer';
import authReducer from './containers/auth/reducer';
import inviteReducer from './containers/invite/reducer';
import resetGoogleReducer from './containers/resetGoogle/reducer';
import pkAddressReducer from './containers/pkAddress/reducer';
import depoWithDetailReducer from './containers/depoWithDetail/reducer';
import depositDetailReducer from './containers/depositDetail/reducer';
import orderBookPageReducer from './containers/orderBookPage/reducer';
import homePageReducer from './containers/homePage/reducer';
import positionLockReducer from './containers/positionLock/reducer';
import positionUnlockReducer from './containers/positionUnlock/reducer';
import positionUnlockListReducer from './containers/positionUnlockList/reducer';
import positionListReducer from './containers/positionList/reducer';
import chainStatusReducer from './containers/chainStatus/reducer';
import pkAddressNotActiveReducer from './containers/pkAddressNotActive/reducer';
import depoWithPageReducer from './containers/depoWithPage/reducer';
import marketReducer from './containers/market/reducer';
import stepPageReducer from './containers/stepPage/reducer';
import stakeForReducer from './containers/stakeFor/reducer';

export default combineReducers({
  klineChart: klineChartReducer,
  trade: tradeReducer,
  asset: assetReducer,
  depoWithList: depoWithListReducer,
  // address: addressReducer,
  tradeDetail: tradeDetailReducer,
  user: userReducer,
  auth: authReducer,
  invite: inviteReducer,
  resetGoogle: resetGoogleReducer,
  pkAddress: pkAddressReducer,
  depoWithDetail: depoWithDetailReducer,
  depositDetail: depositDetailReducer,
  orderBookPage: orderBookPageReducer,
  homePage: homePageReducer,
  positionLock: positionLockReducer,
  positionUnlock: positionUnlockReducer,
  positionUnlockList: positionUnlockListReducer,
  positionList: positionListReducer,
  chainStatus: chainStatusReducer,
  pkAddressNotActive: pkAddressNotActiveReducer,
  depoWithPage: depoWithPageReducer,
  market: marketReducer,
  stepPage: stepPageReducer,
  stakeFor: stakeForReducer,
});
