import * as T from './constants';
import context from 'whaleex/utils/service';
export const getSecret = () => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.post(
        `/BUSINESS/api/auth/google/getKey`
      );
      const { returnCode, message: msg, result } = data;
      dispatch({
        type: T.GET_SECRET,
        data: { secretCode: result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const verifySecret = (code, callBack) => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.post(
        `/BUSINESS/api/auth/google/enable`,
        {
          googleCode: code,
          phone: '9999',
          phoneCode: '9999',
        }
      );
      // const { data } = await context.http.post(
      //   `/BUSINESS/api/auth/googleKey/verify`,
      //   {
      //     key: code,
      //   }
      // );
      const { returnCode, message: msg, result } = data;
      callBack && callBack(`${returnCode}` === '0', msg);
      dispatch({
        type: T.VERIFY_SECRET,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
// export const sendSmsCode = (phone, type, callBack) => {
//   return async function(dispatch) {
//     try {
//       const { data } = await context.http.post(
//         `/BUSINESS/api/user/public/smsCode`,
//         {
//           phone,
//           type,
//         }
//       );
//       const { returnCode, message: msg } = data;
//       if (returnCode !== '0') {
//         message.warning(msg);
//       } else {
//         message.success('短信发送成功');
//       }
//       callBack && callBack(`${returnCode}` === '0');
//       dispatch({
//         type: T.SEND_SMSCODE,
//       });
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   };
// };
// export const confirmModify = (params, callBack) => {
//   return async function(dispatch) {
//     try {
//       const { data } = await context.http.post(
//         `/BUSINESS/api/auth/phone/change`,
//         params
//       );
//       const { returnCode, message: msg } = data;
//       callBack && callBack(`${returnCode}` === '0', msg);
//       dispatch({
//         type: T.CONFIRM_MODIFY,
//       });
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   };
// };
