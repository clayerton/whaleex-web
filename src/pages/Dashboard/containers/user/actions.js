import * as T from './constants';
import context from 'whaleex/utils/service';
import { message } from 'antd';
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
