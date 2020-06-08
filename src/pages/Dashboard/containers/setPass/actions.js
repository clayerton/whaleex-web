import * as T from './constants';
import context from 'whaleex/utils/service';
import { authBehavior } from 'whaleex/common/actions';
import { message } from 'antd';
import { hashPassword } from 'whaleex/common/webSign.js';

import Cookies from 'js-cookie';

export const sendSmsCode = (phone, callBack, formatMessage) => {
  return async function(dispatch) {
    try {
      const country = Cookies.get('country');
      const countryCode = JSON.parse(country || '{}').countryCode || 'CN';
      const { data } = await context.http.post(
        `/BUSINESS/api/user/public/smsCode`,
        {
          phone,
          type: 'pwdChange',
          countryCode,
        }
      );
      const { returnCode, message: msg } = data;
      if (returnCode !== '0') {
        message.warning(msg);
      } else {
        message.success(formatMessage({ id: 'resetPass.messendsuccess' }));
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
    let authData = {}; //await authBehavior();
    // if (authData.success !== 1) {
    //   return;
    // }
    const { password } = params;
    try {
      const { data } = await context.http.post(`/BUSINESS/api/auth/pwd/set`, {
        password: hashPassword(password),
      });
      const { returnCode, message: msg } = data;
      callBack && callBack(`${returnCode}` === '0');
      if (returnCode !== '0') {
        message.warning(msg);
        return;
      }
      dispatch({
        type: T.CONFIRM_MODIFY,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
