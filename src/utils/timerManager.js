/** Copyright © 2013-2017 DataYes, All Rights Reserved. */


let timers = {};

export function addTimer(key, value) {
  let cur = timers[key] || {};
  timers[key] = {
    ...cur,
    ...value
  };
}

export function clearTimer(key) {
  let cur = timers[key];
  if (cur && cur.timer) {
    clearTimeout(cur.timer);
  }
  if (cur && cur.ajax) {
    if (cur.ajax.abort) cur.ajax.abort();
  }
  if (cur && cur.source && cur.source.cancel) {
    cur.source.cancel('axios cancel');
  }
  return cur;
}

export function clearAllTimer() {
  _.map(timers, (value, key) => {
    if (!value.enableClearAfterRouteChange) {
      clearTimer(key);
    }
  });
}
