import Stomp from '@stomp/stompjs';
class WsClient {
  constructor() {
    this.client = this.create();
    this.subscribes = {};
  }
  create() {
    const client = Stomp.client(`${_config.ws_api}/ws/websocket`);
    client.heartbeat.outgoing = 1000;
    client.heartbeat.incoming = 1000;
    client.reconnect_delay = 3000;
    client.debug = function(message) {
      if (message === '<<< PONG') {
        console.log('<<< PONG');
        sessionStorage.setItem('lastOrderBookUpdate', +new Date());
      }
    };
    this.client = client;
  }
  /**
   * [startConnect description]
   * @param  {[type]} ws ws连接数组「path，回调」
   */
  startConnect(ws) {
    if (!this.client) {
      this.create();
    }
    if (!this.subscribes['orderBookSubscribe']) {
      // 不存在订阅的时候才新建一个connect
      this.client.connect(
        {},
        () => {
          this.startSubscribe(ws);
        },
        e => {
          console.log('ws error:' + e);
        }
      );
    } else {
      this.startSubscribe(ws);
    }
  }
  startSubscribe(ws) {
    for (let i = 0, l = ws.length; i < l; i++) {
      const { key, path, callBack } = ws[i];
      const preSubscribes = this.subscribes[key];
      if (preSubscribes) {
        //取消先前对同名订阅
        this.client.unsubscribe(preSubscribes.id, {}, { ack: 'client' });
      }
      this.subscribes[key] = this.client.subscribe(path, data => {
        //TODO 这个ask做什么用？？
        data.ack();
        callBack(JSON.parse(data.body));
      });
    }
  }
  stopConnect() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      // TODO 不知道是否有必要 或者对程序会有什么确切对影响
      // 将所有subscribe清空
      Object.keys(this.subscribes).forEach(key => {
        this.subscribes[key] = null;
      });
    }
  }
}
export default new WsClient();
