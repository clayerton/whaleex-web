import axios from 'axios';
import { getConfig } from '../config';
const prefix = getConfig('usermaster_api', '/card/lib');

const save = (type) => ({
  id,
  uid,
  key = uid || id,
  name,
  cards,
  version,
  config,
  layouts,
  dashboards,
  deleteCards,
  deleteDashboards,
  level = 'user',
}) => {
  const url =
    level === 'user'
      ? `${prefix}/${type}/${key}.json`
      : `${prefix}/admin/${level}/${type}/${key}.json`;
  const data = {
    name,
    cards,
    version,
    config,
    layouts,
    dashboards,
    deleteCards,
    deleteDashboards,
  };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return axios(url, {
    baseURL: '',
    method: 'PUT',
    withCredentials: true,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.data);
};

const merge = (definitions) => {
  const hello = definitions.reduce(
    (re, k) => {
      if (!k) return re;
      const { cards: cardsK = [], ...restK } = k;
      const { cards, ...restRe } = re;
      if (cardsK.length) {
        cardsK.forEach((c) => {
          cards[c.key || c.id] = Object.assign(cards[c.key || c.id] || {}, c);
        });
      }
      return { cards, ...restRe, ...restK };
    },
    { cards: {} }
  );
  hello.cards = Object.values(hello.cards);
  return hello;
};

const saveT = (type) => ({
  id,
  uid,
  key = uid || id,
  name,
  cards,
  version,
  config,
  layouts,
  dashboards,
  product,
  tags,
  deleteCards,
  deleteDashboards,
  level = 'user',
}) => {
  const url = `${prefix}/${level}/dashboards.json`;
  const data = {
    name,
    cards,
    version,
    config,
    layouts,
    product,
    tags,
    key,
    dashboards,
    deleteCards,
    deleteDashboards,
  };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return axios(url, {
    baseURL: '',
    method: 'POST',
    withCredentials: true,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.data);
};
const getT = (type) => (
  key,
  { priority = ['global', 'tenant', 'user'] } = {},
  level = 'user'
) => {
  const url = `${prefix}/${level}/dashboards.json`;
  return (
    axios(url, {
      baseURL: '',
      withCredentials: true,
      params: {
        tenantPref: true,
        globalPref: true,
        withCards: true,
        withDashboards: true,
        withTags: true,
      },
    })
      // TODO 容错, 处理租户数据, 系统数据, 用户数据的合并
      .then((res) => res.data)
      .then(({ content, message }) => {
        // {"user":[{"key":"aaa1","name":"iiii","config":"","version":"2","description":"","product":"mof","layouts":"","cards":[]},{"key":"aaaa","name":"iiii","config":"","version":"2","description":"","product":"mof","layouts":"","cards":[]}]}
        if (!content) return { error: message };
        // 为每张卡片(每个模版)添加来自哪里的标记, isUser, isTenant, isGlobal
        priority.forEach((k) => {
          if (!content[k] || !content[k].length) return;
          const isK = [
            'is',
            k.substring(0, 1).toUpperCase(),
            k.substring(1),
          ].join('');

          content[k].forEach((item) => {
            remap(item.cards, 'id', 'key');
            remap(item, 'id', 'key');
            item[isK] = true;
            item.cards.forEach((c) => (c[isK] = true));
          });
        });
        return {
          content: Object.keys(content).reduce((obj, key) => {
            obj[key] = JSON.stringify(content[key]);
            return obj;
          }, {}),
        };
      })
  );
};
const get = (type) => (
  key,
  { priority = ['global', 'tenant', 'user'] } = {},
  level = 'user'
) => {
  const url =
    type === 'template'
      ? `${prefix}/${level}/dashboards.json`
      : `${prefix}/${type}/${key}.json`;
  return (
    axios(url, {
      baseURL: '',
      withCredentials: true,
      params: {
        tenantPref: true,
        globalPref: true,
        withCards: true,
        withDashboards: true,
      },
    })
      // TODO 容错, 处理租户数据, 系统数据, 用户数据的合并
      .then((res) => res.data)
      .then(({ content, message }) => {
        if (!content) return { error: message };
        // 为每张卡片添加来自哪里的标记, isUser, isTenant, isGlobal
        priority.forEach((k) => {
          if (!content[k] || !content[k].cards) return;
          const isK = [
            'is',
            k.substring(0, 1).toUpperCase(),
            k.substring(1),
          ].join('');
          content[k].cards.forEach((c) => (c[isK] = true));
        });
        const hello = merge(priority.map((p) => content[p]).filter((v) => v));
        const { name, version, cards, dashboards, config, layouts } = hello;
        if (dashboards) {
          dashboards.forEach((dashboard) => {
            remap(dashboard, 'id', 'key');
            if (dashboard.cards) {
              dashboard.cards.forEach((c) => remap(c, 'id', 'key'));
            }
          });
        }
        if (cards) cards.forEach((c) => remap(c, 'id', 'key'));
        const result = {
          id: key,
          name,
          version,
          cards,
          dashboards,
          config,
          layouts,
        };
        Object.keys(result).forEach(
          (k) => result[k] === undefined && delete result[k]
        );
        return result;
      })
  );
};

export const getMultiPage = (keys, options) =>
  Promise.all(keys.map((key) => getPage(key, options))).then((pages) =>
    merge(pages.filter((p) => p && !p.error))
  );

const del = (type) => (value, level = 'user') => {
  let { key, product } = value;
  // let url =
  //   level === 'user'
  //     ? `${prefix}/${type}/${key}.json`
  //     : `${prefix}/admin/${level}/${type}/${key}.json`;
  const url = `${prefix}/${level}/products/${product}/dashboards/${key}.json`;
  return axios(url, {
    baseURL: true,
    method: 'DELETE',
    withCredentials: true,
  });
};

export const getTemplate = getT('template');
export const saveTemplate = saveT('template');
export const deleteTemplate = del('template');
export const savePage = save('pages');
export const getPage = get('pages');
export const deletePage = del('pages');
export const saveDashboard = save('dashboards');
export const getDashboard = get('dashboards');
export const deleteDashboard = del('dashboards');
export const saveCard = save('cards');
export const getCard = get('cards');
export const deleteCard = del('cards');
const remap = (obj, target, ...keys) => {
  keys.forEach((k) => {
    if (obj[k]) {
      obj[target] = obj[k];
      delete obj[k];
    }
  });
};
export const addTemplate = (pageId, dashboard) => {
  remap(dashboard, 'key', 'uid', 'id');
  return savePage({ id: pageId, dashboards: [dashboard] });
};

export const addCard = (dashboardId, card) => {
  remap(card, 'key', 'uid', 'id');
  return saveDashboard({ id: dashboardId, cards: [card] });
};

export default {
  savePage,
  getPage,
  getMultiPage,
  deletePage,
  saveDashboard,
  getDashboard,
  deleteDashboard,
  saveCard,
  getCard,
  deleteCard,
  addTemplate,
  addCard,
  save,
  getTemplate,
};
