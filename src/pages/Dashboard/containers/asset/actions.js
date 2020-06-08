import * as T from './constants';
import { saveExpressIds } from 'whaleex/common/webCrypKey.js';
import { signWithdraw } from 'whaleex/common/webSign.js';
import { getNextIdList } from '../trade/actions.js';
import context from 'whaleex/utils/service';

export const getUserAsset = (
  convertMap_digital,
  legaldigital,
  callback,
  includeZero
) => {
  return async function(dispatch) {
    try {
      // dispatch(getTotalAsset(callback));
      dispatch(
        getAssetList(convertMap_digital, legaldigital, callback, includeZero)
      );
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const confirmWithdraw = (data, callBack) => {
  return async function(dispatch) {
    const {
      exEosAccount,
      params,
      currencyObj,
      userEosAccount,
      remark,
      userUniqKey,
    } = data;
    const { publicKey } = params;
    const signature = await U.signWithdraw(
      params,
      currencyObj,
      userEosAccount,
      exEosAccount,
      userUniqKey
    );
    params.signature = signature;
    try {
      const { data } = await context.http.post(
        `/BUSINESS/api/withdraw`,
        params
      );
      if (data.errorCode === 'E015' || data.errorCode === 'E029') {
        let dataIds = await getNextIdList({
          pk: publicKey,
          userUniqKey,
          remark,
        });
        let newExpressIds = dataIds.list;
        let _remark = dataIds.remark;
        let _expressId = newExpressIds.splice(0, 1)[0];
        dispatch(
          confirmWithdraw(
            {
              exEosAccount,
              params: { ...params, withdrawId: _expressId },
              currencyObj,
              userEosAccount,
              userUniqKey,
              remark,
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
      const { returnCode, message } = data;
      callBack && callBack(returnCode === '0', message);
      dispatch({
        type: T.REFRESH_STATE,
        data: {},
      });
    } catch (e) {
      callBack && callBack(false, 'withdraw fail.');
      return Promise.reject(e);
    }
  };
};
export const getAssetList = (
  convertMap_digital,
  legaldigital,
  callback,
  includeZero,
  page = 0,
  size = 100
) => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.get(`/BUSINESS/api/v2/multi/assets`, {
        includeZero,
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
        result: { list: assetList, wal, summary: totalAsset },
      } = data;
      callback && callback(_.get(totalAsset, 'withdrawNeedVerify'));
      if (assetList && assetList.content) {
        assetList.content = assetList.content.map(i => {
          const { currency, totalAmount = 0 } = i;
          return Object.assign({}, i, {
            convert_digital: Number(totalAmount) * convertMap_digital[currency],
            legaldigital,
          });
        });
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          assetList,
          wal,
          totalAsset,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
