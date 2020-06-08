import * as T from './constants';
import context from 'whaleex/utils/service';

export const getUserAsset = (convertMap_digital, legaldigital, pagination) => {
  return async function(dispatch) {
    try {
      // dispatch(getTotalAsset());
      dispatch(getAssetList(convertMap_digital, legaldigital));
      dispatch(getPositionWal(pagination));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

//持仓 fixedType
export const getFixedType = () => {
  return async function(dispatch) {
    try {
      let { data: fixedType } = await context.http.get(
        `/BUSINESS/api/v2/fixedAsset/reasons`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          fixedType: fixedType.result,
        },
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

export const getPositionWal = pagination => {
  return async function(dispatch) {
    const { current, pageSize } = pagination;
    try {
      const { data: positionWal } = await context.http.get(
        `/BUSINESS/api/whale/earnings`,
        {
          current: current - 1,
          pageSize,
        }
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          earnings: _.get(positionWal, 'result', positionWal),
          pagination: {
            ...pagination,
            total: positionWal.result.totalElements,
          },
        },
      });
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
