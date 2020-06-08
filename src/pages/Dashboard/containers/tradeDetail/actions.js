import * as T from './constants';

import U from 'whaleex/utils/extends';
import context from 'whaleex/utils/service';
export const getAddress = () => {
  return async function(dispatch) {
    try {
      // await context.http.get(`/BUSINESS/api/address/binding`); //主链地址绑定情况
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
        // data: { depositList, withdrawList },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const refreshProps = () => {
  return {
    type: T.REFRESH_STATE,
    data: {
      time: +new Date(),
      delegate: {},
      delegatehistory: {},
      delegateexecHistory: {},
    },
  };
};
function needSignature(orderId) {
  return false;
  //每次调用login 成功后，将 orderCancelAllowed 置为false
  let allowed = sessionStorage.getItem('orderCancelAllowed');
  return !(allowed === 'true');
}
/*
撤销委托
 */
export const cancelOrder = ({ orderId, publicKey, userUniqKey }, callBack) => {
  return async function(dispatch) {
    try {
      let signature;
      if (needSignature(orderId)) {
        console.log('cancelOrder sign');
        signature = await U.signCancelOrder(orderId, userUniqKey);
      }
      const { data } = await context.http.post(`/BUSINESS/api/order/cancel`, {
        orderId,
        publicKey,
        signature,
      });
      const returnCode = _.get(data, 'returnCode');
      if (returnCode === '0') {
        sessionStorage.setItem('orderCancelAllowed', 'true');
      } else {
        sessionStorage.setItem('orderCancelAllowed', 'false');
      }
      // dispatch(getDelegate());
      // dispatch(getAllDelegate(symbol, 0, 100));
      setTimeout(() => {
        callBack && callBack(data);
      }, 1000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getFirstPageDelegate = (symbol, activeTab, tabsData) => {
  if (_.get(symbol, 'id') === 'all') {
    symbol.id = undefined;
  }
  return async function(dispatch) {
    try {
      `${activeTab}` === '0' &&
        dispatch(
          getDelegate(1, symbol, 0, _.get(tabsData, 'tabOpenOrder', {}))
        );
      `${activeTab}` === '1' &&
        dispatch(
          getDelegateHistory(
            1,
            symbol,
            0,
            _.get(tabsData, 'tabHistoryOrder', {})
          )
        );
      `${activeTab}` === '2' &&
        dispatch(getExec(1, symbol, 0, _.get(tabsData, 'tabHistoryTrade', {})));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
  获取当前委托和历史委托 以及 历史成交
 */
export const getAllDelegate = (
  symbol,
  paginationPage,
  callBack,
  activeTab,
  tabsData
) => {
  if (_.get(symbol, 'id') === 'all') {
    symbol.id = undefined;
  }
  return async function(dispatch) {
    try {
      `${activeTab}` === '0' &&
        dispatch(
          getDelegate(
            false,
            symbol,
            _.get(paginationPage, 'tabOpenOrder', 0),
            _.get(tabsData, 'tabOpenOrder', {}),
            callBack
          )
        );
      `${activeTab}` === '1' &&
        dispatch(
          getDelegateHistory(
            false,
            symbol,
            _.get(paginationPage, 'tabHistoryOrder', 0),
            _.get(tabsData, 'tabHistoryOrder', {}),
            callBack
          )
        );
      `${activeTab}` === '2' &&
        dispatch(
          getExec(
            false,
            symbol,
            _.get(paginationPage, 'tabHistoryTrade', 0),
            _.get(tabsData, 'tabHistoryTrade', {}),
            callBack
          )
        );
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getDelegateById = (id, delegates = {}) => {
  let api = `/BUSINESS/api/trade`;
  return async function(dispatch) {
    try {
      const { data: order } = await context.http.get(api, { orderId: id });
      delegates[id] = order.result || [];
      const execOrderId = {};
      delegates[id].map(i => {
        return Object.assign(execOrderId, { exec: i.execId });
      });
      dispatch({
        type: T.GET_DELEGATE,
        data: {
          delegatesById: delegates,
          execOrder: execOrderId,
          delegatesByIdTime: +new Date(),
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
let mergeConfig3 = {};
export const getExec = (
  firstPage,
  symbol,
  page = 0,
  lastData = {},
  callBack
) => {
  let size = 20;
  let api1 = `/BUSINESS/api/trade/time/cache`;
  let api2 = `/BUSINESS/api/trade/time/persist`;
  if (!_.isEmpty(symbol) && symbol.id) {
    api1 = `/BUSINESS/api/trade/history/cache`;
    api2 = `/BUSINESS/api/trade/history/persist`;
  }
  let param = {
    page,
    size,
  };
  if (!_.isEmpty(symbol) && symbol.id) {
    param.symbolId = symbol.id;
  }
  return async function(dispatch) {
    let curTime = +new Date();
    let oneDay = 24 * 60 * 60 * 1000;
    let requestList = [
      newParam => {
        return context.http.get(
          api1,
          Object.assign(
            {},
            { ...param, ...newParam },
            {
              startTime: curTime - oneDay,
              endTime: curTime,
            }
          )
        );
      },
      newParam => {
        return context.http.get(
          api2,
          Object.assign(
            {},
            { ...param, ...newParam },
            {
              startTime: 0,
              endTime: curTime - oneDay,
            }
          )
        );
      },
    ];
    let mergePath = 'result.content';
    try {
      const order = await U.mergeFetcher(mergeConfig3)(requestList, {
        mergePath,
        curPage: page,
        pageSize: size,
        uniqKey: i => {
          return `${i.orderId}${i.execId}`;
        },
      });
      if (firstPage) {
        order.result.content = _.uniqBy(
          (order.result.content || []).concat(
            _.get(lastData, 'content', []) || []
          ),
          i => {
            return `${i.orderId}${i.execId}`;
          }
        );
      } else {
        order.result.content = _.uniqBy(
          _.get(lastData, 'content', []).concat(order.result.content || []),
          i => {
            return `${i.orderId}${i.execId}`;
          }
        );
      }
      callBack && callBack();
      dispatch({
        type: T.GET_DELEGATE,
        data: {
          delegateexecHistory: order.result,
        },
      });
    } catch (e) {
      callBack && callBack();
      return Promise.reject(e);
    }
  };
};
let mergeConfig = {};
export const getDelegateHistory = (
  firstPage,
  symbol,
  page = 0,
  lastData = {},
  callBack
) => {
  let size = 20;
  return async function(dispatch) {
    let param = {
      page,
      size,
    };
    if (!_.isEmpty(symbol) && symbol.id) {
      param = Object.assign({}, param, { symbolId: symbol.id });
    }
    try {
      let curTime = +new Date();
      let oneDay = 24 * 60 * 60 * 1000;
      let requestList = [
        newParam => {
          return context.http.get(
            '/BUSINESS/api/order/history/cache',
            Object.assign(
              {},
              { ...param, ...newParam },
              {
                startTime: curTime - oneDay,
                endTime: curTime,
              }
            )
          );
        },
        newParam => {
          return context.http.get(
            '/BUSINESS/api/order/history/persist',
            Object.assign(
              {},
              { ...param, ...newParam },
              {
                startTime: 0,
                endTime: curTime - oneDay,
              }
            )
          );
        },
      ];
      let mergePath = 'content';
      const order = await U.mergeFetcher(mergeConfig)(requestList, {
        mergePath,
        curPage: page,
        pageSize: size,
        uniqKey: 'orderId',
        uniqKey: i => {
          return `${i.orderId}${i.execId}`;
        },
      });
      if (firstPage) {
        order.content = _.uniqBy(
          (order.content || []).concat(lastData.content || []),
          i => {
            return `${i.orderId}${i.execId}`;
          }
        ).map((i, idx) => {
          return Object.assign({}, i, { uninId: idx });
        });
      } else {
        order.content = _.uniqBy(
          (lastData.content || []).concat(order.content || []),
          i => {
            return `${i.orderId}${i.execId}`;
          }
        ).map((i, idx) => {
          return Object.assign({}, i, { uninId: idx });
        });
      }
      callBack && callBack();

      dispatch({
        type: T.GET_DELEGATE,
        data: { delegatehistory: order },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
let mergeConfig2 = {};
export const getDelegate = (
  firstPage,
  symbol,
  page = 0,
  lastData = {},
  callBack
) => {
  page = firstPage ? 0 : page;
  let size = 20;
  let api = `/BUSINESS/api/order`;
  return async function(dispatch) {
    let param = {
      page,
      size,
    };
    if (!_.isEmpty(symbol) && symbol.id) {
      param = Object.assign({}, param, { symbolId: symbol.id });
    }
    try {
      let curTime = +new Date();
      let oneDay = 24 * 60 * 60 * 1000;
      let requestList = [
        newParam => {
          return context.http.get(
            '/BUSINESS/api/order',
            Object.assign(
              {},
              { ...param, ...newParam },
              {
                startTime: curTime - oneDay,
                endTime: curTime,
              }
            )
          );
        },
        newParam => {
          return context.http.get(
            '/BUSINESS/api/order',
            Object.assign(
              {},
              { ...param, ...newParam },
              {
                startTime: 0,
                endTime: curTime - oneDay,
              }
            )
          );
        },
      ];
      let mergePath = 'content';
      const order = await U.mergeFetcher(mergeConfig2)(requestList, {
        mergePath,
        curPage: page,
        pageSize: size,
        uniqKey: i => {
          return `${i.orderId}${i.execId}`;
        },
      });
      if (firstPage) {
        order.content = _.uniqBy(
          (order.content || []).concat(lastData.content || []),
          i => {
            return `${i.orderId}${i.execId}`;
          }
        );
      } else {
        order.content = _.uniqBy(
          (lastData.content || []).concat(order.content || []),
          i => {
            return `${i.orderId}${i.execId}`;
          }
        );
      }
      callBack && callBack();
      dispatch({
        type: T.GET_DELEGATE,
        data: { delegate: order },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const clearData = () => {
  return async function(dispatch) {
    dispatch({
      type: T.GET_DELEGATE,
      data: { delegate: {}, delegatehistory: {}, delegateexecHistory: {} },
    });
  };
};
