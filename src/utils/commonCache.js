/** Copyright © 2013-2017 DataYes, All Rights Reserved. */
import { get, post, put } from 'whaleex/utils/ajax';

let cache = {};
window.cache = cache;

export function getCache(url, ajaxConfig = {}, flag) {
  const key = url + (JSON.stringify(ajaxConfig.data) || '');
  return new Promise((resolve, reject) => {
    if (!flag && cache[key]) {
      setTimeout(() => {
        resolve(cache[key]);
      }, 200);
    } else {
      get(`${_config.mof_api}/${url}`)
        .then((resp) => {
          if (!flag) cache[key] = resp;
          resolve(resp);
        })
        .catch((resp) => {
          reject(resp);
        });
    }
  });
}

export function postCache(url, ajaxConfig = {}, flag) {
  const key = url + (JSON.stringify(ajaxConfig.data) || '');
  return new Promise((resolve, reject) => {
    if (!flag && cache[key]) {
      setTimeout(() => {
        resolve(cache[key]);
      }, 200);
    } else {
      post(`${_config.mof_api}/${url}`)
        .then((resp) => {
          if (!flag) cache[key] = resp;
          resolve(resp);
        })
        .catch((resp) => {
          reject(resp);
        });
    }
  });
}

export function refreshCache(url, ajaxConfig) {
  return new Promise((resolve, reject) => {
    get(`${_config.mof_api}/${url}`)
      .then((resp) => {
        cache[url] = resp;
        resolve(resp);
      })
      .catch((resp) => {
        reject(resp);
      });
  });
}

export function clearCache(url) {
  if (_.isRegExp(url)) {
    cache = _.mapValues(cache, (value, key) => {
      if (url.test(key)) {
        return null;
      }
      return value;
    });
  } else {
    cache[url] = null;
  }
}
