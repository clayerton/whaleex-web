import Http from './http';
import User from './user';

class Context {
  constructor() {}

  async initialize() {
    this.install('http', Http);
    this.install('user', User);
    window.http = this.http;
    return await this.user.start();
  }

  async install(name, Service) {
    this[name] = new Service({});
  }
}

export default new Context();
