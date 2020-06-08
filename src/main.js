// import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import './config/highcharts';
import './config/numFloat';
// import './style/main.less';

/* eslint-disable */
if (window._config && window._config.cards_url) {
  __webpack_public_path__ = window._config.cards_url + __webpack_public_path__;
}

function loadRemoteCard(type) {
  return import(/* webpackChunkName: "[request]" */ `./entry/${type}`);
}

window._loadRemoteCard = loadRemoteCard;

// Remove offline plugin as it cannot define publicPath in the runtime
// if (process.env.NODE_ENV === 'production') {
//   OfflinePluginRuntime.install({
//     publicPath: __webpack_public_path__,
//   });
// }
/* eslint-enable */

export default loadRemoteCard;
