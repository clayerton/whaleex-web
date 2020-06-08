import * as T from './constants';
import context from 'whaleex/utils/service';
//1. unmount action   dispatch({
//   type: T.REFRESH_STATE,
//   data: { statusObj: {} },
// });
// 2. 强依赖， id=>进度   交易对=>价格
// 上链进度
export const getChainDetail = (type, id) => {
  return async function(dispatch) {
    try {
      let { data = {} } = await context.http.get(`/BUSINESS/api/trade/chain`, {
        execId: id,
      });
      dispatch({
        type: T.REFRESH_STATE,
        data: { [`statusObj.${type}.${id}`]: data.result },
        // data: { statusObj: data.result },
      });
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};

// 充值进度
// window.getDepoDetail__Timer = undefined;
export const getDeposit = (type, id) => {
  clearTimeout(window.getDepoDetail__Timer);

  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/account/deposit/status/${id}`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: { [`statusObj.${type}.${id}`]: data.result } || {},
      });
      // window.getDepoDetail__Timer = setTimeout(() => {
      //   dispatch(getDeposit(id));
      // }, 5000);
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};

// 提现进度
// window.getDepoDetailTimer = undefined;

export const getWithDraw = (type, id) => {
  // clearTimeout(window.getDepoDetailTimer);
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/account/withdraw/status/${id}`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: { [`statusObj.${type}.${id}`]: data.result } || {},
      });
      // window.getDepoDetailTimer = setTimeout(() => {
      //   dispatch(getWithDraw(id));
      // }, 5000);
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};

function getCoinList() {
  //CNY RMB; USD DOLLAR
  return new Promise(async (resolve, reject) => {
    let { data } = await context.http.get(`/BUSINESS/api/public/currency`);
    let coin = [];
    for (let i = 0; i < data.length; i++) {
      coin.push(data[i].shortName);
    }
    resolve(coin);
  });
}

export function convertMap(legalTender) {
  //TODO 汇率轮询！
  return async function(dispatch) {
    try {
      const coin = await getCoinList();
      let datas = [];

      // for (let i = 0; i < coin.length; i++) {
      let { data } = await context.http.get(
        '/BUSINESS/api/public/global/price',
        {
          currency: coin.join(','),
          convert: legalTender,
        }
      );
      datas.push(data);
      dispatch({
        type: T.REFRESH_STATE,
        data: { coinFee: data },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
