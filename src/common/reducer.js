/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import * as types from './constants';

const initialState = {
  // data: { o: 999 },
  // navs: [],
  // permission: null,
  // commonProductCompare: [],
  // showCommonProductCompare: false,
  // commonGroupAccounts: [],
  // commonBenchmarks: [],
  // commonScenarios: [],
  // showPermissionExpired: false,
  // showPermissionExpiredIn7: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
    case types.USER_REGISTER:
      return {
        ...state,
        data: action.data,
      };
    case types.LOGOUT:
      return {
        ...initialState,
        countries: state.countries,
        countrieCodes: state.countrieCodes,
        isAlphaTest: state.isAlphaTest,
        TOKEN_DONE: state.TOKEN_DONE,
        publicSymbol: state.publicSymbol,
        publicSymbolObj: state.publicSymbolObj,
        publicQuotable: state.publicQuotable,
        currencyList: state.currencyList,
        currencyListObj: state.currencyListObj,
        allSymbolMarket: state.allSymbolMarket,
        withdrawFeeObj: state.withdrawFeeObj,
        symbolPartition: state.symbolPartition,
        subscription: state.subscription,
      };
    case types.TOKEN_DONE:
      return {
        ...state,
        TOKEN_DONE: true,
      };
    case types.REFRESH_PROPS:
    case types.REFRESH_PROPS_PAR:
    case types.REFRESH_PROPS_GET_CURRENCY:
    case types.GET_SUBSCRIPTION:
    case types.POST_SUBSCRIPTION:
    case types.DEL_SUBSCRIPTION:
      return {
        ...state,
        ...action.props,
      };
    case types.SET_USER_DATA:
      const { userData = {} } = state;
      return {
        ...state,
        userData: { ...userData, ...action.props },
      };
    // case types.CHECK_PERMISSION:
    //   return {
    //     ...state,
    //     navs: action.navs,
    //     permissions: action.permissions,
    //     permission: action.permissions,
    //     userInfo: action.userInfo,
    //     showPermissionExpired: action.showPermissionExpired,
    //     showPermissionExpiredIn7: action.showPermissionExpiredIn7,
    //     enableMofCardsLib: action.enableMofCardsLib,
    //   };
    // case types.PRINT_CARDS:
    //   const { printCards } = state;
    //   return {
    //     ...state,
    //     printCards: !printCards,
    //   };
    default:
      return state;
  }
}
