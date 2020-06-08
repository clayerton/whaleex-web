import * as T from './constants';
import context from 'whaleex/utils/service';
import { getQuery } from './typeOptions.js';

//可用区、持仓区 select
export const getSelectType = () => {
  return async function(dispatch) {
    try {
      let [{ data: liquidType }, { data: fixedType }] = await Promise.all([
        context.http.get(`/BUSINESS/api/v2/liquidAsset/reasons`),
        context.http.get(`/BUSINESS/api/v2/fixedAsset/reasons`),
      ]);
      if (!Array.isArray(liquidType.result)) {
        liquidType.result = Object.keys(liquidType.result).map(key => {
          return { reason: key, i18n: liquidType.result[key] };
        });
        fixedType.result = Object.keys(fixedType.result).map(key => {
          return { reason: key, i18n: fixedType.result[key] };
        });
      }
      dispatch({
        type: T.REFRESH_STATE,
        data:
          {
            selectType: {
              liquidAsset: liquidType.result,
              fixedAsset: fixedType.result,
            },
          } || {},
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

export const getDepowithList = params => {
  return async function(dispatch) {
    try {
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          tableLoading: true,
        },
      });
      const { assetType, currency, reasons, needOrder, pagination } = params;
      const { current, pageSize } = pagination;
      const { data: depositList } = await context.http.get(
        `BUSINESS/api/${assetType}/records?page=${current -
          1}&size=${pageSize}&currency=${currency}&reasons=${reasons}&needOrder=${needOrder}`
      );

      dispatch({
        type: T.REFRESH_STATE,
        data: {
          depositList: depositList.result,
          pagination: {
            ...pagination,
            total: depositList.result.totalElements,
          },
          tableLoading: false,
        },
      });
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          tableLoading: false,
        },
      });
      return Promise.reject(e);
    }
  };
};
