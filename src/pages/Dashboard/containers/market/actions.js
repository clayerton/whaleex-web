import * as T from './constants';
import context from 'whaleex/utils/service';
window.getMarketListTimer = undefined;
export function getMarketList() {
  clearTimeout(window.getMarketListTimer);

  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/public/symbol`);
      const publicSymbolObj = data.reduce((pre, cur, idx) => {
        const { id } = cur;
        pre[`${id}`] = cur;
        return pre;
      }, {});
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          publicSymbol: data,
          publicSymbolObj,
        },
      });
      window.getMarketListTimer = setTimeout(() => {
        dispatch(getMarketList());
      }, 2000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function getCoinList() {
  return new Promise(async reslove => {
    let { data } = await context.http.get(`/BUSINESS/api/public/currency`);
    let _data = data.filter(({ status }) => status === 'ON');
    reslove(_data);
  });
}

export function convertMapInMarket(legalTender) {
  //TODO 汇率轮询！
  return async function(dispatch) {
    try {
      const currencyList = await getCoinList();
      // for (let i = 0; i < coin.length; i++) {
      let [{ data }, { data: data2 }] = await Promise.all([
        context.http.get('/BUSINESS/api/public/global/price', {
          currency: currencyList.map(({ shortName }) => shortName).join(','),
          convert: 'EOS',
        }),
        context.http.get('/BUSINESS/api/public/global/price', {
          currency: 'EOS',
          convert: legalTender,
        }),
      ]);
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          convertMap: data2,
          convertMap_digital: data,
          currencyList,
          currencyListObj: currencyList.reduce((pre, cur) => {
            const { id, shortName } = cur;
            pre[id] = cur;
            pre[shortName.toUpperCase()] = cur;
            return pre;
          }, {}),
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
