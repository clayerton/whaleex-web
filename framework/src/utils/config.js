import urljoin from 'url-join';
import get from 'lodash/get';
import scriptjs from 'scriptjs';
import { getProducts } from '../config/cards';

export const getConfig = (key, endpoint) => {
  let config = get(window._config, key); // eslint-disable-line no-underscore-dangle

  if (config && endpoint) {
    if (config === '/') config = '';
    config = urljoin(config, endpoint);
  }

  return config;
};

export const getRemoteCard = (type, version) => {
  let [project, card] = type.split('/');

  if (!card) {
    card = project;
    project = getConfig('app_name');
  }
  // if (project === getConfig('app_name')) {
  //   return import(/* webpackChunkName: "[request]" */ `entry/${type}`);
  // }
  // TODO: 可以把 _loadRemoteCardsFunc 移除 window
  /* eslint`-disable */
  window._loadRemoteCardsFunc = window._loadRemoteCardsFunc || {};

  if (window._loadRemoteCardsFunc[project]) {
    return window._loadRemoteCardsFunc[project](card);
  }

  const promise = new Promise((resolve, reject) => {
    const cardsUrl = getConfig('cards_url');
    getProducts().then(products => {
      const v = products[project].version;
      scriptjs(urljoin(cardsUrl, `${project}/${v}/main.js`), () => {
        // Set window._loadRemoteCard in cardsUrl/main.js
        const loadCard = (window._loadRemoteCardsFunc[project] =
          window._loadRemoteCard);

        loadCard(card).then(m => {
          resolve(m);
        });
      });
    });
  });
  /* eslint-enable */

  return promise;
};

export default getConfig;
