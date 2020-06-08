import * as T from './constants';
import context from 'whaleex/utils/service';
import WsClient from 'whaleex/utils/service/ws.js';
import _ from 'lodash';
import U from 'whaleex/utils/extends';
import { saveExpressIds, getExpressIds } from 'whaleex/common/webCrypKey.js';

math.config({ number: 'BigNumber' });
import OrderUtils from './utils.js';
export const resetState = () => {
  return {
    type: T.RESET_STATE,
  };
};
export const clearTradeInfo = () => {
  return async function(dispatch) {
    dispatch({
      type: T.REFRESH_STATE,
      data: {
        deepData: {},
        orderBook: {},
        latestTrade: {},
        latestTradeList: [],
        baseAsset: {},
        quoteAsset: {},
        symbolMarket: {},
        delegate: {},
        delegatehistory: {},
        delegateexecHistory: {},
      },
    });
  };
};
/**
 * [initTradeInfo description]
 * @param  {[type]} paramSymbol  交易对对象
 * @param  {[type]} preOrderBook 前一个交易对的订单book
 * @param  {[type]} size 成交历史分页size
 */
export const initTradeInfo = (
  paramSymbol,
  preOrderBook,
  config = { size: 40, level: 100 },
  callBack
) => {
  const { size, level } = config;
  return async function(dispatch) {
    try {
      // dispatch(stopWebsocket());
      dispatch({
        type: T.REFRESH_STATE,
        data: { loadingOrderBook: true, symbol: paramSymbol },
      });
      dispatch(getDeepData(paramSymbol, level, 'orderBook', callBack));
      dispatch(getLatestTrade(paramSymbol, size));
      dispatch(getCurrencyIntro(paramSymbol));
      dispatch(getNewsList({ symbol: paramSymbol }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getCurrencyIntro = symbol => {
  // /api/public/currencyDetail?currencyName=EOS &currencyId
  const { baseCurrency, id: symbolId } = symbol;
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/currencyDetail`,
        {
          currencyName: baseCurrency,
        }
      );
      if (symbolId !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          currencyDetail: data.result,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
//深度图数据
export const getDepth = paramSymbol => {
  let symbolId = paramSymbol.id;
  return async function(dispatch) {
    try {
      let { data: deepData } = await context.http.get(
        `/BUSINESS/api/public/orderBookDepth/symbol/${symbolId}`
      );
      if (symbolId !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          deepData,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
// getDeepData 同时用作订单铺的数据显示
export const getDeepData = (paramSymbol, level = 100, key, callBack) => {
  let symbolId = paramSymbol.id;
  return async function(dispatch) {
    try {
      let { data: deepData } = await context.http.get(
        `/BUSINESS/api/public/orderBook/symbol/${symbolId}`,
        {
          level,
        }
      );
      if (symbolId !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      if (!deepData.asks) {
        deepData.asks = [];
      }
      if (!deepData.bids) {
        deepData.bids = [];
      }
      callBack && callBack({ asks: deepData.asks, bids: deepData.bids });
      if (key === 'orderBook') {
        dispatch({
          type: T.REFRESH_STATE,
          data: {
            orderBook: deepData,
            loadingOrderBook: false,
          },
        });
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          loadingOrderBook: false,
        },
      });
      // dispatch(getDepth(paramSymbol));
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          loadingOrderBook: false,
        },
      });
      return Promise.reject(e);
    }
  };
};
export const getLatestTrade = (paramSymbol, size) => {
  let symbolId = paramSymbol.id;
  return async function(dispatch) {
    try {
      let { data: latestTrade } = await context.http.get(
        `/BUSINESS/api/public/lastTrade`,
        { symbolId, size }
      );
      if (symbolId !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      dispatch(getWebsocket(paramSymbol, latestTrade));
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          latestTrade: latestTrade[0],
          latestTradeList: latestTrade,
          loadingOrderBook: false,
        },
      });
    } catch (e) {
      // dispatch(getWebsocket(paramSymbol, []));
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
export const getWebsocket = (paramSymbol, latestTrade = []) => {
  return function(dispatch) {
    try {
      sessionStorage.setItem('lastOrderBookUpdate', +new Date());
      // 开始订阅ws
      let timerT = { T: 0 };
      let timerT2 = { T: 0 };
      let timerT3 = { T: 0 };
      function getOrderBook(data) {
        if (paramSymbol.id !== window.curActiveSymbolId) {
          return;
        }
        U.throttle(
          1000,
          () => {
            // dispatch(getDepth(paramSymbol));
            dispatch(getSymbolMarket(paramSymbol));
            // dispatch(getDelegate(paramSymbol, 2));
          },
          timerT3
        )();
        U.throttle(
          500,
          () => {
            sessionStorage.setItem('lastOrderBookUpdate', +new Date());
            let result = {};
            let bids = [],
              asks = [];
            result.id = paramSymbol.id;
            let bidsResult = data.bids;
            if (bidsResult && bidsResult.length > 0) {
              bidsResult.forEach(item => {
                let a = item.split(':');
                bids.push({ price: a[0], quantity: a[1] });
              });
            }
            let asksResult = data.asks;
            if (asksResult && asksResult.length > 0) {
              asksResult.forEach(item => {
                let a = item.split(':');
                asks.push({ price: a[0], quantity: a[1] });
              });
            }
            result.bids = bids;
            result.asks = asks;
            result.lastUpdateId = data.lastUpdateId;
            dispatch({
              type: T.PONG_ORDER_BOOK,
              data: {
                orderBook: result,
                pingpong: true,
              },
            });
          },
          timerT
        )();
      }
      function getLastTrade(data) {
        if (paramSymbol.id !== window.curActiveSymbolId) {
          return;
        }
        const { bidAsk, price, quantity } = data;
        latestTrade.unshift(data);
        if (latestTrade.length > 600) {
          latestTrade = latestTrade.slice(0, 500);
        }
        console.log('tradeSubscribe', data);
        U.throttle(
          500,
          () => {
            dispatch({
              type: T.PONG_LATEST_TRADE,
              data: {
                latestTrade: { bidAsk, price, quantity },
                latestTradeList: latestTrade,
                pingpong: true,
              },
            });
          },
          timerT2
        )();
      }
      WsClient.startConnect([
        {
          key: 'orderBookSubscribe',
          path: `/${paramSymbol.name}@depth40`,
          callBack: data => {
            getOrderBook(data);
          },
        },
        {
          key: 'tradeSubscribe',
          path: `/${paramSymbol.name}@trade`,
          callBack: data => {
            getLastTrade(data);
          },
        },
        {
          key: 'userOrderBookSubscribe',
          path: `/user/${paramSymbol.name}@depth40`,
          callBack: data => {
            getOrderBook(data);
          },
        },
        {
          key: 'userTradeSubscribe',
          path: `/user/${paramSymbol.name}@trade`,
          callBack: data => {
            getLastTrade(data);
          },
        },
      ]);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const stopWebsocket = () => {
  WsClient.stopConnect();
  return { type: T.STOP_WS };
};
export const getWSState = callBack => {
  callBack(WsClient.readyState);
  return { type: T.ASK_WS };
};
/*
  获取手续费 获取 用户资产
 */
export const getUserAsset = symbol => {
  const { baseCurrency, quoteCurrency } = symbol;
  return async function(dispatch) {
    try {
      let [{ data: baseAsset }, { data: quoteAsset }] = await Promise.all([
        context.http.get(`/BUSINESS/api/user/asset`, {
          currency: baseCurrency,
        }),
        context.http.get(`/BUSINESS/api/user/asset`, {
          currency: quoteCurrency,
        }),
      ]);
      if (symbol.id !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      // 计算可用
      baseAsset.result.availableTotal = math.eval(
        `${baseAsset.result.total} - ${baseAsset.result.frozen}`
      );
      quoteAsset.result.availableTotal = math.eval(
        `${quoteAsset.result.total} - ${quoteAsset.result.frozen}`
      );
      dispatch({
        type: T.USER_ASSET,
        data: { baseAsset: baseAsset.result, quoteAsset: quoteAsset.result },
      });
    } catch (e) {
      dispatch({
        type: T.USER_ASSET,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
export const getUserFee = symbol => {
  return async function(dispatch) {
    try {
      const { data: feeRate } = await context.http.get(
        `/BUSINESS/api/symbol/feeRate`,
        { symbolId: symbol.id }
      );
      if (symbol.id !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      dispatch({
        type: T.USER_FEE,
        data: { feeRate },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
getMineStatus
 */
export const getMineStatus = async (symbolName, callback) => {
  const { data } = await context.http.get(`/BUSINESS/api/mine/limit`, {
    symbol: symbolName,
  });
  callback && callback(data.result);
  return _.get(data, 'result.limited', false);
};
/*
  提交委托订单
 */
export const submitDelegate = (params, callBack) => {
  return async function(dispatch) {
    let {
      sideMode,
      priceMode,
      price,
      quantity,
      userEosAccount,
      exEosAccount,
      symbol,
      currencyListObj,
      feeRate,
      expressId,
      publicKey,
      userUniqKey,
      currentStakeForAccount,
      remark,
    } = params;
    const mergeSymbol = U.mergeSymbol(currencyListObj, symbol);
    const orderTime = Math.floor(Date.now() / 1000);
    const orderMemo = U.createOrderMemo(
      userEosAccount,
      exEosAccount,
      mergeSymbol,
      sideMode,
      priceMode,
      price,
      quantity,
      feeRate,
      expressId,
      orderTime,
      currentStakeForAccount
    );
    try {
      const order = await U.createOrder(
        orderMemo,
        mergeSymbol,
        sideMode,
        priceMode,
        price,
        quantity,
        expressId,
        orderTime,
        feeRate,
        userUniqKey
      );

      const { data: latestDelegate } = await context.http.post(
        `/BUSINESS/api/order`,
        Object.assign({}, order, { publicKey, memo: currentStakeForAccount })
      );
      if (latestDelegate.errorCode === 'E015') {
        let dataIds = await getNextIdList({
          pk: publicKey,
          userUniqKey,
          remark,
        });
        let newExpressIds = dataIds.list;
        let _remark = dataIds.remark;
        dispatch(
          submitDelegate(
            {
              ...params,
              remark: _remark,
              expressId: newExpressIds.splice(0, 1)[0],
            },
            callBack
          )
        );
        saveExpressIds({
          userUniqKey,
          ids: newExpressIds,
          timestamp: Date.now(),
          remark: _remark,
        });
        return;
      }
      dispatch(getUserAsset(symbol)); //更新用户资产数据
      callBack && callBack(latestDelegate, expressId);
      dispatch({
        type: T.SUBMIT_DELEGATE,
        data: { latestDelegate },
      });
    } catch (e) {
      callBack && callBack({ result: e, errorCode: 'NETERROR' }, expressId);
      return Promise.reject(e);
    }
  };
};
export const submitDelegate2 = (params, callBack, waitBack, sendWait) => {
  return async function(dispatch) {
    let {
      sideMode,
      priceMode,
      price,
      quantity,
      userEosAccount,
      exEosAccount,
      symbol,
      currencyListObj,
      feeRate,
      expressId,
      publicKey,
      userUniqKey,
      currentStakeForAccount,
      remark,
    } = params;
    const mergeSymbol = U.mergeSymbol(currencyListObj, symbol);
    const orderTime = Math.floor(Date.now() / 1000);
    const orderMemo = U.createOrderMemo(
      userEosAccount,
      exEosAccount,
      mergeSymbol,
      sideMode,
      priceMode,
      price,
      quantity,
      feeRate,
      expressId,
      orderTime
    );
    try {
      const order = await U.createOrder(
        orderMemo,
        mergeSymbol,
        sideMode,
        priceMode,
        price,
        quantity,
        expressId,
        orderTime,
        feeRate,
        userUniqKey
      );
      if (sendWait) {
        waitBack && waitBack();
        await sendWait;
      }
      const { data: latestDelegate } = await context.http.post(
        `/BUSINESS/api/order`,
        Object.assign({}, order, { publicKey })
      );
      dispatch(getUserAsset(symbol)); //更新用户资产数据
      callBack && callBack(latestDelegate, expressId);
      dispatch({
        type: T.SUBMIT_DELEGATE,
        data: { latestDelegate },
      });
    } catch (e) {
      callBack && callBack({ result: e, errorCode: 'NETERROR' }, expressId);
      return Promise.reject(e);
    }
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
export const cancelOrder = (
  { orderId, symbol, publicKey, userUniqKey },
  callBack
) => {
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
      setTimeout(() => {
        dispatch(getUserAsset(symbol)); //更新用户资产数据
        dispatch(getDelegate(symbol, 2));
      }, 1000);
      // dispatch(getAllDelegate(symbol, 0, 100));
      callBack && callBack(data);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getNewsList = (params = {}, lastData = []) => {
  const { page = 0, size = 10, symbol } = params;
  return async function(dispatch) {
    try {
      const { data } = await context.http.get(
        `/BUSINESS/api/public/currencyNews?currencyName=${
          symbol.baseCurrency
        }&page=${page}&size=${size}`
      );
      let tmpList = lastData.concat(_.get(data.result, `content`, []));
      tmpList = _.sortBy(tmpList, [
        function(o) {
          return -o.onlineTime;
        },
      ]);
      tmpList = _.uniqBy(tmpList, 'id');
      dispatch({
        type: T.REFRESH_STATE,
        data: { news: { content: tmpList } },
      });
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
  activeTab_2,
  partition
) => {
  if (_.get(symbol, 'id') === 'all') {
    symbol.id = undefined;
  }
  return async function(dispatch) {
    try {
      [`${activeTab}`, `${activeTab_2}`].includes('0') &&
        dispatch(
          getDelegate(
            symbol,
            _.get(paginationPage, 'tabOpenOrder', 0),
            partition
          )
        );
      [`${activeTab}`, `${activeTab_2}`].includes('1') &&
        dispatch(
          getDelegateHistory(
            symbol,
            _.get(paginationPage, 'tabHistoryOrder', 0),
            partition
          )
        );
      dispatch(
        getExec(
          symbol,
          _.get(paginationPage, 'tabHistoryTrade', 0),
          'execHistory',
          partition
        )
      );
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
let mergeConfig3 = {};
export const getExec = (symbol, page, type, partition) => {
  let size = 20 * (page + 1) > 100 ? 100 : 20 * (page + 1);
  let api1 = `/BUSINESS/api/trade/time/cache`;
  let api2 = `/BUSINESS/api/trade/time/persist`;
  if (!_.isEmpty(symbol) && symbol.id) {
    api1 = `/BUSINESS/api/trade/history/cache`;
    api2 = `/BUSINESS/api/trade/history/persist`;
  }
  let param = {
    page: 0,
    size,
  };
  if (!_.isEmpty(symbol) && symbol.id) {
    param.symbolId = symbol.id;
  }
  return async function(dispatch) {
    let curTime = +new Date();
    let oneDay = 24 * 60 * 60 * 1000;
    let requestList = [
      () => {
        return context.http.get(
          api1,
          Object.assign({}, param, {
            startTime: curTime - oneDay,
            endTime: curTime,
            partition,
          })
        );
      },
      () => {
        return context.http.get(
          api2,
          Object.assign({}, param, {
            startTime: 0,
            endTime: curTime - oneDay,
            partition,
          })
        );
      },
    ];
    let mergePath = 'result.content';
    try {
      const order = await U.mergeFetcher(mergeConfig3)(requestList, {
        mergePath,
        curPage: 0,
        pageSize: size,
        uniqKey: i => {
          return `${i.orderId}${i.execId}`;
        },
      });
      if (symbol && symbol.id !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      if (_.get(order, 'result.content', []).length >= 100) {
        _.set(
          order,
          'result.content',
          _.get(order, 'result.content', []).concat(
            _.get(order, 'result.content', [])[0] || {}
          )
        );
      }
      dispatch({
        type: T.GET_DELEGATE,
        data: {
          [`delegate${type || ''}`]: (order.result && order.result) || order,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
let mergeConfig = {};
export const getDelegateHistory = (symbol, page, partition) => {
  let size = 20 * (page + 1) > 100 ? 100 : 20 * (page + 1);
  // 24h内trade， 24h外历史，融合 去重
  return async function(dispatch) {
    let param = {
      page: 0,
      size,
    };
    if (!_.isEmpty(symbol) && symbol.id) {
      param = Object.assign({}, param, { symbolId: symbol.id });
    }
    try {
      let curTime = +new Date();
      let oneDay = 24 * 60 * 60 * 1000;
      let requestList = [
        () => {
          return context.http.get(
            '/BUSINESS/api/order/history/cache',
            Object.assign({}, param, {
              startTime: curTime - oneDay,
              endTime: curTime,
              partition,
            })
          );
        },
        () => {
          return context.http.get(
            '/BUSINESS/api/order/history/persist',
            Object.assign({}, param, {
              startTime: 0,
              endTime: curTime - oneDay,
              partition,
            })
          );
        },
      ];
      let mergePath = 'content';
      const order = await U.mergeFetcher(mergeConfig)(requestList, {
        mergePath,
        curPage: 0,
        pageSize: size,
        uniqKey: i => {
          return `${i.orderId}${i.execId}`;
        },
      });
      if (symbol && symbol.id !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      if (_.get(order, 'content', []).length >= 100) {
        _.set(
          order,
          'content',
          _.get(order, 'content', []).concat(
            _.get(order, 'content', [])[0] || {}
          )
        );
      }
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
export const getDelegate = (symbol, page = 0, partition) => {
  let size = 20 * (page + 1) > 100 ? 100 : 20 * (page + 1);
  // 24h内trade， 24h外历史，融合 去重
  return async function(dispatch) {
    let param = {
      page: 0,
      size,
    };
    if (!_.isEmpty(symbol) && symbol.id) {
      param = Object.assign({}, param, { symbolId: symbol.id });
    }
    try {
      let curTime = +new Date();
      let oneDay = 24 * 60 * 60 * 1000;
      let requestList = [
        () => {
          return context.http.get(
            '/BUSINESS/api/order',
            Object.assign({}, param, {
              startTime: curTime - oneDay,
              endTime: curTime,
              partition,
            })
          );
        },
        () => {
          return context.http.get(
            '/BUSINESS/api/order',
            Object.assign({}, param, {
              startTime: 0,
              endTime: curTime - oneDay,
              partition,
            })
          );
        },
      ];
      let mergePath = 'content';
      const order = await U.mergeFetcher(mergeConfig2)(requestList, {
        mergePath,
        curPage: 0,
        pageSize: size,
        uniqKey: i => {
          return `${i.orderId}${i.execId}`;
        },
      });
      if (symbol && symbol.id !== window.curActiveSymbolId) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {},
        });
        return;
      }
      if (_.get(order, 'content', []).length >= 100) {
        _.set(
          order,
          'content',
          _.get(order, 'content', []).concat(
            _.get(order, 'content', [])[0] || {}
          )
        );
      }
      dispatch({
        type: T.GET_DELEGATE,
        data: { delegate: order },
      });
    } catch (e) {
      dispatch({
        type: T.GET_DELEGATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
/*
获取某交易对最新行情
 */
export const getSymbolMarket = symbol => {
  let api = `/BUSINESS/api/public/ticker/${symbol.id}`;
  return async function(dispatch) {
    try {
      const { data } = await context.http.get(api);
      if (symbol.id !== window.curActiveSymbolId) {
        dispatch({
          type: T.GET_SYMBOL_MARKET,
          data: {},
        });
        return;
      }
      dispatch({
        type: T.GET_SYMBOL_MARKET,
        data: { symbolMarket: data },
      });
    } catch (e) {
      dispatch({
        type: T.GET_SYMBOL_MARKET,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
/*
获取用于订单签名的Ids
 */
export const getNextIdList = async ({ pk, userUniqKey, remark }) => {
  try {
    let api = `/BUSINESS/api/user/v2/globalIds`;
    const { data } = await context.http.get(
      api,
      { pk, remark, size: 20 },
      {
        timeout: 5,
      }
    );
    return data.result || {};
  } catch (e) {
    console.log(e);
    return {};
  }
};
export const getNextId = ({ signIds, pk, userUniqKey, callBack }) => {
  return async function(dispatch) {
    let { ids = [], timestamp, remark } = await getExpressIds({ userUniqKey });
    let id = undefined;
    try {
      const newTimestamp = +new Date();
      let api = `/BUSINESS/api/user/v2/globalIds`;
      if (
        newTimestamp - timestamp > 50 * 60 * 1000 ||
        ids.length < 10 ||
        _.isEmpty(ids)
      ) {
        const { data } = await context.http.get(api, { pk, remark });
        ids = data.result.list;
        remark = data.result.remark;
        id = ids.shift();
        timestamp = newTimestamp;
      } else {
        id = ids.shift();
      }
      if (window.expressId === id) {
        id = ids.shift();
      }
      window.expressId = id;
      callBack && callBack(id, remark);
      saveExpressIds({ userUniqKey, ids, timestamp, remark });
      dispatch({
        type: T.GET_IDS,
        data: { signIds: { ids: {}, timestamp } },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getIds = ({ pk, userUniqKey }) => {
  let api = `/BUSINESS/api/user/v2/globalIds`;
  return async function(dispatch) {
    try {
      const timestamp = +new Date();
      const { data } = await context.http.get(
        api,
        { pk, size: 20 },
        {
          timeout: 20,
        }
      );
      console.log(data.result.list);
      if (data.result) {
        saveExpressIds({
          userUniqKey,
          ids: data.result.list,
          timestamp,
          remark: data.result.remark,
        });
      }
      // const ids = await getExpressIds({ userUniqKey });
      dispatch({
        type: T.GET_IDS,
        data: { signIds: { ids: {}, timestamp } },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
