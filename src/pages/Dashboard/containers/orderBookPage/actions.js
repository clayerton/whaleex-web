import * as T from './constants';
import context from 'whaleex/utils/service';
export const getAddress = () => {
  return async function(dispatch) {
    try {
      await context.http.get(`/BUSINESS/api/address/binding`); //主链地址绑定情况
      // await context.http.get(`/BUSINESS/api/currency/withdraw`); //根据最进提币排序
      // await context.http.get(`/BUSINESS/api/address/bind/status`);
      // await context.http.get(`/BUSINESS/api/address`);
      // await context.http.get(`/BUSINESS/api/currency/depositAddress`, {
      //   currencyId: 2,
      // }); // 充值地址
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getDeepData = (id, level = 100, callback) => {
  return async function(dispatch) {
    try {
      let { data: deepData } = await context.http.get(
        `/BUSINESS/api/public/orderBook/symbol/${id}`,
        {
          level: 100,
        }
      );
      callback && callback(deepData);
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
