import axios from 'axios';
import _ from 'lodash';
import { getConfig } from './config';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.response.use(
  (response) => {
    const code = _.get(response, 'data.code');

    if (code === -403) {
      location.href = getConfig(
        'login_url',
        `?RelayState=${encodeURIComponent(location.href)}`
      );
    }

    return response;
  },
  (error) => Promise.reject(error)
);

const defaultParser = (data) =>
  new Promise((resolve, reject) => {
    if (data.code === 1) {
      resolve(data.data);
    }

    reject(data);
  });

export const callApi = (endpoint, options) =>
  axios(endpoint, options)
    .then((response) => response.data)
    .then(options.parser || defaultParser)
    .then(
      (response) => ({ response }),
      (error) => ({ error: error.message || 'Something bad happened' })
    );

// 卡片操作相关
const cardBaseURL = getConfig('usermaster_api', '/card/preference/user/');
const getCardEndpoint = (key, subKey) =>
  `/${key}${subKey ? `/${subKey}` : ''}.json`;

// 获取卡片面板集合或卡片集合
export const getValueByKey = ({ key, subKey }) => {
  const parser = (data) =>
    new Promise((resolve, reject) => {
      if (data.code === 0) {
        try {
          resolve(JSON.parse(data.content));
        } catch (e) {
          reject(data);
        }
      }
      reject(data);
    });

  return callApi(getCardEndpoint(key, subKey), {
    baseURL: cardBaseURL,
    parser,
  });
};

// 新增卡片面板集合或卡片集合
export const postValueByKey = ({ key, subKey, value }) => {
  const parser = (data) =>
    new Promise((resolve, reject) => {
      if (data.code === 0) {
        resolve(data);
      }
      reject(data);
    });

  return callApi(getCardEndpoint(key, subKey), {
    method: 'post',
    baseURL: cardBaseURL,
    parser,
    data: { value: JSON.stringify(value) },
  });
};

// 修改卡片面板集合或者卡片集合
export const putValueByKey = ({ key, subKey, value }) => {
  const parser = (data) =>
    new Promise((resolve, reject) => {
      if (data.code === 0) {
        resolve(data);
      }
      reject(data);
    });

  return callApi(getCardEndpoint(key, subKey), {
    method: 'put',
    baseURL: cardBaseURL,
    parser,
    data: { value: JSON.stringify(value) },
  });
};

export const deleteValueByKey = ({ key, subKey }) => {
  const parser = (data) =>
    new Promise((resolve, reject) => {
      if (data.code === 0) {
        resolve(data);
      }
      reject(data);
    });

  return callApi(getCardEndpoint(key, subKey), {
    method: 'delete',
    baseURL: cardBaseURL,
    parser,
  });
};
