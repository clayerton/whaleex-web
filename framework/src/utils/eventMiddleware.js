import _ from 'lodash';
import EventEmitter from 'events';

const allAvailableEvents = {};

export const appEmitter = new EventEmitter();

export function updateAvailableEvents({ eventName, actionList = [] }) {
  allAvailableEvents[eventName] = actionList;
}

// 监听其他（卡片的）action
export const actionListener = (store) => (next) => (action) => {
  const result = next(action);
  Object.keys(allAvailableEvents).forEach((eventName) => {
    const namedListenersCount = appEmitter.listenerCount(eventName);
    if (namedListenersCount > 0) {
      if (_.includes(allAvailableEvents[eventName], action.type)) {
        appEmitter.emit(eventName, { action, state: store.getState() });
      }
    }
  });
  return result;
};
