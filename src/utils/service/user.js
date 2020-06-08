import context from './index';
const LOGIN = '/UAA/oauth/token';
const PERMISSIONS = '/BUSINESS/api/user/permissions';
const LOGOUT = '/BUSINESS/api/user/public/logout';
const CLIENT_ID = 'client';
const CLIENT_SECRET = 'secret';
import U from 'whaleex/utils/extends';

import { hashPassword } from 'whaleex/common/webSign.js';
import Cookies from 'js-cookie';

class UserService {
  async start() {
    let userIsLogin = await this.isLogin();
    return userIsLogin;
  }

  async login(username, password, extendData, history) {
    try {
      let params = {
        username,
        password: hashPassword(password),
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        clientType: 'web',
        source: 'web',
        ...extendData,
      };
      sessionStorage.setItem('orderCancelAllowed', 'false');
      if (extendData.sms) {
        delete params.password;
      }
      let result = await context.http.post(LOGIN, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (
        result.data.returnCode === '1002' ||
        result.data.returnCode === '1001'
      ) {
        return result;
      } else {
        context.http.setToken(result.data);
        let permissions = await this.getPermissions();
        return result;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getPermissions() {
    let result = await context.http.get(PERMISSIONS);
    this.setPermissions(result.data);
    return result;
  }
  async isLogin() {
    try {
      let result = await context.http.get(PERMISSIONS);
      const { data, status } = result || {};
      if (status === 200) {
        this.setPermissions(data);
        const { id, user_name } = data;
        sessionStorage.setItem('userId', id);
        // sessionStorage.setItem('user', U.infoMosaic(user_name));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  setPermissions(data) {
    sessionStorage.setItem('PERMISSIONS', JSON.stringify(data));
  }

  async logout() {
    let result = await context.http.post(LOGOUT);
    const userLan = U.getUserLan();
    const user = sessionStorage.getItem('user') || '';
    const lastOrderBookUpdate =
      sessionStorage.getItem('lastOrderBookUpdate') || +new Date();
    let suffix = user.slice(-5);
    window['walGuideModal' + suffix] = undefined;
    window['walEosGuideModal' + suffix] = undefined;
    clearTimeout(window.AutoReceiveWalModalTimer);
    sessionStorage.clear();
    Cookies.remove('walEosGuideModal' + suffix);
    sessionStorage.setItem(
      'userLan',
      ((userLan === 'null' || !userLan) && 'zh') || userLan
    );
    sessionStorage.setItem('lastOrderBookUpdate', lastOrderBookUpdate);
  }
}

export default UserService;
