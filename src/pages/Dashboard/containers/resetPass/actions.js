import * as T from './constants';
import context from 'whaleex/utils/service';
import { authBehavior } from 'whaleex/common/actions';
import { hashPassword } from 'whaleex/common/webSign.js';
import U from 'whaleex/utils/extends';
import { message } from 'antd';
import Cookies from 'js-cookie';

export const sendSmsCode = (phone, callBack, formatMessage) => {
  return async function(dispatch) {
    try {
      const country = Cookies.get('country');
      const countryCode = JSON.parse(country || '{}').countryCode || 'CN';
      if (countryCode !== 'CN' || Cookies.get('debug')) {
        if (_config.faceBookSms === '1') {
          try {
            U.facebookCodeSend(JSON.parse(country || '{}'), phone, r => {
              callBack && callBack(r);
            });
            dispatch({
              type: T.SEND_SMSCODE,
            });
            return;
          } catch (e) {
            console.log('facebook network error');
          }
        }
      }
      let authData = await authBehavior(() => {}, {
        phone,
        countryCode,
      });
      const { data } = await context.http.post(
        `/BUSINESS/api/user/public/smsCode`,
        {
          phone,
          type: 'pwdChange',
          countryCode,
          ...authData,
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
export const confirmModify = (params, callBack, needAuth) => {
  // {
  //   "googleCode": 785662,
  //   "password": "string",
  //   "phone": "string",
  //   "phoneCode": 785662
  // }
  return async function(dispatch) {
    // let authData = await authBehavior();
    // if (authData.success !== 1) {
    //   return;
    // }
    let authData = {};
    if (!!needAuth) {
      authData = await authBehavior(() => {}, needAuth);
      if (authData.success !== 1) {
        dispatch({
          type: T.CONFIRM_MODIFY_FAIL,
        });
        return;
      }
    }
    const { phone, password, phoneCode = '' } = params;
    try {
      const country = Cookies.get('country');
      const countryCode = JSON.parse(country || '{}').countryCode || 'CN';
      let facebookData = {};
      if (phoneCode.length > 10) {
        facebookData = {
          accountKitType: 'code',
          grant_type: 'account_kit',
          code: phoneCode,
          phoneCode: undefined,
        };
      }
      const { data } = await context.http.post(`/BUSINESS/api/auth/pwd/reset`, {
        phone,
        password: hashPassword(password),
        code: phoneCode,
        countryCode,
        ...authData,
        ...facebookData,
      });
      const { returnCode, message: msg } = data;
      if (returnCode === '1002') {
        dispatch(
          confirmModify(params, callBack, {
            type: 'auth1002',
            phone: params.phone,
          })
        );
        return;
      }
      if (returnCode !== '0') {
        message.warning(msg);
      }
      callBack && callBack(`${returnCode}` === '0');
      dispatch({
        type: T.CONFIRM_MODIFY,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
