import context from 'whaleex/utils/service';
import { message } from 'antd';
import { RESET_STATE, REFRESH_STATE, UPLOAD_PIC } from './constants';
// export const uploadPic = a => {
//   return {
//     type: REFRESH_STATE,
//     data: { a },
//   };
// };
export const uploadPic = (data1, callback) => {
  const { field, file, formatMessage } = data1;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', field);
  return async function(dispatch) {
    try {
      dispatch({
        type: UPLOAD_PIC,
        data: { ['buttonLoading-' + field]: true },
      });
      let { data } = await context.http.post(
        `/BUSINESS/api/auth/upload/${field}`,
        formData,
        {
          timeout: 24 * 60 * 60 * 1000,
        }
      );
      callback && callback([data.result, data.returnCode]);
      dispatch({
        type: UPLOAD_PIC,
        data: { ['buttonLoading-' + field]: false },
      });
    } catch (e) {
      // status 413图片体积太大
      //console.log(e, e.response);
      message.error(formatMessage({ id: 'auth.networkErr' }));
      callback(false);
      dispatch({
        type: UPLOAD_PIC,
        data: { ['buttonLoading-' + field]: false },
      });
      return Promise.reject(e);
    }
  };
};
export const chinaKyc = ({ idCard, name, location, callback }) => {
  return async function(dispatch) {
    try {
      let { data } = await context.http.post(
        `/BUSINESS/api/auth/idCard/China`,
        {
          idCard,
          name,
          location,
        }
      );
      callback(data);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const faceStatus = callback => {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/auth/faceId/status`);
      dispatch({
        type: REFRESH_STATE,
        data: {
          faceResult: data.result,
        },
      });
      callback(data.result);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export const getCountry = callback => {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/public/countries`);
      callback(data.result);
    } catch (e) {
      dispatch({
        type: REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
export const submit = (message, callback) => {
  return async function(dispatch) {
    try {
      let { data } = await context.http.post(
        `/BUSINESS/api/auth/idCard`,
        message
      );
      if (data.returnCode !== '0') {
        const { message: msg } = data;
        message.warning(msg);
      }
      callback(data.returnCode);
    } catch (e) {
      dispatch({
        type: REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
