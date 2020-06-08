import context from 'whaleex/utils/service';
import { RESET_STATE, REFRESH_STATE, GET_WITHDRAWDETAIL } from './constants';
export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};
window.getDepoDetailTimer = undefined;
export const getDepoDetail = id => {
  clearTimeout(window.getDepoDetailTimer);
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/account/withdraw/status/${id}`
      );
      dispatch({
        type: GET_WITHDRAWDETAIL,
        data: { statusObj: data.result } || {},
      });
      window.getDepoDetailTimer = setTimeout(() => {
        dispatch(getDepoDetail(id));
      }, 5000);
    } catch (e) {
      dispatch({
        type: REFRESH_STATE,
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
        type: REFRESH_STATE,
        data: { coinFee: data },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
