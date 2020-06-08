import * as T from './constants';
import context from 'whaleex/utils/service';

export const getUnlockList = (page = 0, size = 10) => {
  return async function(dispatch) {
    try {
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          remotePag: {
            current: number + 1,
            pageSize,
            total: totalElements,
            loading: true,
          },
        },
      });
      const { data } = await context.http.get(`/BUSINESS/api/whale/unlocking`, {
        page,
        size,
      });
      const { number, size: pageSize, totalElements } = data.result || {};
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          unlocklist: data.result.content || [],
          remotePag: {
            current: number + 1,
            pageSize,
            total: totalElements,
            loading: false,
          },
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
