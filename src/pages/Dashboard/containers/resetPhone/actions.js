import { M } from 'whaleex/components';
import * as T from './constants';
import context from 'whaleex/utils/service';
import { message } from 'antd';
import Cookies from 'js-cookie';

export const sendSmsCode = (phone, type, callBack, formatMessage) => {
  return async function(dispatch) {
    try {
      const country = Cookies.get('country');
      const countryCode = JSON.parse(country || '{}').countryCode || 'CN';

      const { data } = await context.http.post(
        `/BUSINESS/api/user/public/smsCode`,
        {
          phone,
          type,
          countryCode,
        }
      );
      const { returnCode, message: msg } = data;
      if (returnCode !== '0') {
        message.warning(msg);
      } else {
        message.success(formatMessage({ id: 'resetPhone.messend' }));
      }
      callBack && callBack(`${returnCode}` === '0');
      dispatch({
        type: T.SEND_SMSCODE,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const confirmModify = (params, callBack) => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.post(
        `/BUSINESS/api/auth/phone/change`,
        params
      );
      const { returnCode, message: msg } = data;
      callBack && callBack(`${returnCode}` === '0', msg);
      dispatch({
        type: T.CONFIRM_MODIFY,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
