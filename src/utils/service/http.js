import axios from 'axios';
import Qs from 'qs';
import U from 'whaleex/utils/extends';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
axios.defaults.timeout = 120000;
axios.defaults.baseURL = _config.app_api;
axios.defaults.withCredentials = true;
window.apiCache = [];
// http请求拦截器1
axios.interceptors.request.use(
  config => {
    if (config.url.includes('globalIds')) {
      debugger;
    }
    if (
      config.method === 'post' &&
      config.url.indexOf('/UAA/oauth/token') >= 0
    ) {
      config.data = Qs.stringify(config.data);
    }
    let timer = new Date().getTime();
    if (config.url.indexOf('?') > 0) {
      config.url += `&lang=${U.getUserLan()}&utm_source=web`;
    } else {
      config.url += `?lang=${U.getUserLan()}&utm_source=web`;
    }
    if (config.method === 'get') {
      if (window.apiCache.includes(encodeURIComponent(config.url))) {
        config.url += `&timestamp=${parseInt(timer / 2000) * 2000}`;
      } else {
        if (window.apiCache.length > 500) {
          window.apiCache = [];
        }
        window.apiCache.push(encodeURIComponent(config.url));
        config.url += `&timestamp=${parseInt(timer / 5000) * 5000}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// http响应拦截器
axios.interceptors.response.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

class HttpService {
  async request(method, url, ...args) {
    return axios[method](url, ...args)
      .then(response => {
        if (url.includes('globalIds')) {
          console.log(response.config);
        }
        return Promise.resolve(response);
      })
      .catch(function(error) {
        if (url.includes('globalIds')) {
          console.log(error);
        }
        if (_.get(error, 'response.data.returnCode')) {
          if (+_.get(error, 'response.data.returnCode') === 401) {
            const userLan = U.getUserLan();
            const user = sessionStorage.getItem('user') || '';
            const lastOrderBookUpdate =
              sessionStorage.getItem('lastOrderBookUpdate') || +new Date();
            let suffix = user.slice(-5);
            window['walGuideModal' + suffix] = undefined;
            clearTimeout(window.AutoReceiveWalModalTimer);
            sessionStorage.clear();
            sessionStorage.setItem(
              'userLan',
              ((userLan === 'null' || !userLan) && 'zh') || userLan
            );
            sessionStorage.setItem('lastOrderBookUpdate', lastOrderBookUpdate);
            if (!U.noJumpPage()) {
              window.walHistory.push([BASE_ROUTE, prefix, '/login'].join(''));
            }
          }
          return Promise.resolve(error.response);
        }
        return Promise.reject(error);
      });
  }
  setToken(value) {}
  getToken() {}
  getBaseUrl() {
    return axios.defaults.baseURL;
  }
  get(url, params, config = {}) {
    return this.request('get', url, { params, ...config });
  }
  post(url, body, config) {
    return this.request('post', url, body, config);
  }
  put(url, body) {
    return this.request('put', url, body);
  }
  patch(url, body) {
    return this.request('patch', url, body);
  }
  delete(url, params) {
    return this.request('delete', url, { params });
  }
}
export default HttpService;
