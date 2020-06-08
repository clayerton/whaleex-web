import io from 'socket.io-client';
import uniqueId from 'lodash/uniqueId';

let socket;
let socketMap = {};
if (_config.socket_api) {
  socket = io(`${_config.socket_api}`, {
    transports: ['polling'],
  });

  socket.on('connect', socket => {
    // your exception handle logic here
  });

  socket.on('connect_error', data => {
    console.error('connect_error', data);
    // your exception handle logic here
  });

  socket.on('error', data => {
    console.error('error', data);
    // your exception handle logic here
  });

  socket.on('disconnect', reason => {
    console.warn('error', reason);
    // your exception handle logic here
  });

  socket.on('datayesSocketEventResult', (result = {}) => {
    let data = result.data;
    try {
      data = JSON.parse(data);
    } catch (e) {}
    console.log('receive <===', result.eventNum);
    let { resolve, reject } = socketMap[result.eventNum];
    socketMap[result.eventNum].state = 'success';
    socketMap[result.eventNum].result = result;
    resolve(data);
  });
}

export function request(config) {
  let key = uniqueId('socket_');
  config.eventNum = key;
  socketMap[key] = {
    config,
    key,
    state: 'pending',
  };
  let promiss = new Promise((resolve, reject) => {
    socket.emit('datayesSocketEvent', config);
    console.log('send ===>', key, config.url);
    socketMap[key] = {
      config,
      key,
      promiss,
      resolve,
      reject,
      state: 'send',
    };
  });
  return promiss;
}

window.io = io;
window.socket = socket;
window.request = request;
window.socketMap = socketMap;
