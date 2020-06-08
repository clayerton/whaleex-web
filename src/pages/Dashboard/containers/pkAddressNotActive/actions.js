import * as T from './constants';
import context from 'whaleex/utils/service';
export const getPkBinded = () => {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/account/pk/STORED`);
      if (data.returnCode !== '0') {
        message.warning(data.message);
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: { storedPks: data.result || [] },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
