import { request } from 'whaleex/utils/socket.io';

import axios from 'axios';

export function _fetch(
  url,
  options = {
    method: 'GET',
  }
) {
  const opts = {
    withCredentials: !_config.noCredentials,
    ...options,
  };
  return axios(url, opts).then(r => r.data);
}

export function json(method, url, data, options = {}) {
  if (_config.socket_api) {
    return request({
      url,
      method,
      payload: data ? JSON.stringify(data) : '',
    });
  }
  data = options.body || JSON.stringify(data);
  let headers = options.headers || {};
  // test code
  // if (~url.indexOf('mom01')) {
  //   options.withCredentials = false;
  // }
  headers = {
    ...headers,
    'content-type': 'application/json',
  };
  const opts = {
    ...options,
    method,
    data,
    headers,
  };
  return _fetch(url, opts);
}

const get = json.bind(null, 'GET');
const post = json.bind(null, 'POST');
const put = json.bind(null, 'PUT');
const del = json.bind(null, 'DELETE', null);

export { post, put, del, get };
