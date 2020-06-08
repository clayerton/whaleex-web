import context from 'whaleex/utils/service';
import { RESET_STATE, REFRESH_STATE } from './constants';
export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};
export const getKlineData = () => {
  return async function(dispatch) {
    try {
      dispatch({
        type: REFRESH_STATE,
        data: { loadingItems: true },
      });
      let { data } = await context.http.get(
        'http://echarts.baidu.com/examples/data/asset/data/stock-DJI.json'
      );
      dispatch({
        type: REFRESH_STATE,
        data: {
          data,
          loadingItems: false,
        },
      });
    } catch (e) {
      dispatch({
        type: REFRESH_STATE,
        data: {
          loadingItems: false,
        },
      });
      return Promise.reject(e);
    }
  };
};
