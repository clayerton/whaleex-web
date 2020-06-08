import * as T from './constants';
import context from 'whaleex/utils/service';
import { message } from 'antd';

export const getUserAsset = (convertMap_digital, legaldigital) => {
  return async function(dispatch) {
    try {
      // dispatch(getTotalAsset());
      dispatch(getAssetList(convertMap_digital, legaldigital));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getAssetList = (
  convertMap_digital,
  legaldigital,
  page = 0,
  size = 100
) => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.get(`/BUSINESS/api/v2/user/assets`, {
        page,
        size,
      });

      if (data.returnCode !== '0') {
        dispatch({
          type: T.REFRESH_STATE,
          data: { assetList: { error: 'error' }, wal: { error: 'error' } },
        });
        return;
      }
      const {
        result: { list: assetList, wal },
      } = data;
      if (assetList && assetList.content) {
        assetList.content = assetList.content.map(i => {
          const { currency, totalAmount } = i;
          return Object.assign({}, i, {
            convert_digital: totalAmount * convertMap_digital[currency],
            legaldigital,
          });
        });
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: { assetList, wal },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const LockAsset = (amount, callBack) => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.post(`/BUSINESS/api/whale/unlock`, {
        amount,
      });
      const { returnCode, message } = data;
      callBack(returnCode === '0');
      if (returnCode === '1') {
        message.error(message);
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
    } catch (e) {
      callBack(false);
      return Promise.reject(e);
    }
  };
};
