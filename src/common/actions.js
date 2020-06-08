/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import { Modal } from 'antd';
import context from 'whaleex/utils/service';
import msgs from 'whaleex/utils/messages';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { chainModal } from './actionsChain.js';
import {
  PhoneExistModal,
  LoginErrorModal,
  AutoReceiveWalModal,
} from 'whaleex/components/WalModal';
import showGuideModal from 'whaleex/components/WalModal/GuideModal/index.js';
import U from 'whaleex/utils/extends';
import * as types from './constants';
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
import { hashPassword } from 'whaleex/common/webSign.js';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { getSubscription } from './actionsSubscribe.js';
import OrderUtils from 'whaleex/pages/Dashboard/containers/trade/utils.js';
export function setUserData(key, value) {
  return async function(dispatch) {
    try {
      dispatch({
        type: types.SET_USER_DATA,
        props: { [key]: value },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function showUserRegisterModal(history, search) {
  const confirmModal = confirm({
    content: (
      <PhoneExistModal
        onCancel={() => {
          confirmModal.destroy();
        }}
        onOk={() => {
          confirmModal.destroy();
          history.push([BASE_ROUTE, prefix, '/register', search].join(''));
        }}
        notExist
      />
    ),
    title: null,
    className: 'whaleex-common-modal',
    iconType: true,
    okCancel: false,
    width: '350px',
  });
}
export function authBehavior(callBack, needAuth) {
  const { phone, countryCode } = needAuth;
  return new Promise(async (resolve, reject) => {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/auth/public/behavior/start`,
        {
          clientType: 'web',
          phone,
          countryCode,
        }
      );
      initGeetest(
        {
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind',
          lang: U.getUserLan(),
        },
        function(captchaObj) {
          captchaObj
            .onReady(function() {
              //your code
              captchaObj.verify();
            })
            .onSuccess(function(e) {
              var result = captchaObj.getValidate();
              //TODO 二次请求
              const challenge = result.geetest_challenge;
              const validate = result.geetest_validate;
              const seccode = result.geetest_seccode;
              let authData = {
                ...data,
                challenge,
                validate,
                seccode,
                clientType: 'web',
                countryCode,
              };
              sessionStorage.setItem(
                'sessionAuthData',
                JSON.stringify(authData)
              );
              resolve(authData);
            })
            .onClose(function() {
              callBack && callBack();
            })
            .onError(function() {
              resolve({});
            });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
export function getTestCodeStatus() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/public/isAlphaTest`);
      dispatch({
        type: types.REFRESH_PROPS,
        props: { isAlphaTest: data.result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export function globalPublicData() {
  return async function(dispatch) {
    try {
      dispatch(getTestCodeStatus());
      let { data } = await context.http.get(`/BUSINESS/api/public/countries`);
      if (data.returnCode === '1') {
        // dispatch(logout());
        data.message && message.warning(data.message);
        // self.location.href = 'whaleex/login';
        return;
      }
      const countries = _.orderBy(data.result, ['name'], ['asc']).reduce(
        (pre, { callingCode, alpha2Code, name, zhName }) => {
          let _name = name;
          let cCode = callingCode;
          if (cCode === '86') {
            _name = '中国';
          }
          if (!cCode) {
            return pre;
          } else {
            pre.push({
              callingCode: '+' + cCode,
              name: _name,
              countryCode: alpha2Code,
            });
            return pre;
          }
        },
        []
      );
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          countries: data.result,
          countrieCodes: countries,
        },
      });
    } catch (e) {
      // if (!window.location.pathname.includes('/homePage')) {
      //   setTimeout(() => {
      //     dispatch(logout());
      //     self.location.href = '';
      //   }, 2000);
      // }
      return Promise.reject(e);
    }
  };
}

export function login(
  user = '666',
  passw = '123456',
  extendData,
  history,
  needAuth,
  callBack,
  type,
  others
) {
  const { formatMessage, verifyCode } = extendData;
  if (extendData.verifyCode) {
    extendData = Object.assign({}, extendData, {
      client_id: 'client',
      client_secret: 'secret',
      grant_type: 'client_credentials',
      sms: verifyCode,
    });
  }
  return async function(dispatch) {
    dispatch({
      type: types.LOGIN,
      data: { logining: true },
    });
    let authData = JSON.parse(
      sessionStorage.getItem('sessionAuthData') || '{}'
    );
    if (typeof needAuth === 'object' && !_.isEmpty(needAuth)) {
      authData = await authBehavior(() => {
        dispatch({
          type: types.LOGIN,
          data: { logining: false },
        });
      }, needAuth);
      if (authData.success !== 1) {
        dispatch({
          type: types.LOGIN,
          data: { logining: false },
        });
        return;
      }
    }
    if (!user || !passw) {
      message.error(formatMessage({ id: 'login.userOrNameEmpty' }));
      return;
    }
    dispatch(
      initUser(
        user,
        passw,
        { ...extendData, ...authData },
        history,
        type || 'login',
        callBack,
        others
      )
    );
  };
}
export function initUser(
  user,
  passw,
  extendData = {},
  history,
  type,
  _callBack,
  others
) {
  let callBack = _callBack;
  if (!callBack) {
    callBack = r => {
      if (!!r) {
        let { permissions } = r;
        if (permissions.hasPassword === 'true') {
          history.push([BASE_ROUTE, prefix, '/trade/WAL_EOS'].join(''));
        } else {
          history.push([BASE_ROUTE, prefix, '/usercenter/setPass'].join(''));
        }
      }
    };
  }
  const { formatMessage, countryCode, sms = '' } = extendData;
  let facebookData = {};
  if (sms.length > 10) {
    facebookData = {
      accountKitType: 'code',
      grant_type: 'account_kit',
      code: sms,
      sms: undefined,
      verifyCode: undefined,
    };
  }
  return async function(dispatch) {
    context.user
      .login(user, passw, { ...extendData, ...facebookData }, history)
      .then(async token => {
        dispatch(getCommonData());
        if (token.data.result === 'NOREG') {
          showUserRegisterModal(history, '?from=smsLogin');
          dispatch({
            type: types.REFRESH_PROPS,
            props: {
              data: { logining: false },
            },
          });
          return;
        }
        // 手机号若存在 跳弹框指示用户前往注册
        if (token.data.type === 'register') {
          setTimeout(() => {
            message.success(formatMessage({ id: 'login.regSuccess' }));
          }, 2000);
        }
        if (token.data.returnCode === '1001') {
          message.error(formatMessage({ id: 'login.codeError' }));
          dispatch({
            type: types.REFRESH_PROPS,
            props: {
              data: { logining: false },
            },
          });
          return;
        }
        if (token.data.returnCode === '1002') {
          dispatch(
            login(
              user,
              passw,
              extendData,
              history,
              {
                type: 'auth1002',
                phone: user,
                countryCode,
              },
              callBack,
              type,
              others
            )
          );
          return;
        }
        if (token.data.returnCode === '2000') {
          message.error(_.get(token, 'data.error_description'));
          dispatch({
            type: types.REFRESH_PROPS,
            props: {
              data: { logining: false },
            },
          });
          return;
        }
        // if (token.data.isAdmin) {
        //   message.warning('you ha');
        //   return;
        // }
        dispatch({
          type: types.LOGIN,
          data: { user, password: passw, logining: true },
        });
        sessionStorage.setItem('userId', token.data.id);
        // const pks = await getUserPK();
        // const localKeys = await loadKeyDecryptData();

        // 获取本地的pk和用户已经绑定的pks
        // let pk = 1234;
        // const pk = await chainModal({
        //   type,
        //   userUniqKey,
        //   pks: pks || [],
        //   eos: eosConfig,
        //   localKeys,
        //   userId: token.data.id,
        // });
        // Cookies.set('user', user);
        sessionStorage.setItem('user', user);
        let permissions = sessionStorage.getItem('PERMISSIONS');
        permissions = JSON.parse(permissions || '{}');
        callBack && callBack({ permissions });
        // if (permissions.byPassword) {
        //   dispatch(getWalAward());
        // }
        dispatch(initialApp(null, history));
        dispatch({
          type: types.REFRESH_PROPS,
          props: {
            data: { logining: false },
          },
        });
      })
      .catch(e => {
        const { loginType } = extendData;
        if (type === 'rePassAuth') {
          callBack && callBack(false);
          dispatch({
            type: types.REFRESH_PROPS,
            props: { data: { logining: false } },
          });
        } else if (_.get(e, 'response.status') === 400) {
          others.passErrorCallBack && others.passErrorCallBack('passError');
          const noMoreLoginError = sessionStorage.getItem(
            user + 'noMoreLoginError'
          );
          const LoginErrorTimes =
            sessionStorage.getItem(user + 'LoginErrorTimes') || 0;
          if (!noMoreLoginError && +LoginErrorTimes > 0 && loginType === '1') {
            const confirmModal = confirm({
              content: (
                <LoginErrorModal
                  data={{ LoginErrorTimes }}
                  onCancel={noMoreLoginError => {
                    if (noMoreLoginError) {
                      sessionStorage.setItem(user + 'noMoreLoginError', true);
                    }
                    confirmModal.destroy();
                  }}
                  onOk={noMoreLoginError => {
                    if (noMoreLoginError) {
                      sessionStorage.setItem(user + 'noMoreLoginError', true);
                    }
                    confirmModal.destroy();
                    history.push([BASE_ROUTE, prefix, '/forgetPwd'].join(''));
                  }}
                />
              ),
              title: null,
              className: 'whaleex-common-modal',
              iconType: true,
              okCancel: false,
              width: '350px',
            });
          } else if (loginType === '1') {
            message.error(formatMessage({ id: 'login.userOrNameError' }));
          } else if (loginType === '2') {
            message.error(formatMessage({ id: 'login.codeError' }));
          }
          sessionStorage.setItem(
            user + 'LoginErrorTimes',
            +LoginErrorTimes + 1
          );
          dispatch({
            type: types.LOGOUT,
            data: { logining: false },
          });
        } else {
          message.error(_.get(e, 'response.data.error_description', e + ''));
          dispatch({
            type: types.LOGOUT,
            data: { logining: false },
          });
        }
      });
  };
}
//hjl-2 这里新增了一个请求permissions的action
export function getPermissions() {
  return async function(dispatch) {
    const prermissions = await context.user.getPermissions();
    //hjl-2 这里console一下 确保返回不是undefined  应该是一个permission对象
    dispatch({
      type: types.REFRESH_PROPS,
      props: {
        permissions: prermissions.data,
      },
    });
  };
}
export function logout(history, isNoJumpPage) {
  return async function(dispatch) {
    await context.user.logout();
    !isNoJumpPage &&
      history &&
      history.push([BASE_ROUTE, prefix, '/login'].join(''));
    dispatch({
      type: types.LOGOUT,
    });
    dispatch(getCommonData());
  };
}
export function getLoginToken(callBack) {
  return async function(dispatch) {
    const r = await context.initialize();
    callBack && callBack(r);
    dispatch({
      type: types.TOKEN_DONE,
    });
    return r;
  };
}

export function getCommonData() {
  return function(dispatch) {
    dispatch(getSubscription());
  };
}
export function initialApp(callBack, history, eosConfig) {
  //获取首屏 或全局的必备数据
  return function(dispatch) {
    dispatch(
      getUserConfig(
        async (dispatch, legalTender, legaldigital, lan, permissions = {}) => {
          if (permissions.byPassword) {
            dispatch(getWalAward());
          }
          dispatch(getCurrencyList(legalTender, legaldigital));
          callBack && callBack(lan);
        },
        history
      )
    );
    dispatch(getEncryptKey());
    dispatch(getWhaleexEos());
    dispatch(loadPk());
    dispatch(getSymbolList());
    dispatch(getPartition());
    dispatch(getQuotable());
    dispatch(getWithdrawFee());
    dispatch(getWhaleData());
    dispatch(getStakeFor());
  };
}
export function initialTrade() {
  return function(dispatch) {
    dispatch(getSymbolList());
    dispatch(getWhaleexEos());
    dispatch(getPartition());
    dispatch(getQuotable());
    dispatch(getCurrencyList());
    dispatch(getWithdrawFee());
    dispatch(getWhaleData());
  };
}
/*
更新用户配置
 */
export function updateUserConfig(params, callback) {
  //   "language": "CHINESE|ENGLISH",
  //   "legalTender": "RMB|DOLLAR",
  //   "legaldigital": "BTC|ETH|USDT",
  //   "walPayEnable": false
  return async function(dispatch) {
    try {
      let { data } = await context.http.post(
        `/BUSINESS/api/auth/config/set`,
        params
      );
      callback && callback(true);
      dispatch(getUserConfig());
      if (params.legalTender) {
        const unitMap = {
          RMB: 'CNY',
          DOLLAR: 'USD',
        };
        dispatch(getCurrencyList(unitMap[params.legalTender]));
      }
      // dispatch(getCurrencyList());
    } catch (e) {
      callback && callback(false);
      return Promise.reject(e);
    }
  };
}
/*
获取用户配置
 */

export function getUserConfig(callBack, history) {
  // let pubKey = pk;
  const legalTenderType = {
    RMB: 'CNY',
    DOLLAR: 'USD',
  };
  const LmapR = {
    ENGLISH: 'en',
    CHINESE: 'zh',
    KOREAN: 'ko',
    JAPANESE: 'ja',
    FRENCH: 'fr',
  };

  return async function(dispatch) {
    // const userUniqKey = await getEncryptKey();
    // if (!pubKey) {
    //   const localKeys = await loadKeyDecryptData(userUniqKey);
    //   pubKey = localKeys.pubkey;
    // }
    try {
      let { data } = await context.http.post(`/BUSINESS/api/auth/user/config`);
      if (data.returnCode !== '0') {
        // dispatch(logout(history));
        data.message && message.warning(data.message);
        return;
      }
      const userId = _.get(data, 'result.userId');
      const lastUserId = _.get(data, 'result.lastUserId');
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('lastUserId', lastUserId);
      const legalTender = legalTenderType[data.result.legalTender];
      const legaldigital = data.result.legaldigital;
      const lanKey = data.result.language;
      const user = data.result.phone;
      sessionStorage.setItem('user', user);
      let permissions = sessionStorage.getItem('PERMISSIONS');
      permissions = JSON.parse(permissions || '{}');
      callBack &&
        callBack(
          dispatch,
          legalTender,
          legaldigital,
          LmapR[lanKey || 'CHINESE'],
          permissions
        );
      showGuideModal(data.result);
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          userConfig: data.result,
          legaldigital,
          eosAccount: { eosAccount: data.result.userEosAccount },
          permissions,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取所有数字货币
 */
export function getCurrencyList(legalTender, legaldigital = 'EOS') {
  let defaultLegalTender = 'USD';
  console.log(U.getUserLan());
  if (U.getUserLan() === 'zh') {
    defaultLegalTender = 'CNY';
  }
  legalTender = legalTender || defaultLegalTender;
  //CNY RMB; USD DOLLAR
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/public/currency`);
      let _data = data.filter(({ status, visible }) => status === 'ON');
      dispatch({
        type: types.REFRESH_PROPS_GET_CURRENCY,
        props: {
          currencyList: _data,
          currencyListObj: _data.reduce((pre, cur) => {
            const { id, shortName } = cur;
            pre[id] = cur;
            pre[shortName] = cur;
            return pre;
          }, {}),
        },
      });

      U.setAsync(['autoReceiveCurrency'], [_data]);
      dispatch(convertMap(_data, legaldigital, 'digital'));
      dispatch(
        convertMap(
          _data.filter(({ shortName }) => shortName === 'EOS'),
          legalTender
        )
      );
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
根据法币单位 获得兑换率
 */
export function convertMap(currencyList = [], convertTo = 'USD', suffix) {
  //TODO 汇率轮询！
  return async function(dispatch) {
    try {
      const shortNameList = currencyList.reduce(
        (pre, cur) => {
          const { shortName, id } = cur;
          if (!pre[0]) {
            return [shortName, [{ key: shortName, target: id }]];
          }
          pre[0] = `${pre[0]},${shortName}`;
          pre[1].push({ key: shortName, target: id });
          return pre;
        },
        ['', []]
      );
      let { data } = await context.http.get(
        '/BUSINESS/api/public/global/price',
        {
          currency: shortNameList[0],
          convert: convertTo,
        }
      );
      data = shortNameList[1].reduce((pre, cur) => {
        const { key, target } = cur;
        pre[`${target}`] = pre[key];
        return pre;
      }, data);
      const key = `convertMap${(suffix && '_' + suffix) || ''}`;
      let _props = {
        [key]: data,
      };
      if (suffix) {
        _props.legaldigital = convertTo;
        U.setAsync(['convertMap'], [data]);
      } else {
        _props.legalTender = convertTo;
      }
      dispatch({
        type: types.REFRESH_PROPS,
        props: _props,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取stake for账户
 */
export function getStakeFor() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/whale/currentStakeFor`
      );
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          currentStakeFor: _.get(data, 'result.forEosAccount'),
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
设置stake for账户
 */
export function setStakeFor(params, callback) {
  return async function(dispatch) {
    const {
      eosAccount, //交易所账号
      userAccount, //用户账号
      targetAccount, //接收账号
      userUniqKey,
      publicKey,
    } = params;
    let timestamp = parseInt(Date.now() / 1000);

    const signature = await U.signStakeFor({
      eosAccount,
      userAccount,
      targetAccount,
      timestamp,
      userUniqKey,
    });

    try {
      let { data } = await context.http.post(
        `/BUSINESS/api/whale/setStakeFor`,
        {
          stakeType: 'CPU',
          eosAccount: targetAccount,
          timestamp,
          signature,
          publicKey,
        }
      );
      const { returnCode, message: msg } = data;
      if (returnCode !== '0') {
        message.warning(msg);
      } else {
        dispatch(getStakeFor());
      }
      callback && callback(`${returnCode}` === '0');
      dispatch({
        type: types.REFRESH_PROPS,
        props: {},
      });
    } catch (e) {
      callback && callback();
      return Promise.reject(e);
    }
  };
}
/*
获取加密的种子
 */
function getEncryptKey() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/user/encrypt/key`);
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          userUniqKey: data.result,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取用户已经绑定的公钥地址
 */
function getUserPK() {
  return new Promise(async (resolve, reject) => {
    let { data } = await context.http.get(`/BUSINESS/api/account/pk/ALL`); //STORED
    // if (data.returnCode !== '0') {
    //   message.warning(data.message);
    // }
    resolve({
      pks:
        ((Array.isArray(data.result) && data.result) || []).filter(
          ({ status }) => status === 'ACTIVED'
        ) || [],
      allPks: data.result,
    });
  });
}
/*
获得所有交易对
 */
window.getSymbolListTimer = undefined;
export function getSymbolList() {
  clearTimeout(window.getSymbolListTimer);
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/public/symbol`);
      const publicSymbolObj = data.reduce((pre, cur, idx) => {
        const { id } = cur;
        pre[`${id}`] = cur;
        return pre;
      }, {});
      dispatch({
        type: types.REFRESH_PROPS,
        props: { publicSymbol: data, publicSymbolObj },
      });
      window.getSymbolListTimer = setTimeout(() => {
        dispatch(getSymbolList());
      }, 20000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获得平台挖矿数据
 */
window.getWhaleDataTimer = undefined;
export function getWhaleData() {
  clearTimeout(window.getWhaleDataTimer);
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/whale/public/exchange`
      );
      dispatch({
        type: types.REFRESH_PROPS,
        props: { whaleData: data.result },
      });
      window.getWhaleDataTimer = setTimeout(() => {
        dispatch(getWhaleData());
      }, 5000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
自动领取
 */
export function getWalAward() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.post(
        `/BUSINESS/api/whale/multi/receive`
      );
      //红包弹窗
      if (data.result !== null) {
        await U.waitAsync(['autoReceiveCurrency', 'convertMap']);
        const asyncData = U.getAsync(['autoReceiveCurrency', 'convertMap']);
        window.AutoReceiveWalModalTimer = setTimeout(() => {
          const confirmModal = confirm({
            content: (
              <AutoReceiveWalModal
                onCancel={noMoreLoginError => {
                  confirmModal.destroy();
                }}
                onOk={noMoreLoginError => {
                  confirmModal.destroy();
                }}
                data={data}
                asyncData={asyncData}
              />
            ),
            title: null,
            className: 'whaleex-common-modal transparent-it',
            iconType: true,
            okCancel: false,
            width: '670px',
          });
        }, 1000);
      }
      dispatch({
        type: types.REFRESH_PROPS,
        props: {},
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取EOS钱包绑定状态
 */
export function getEosAccount() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/account`);
      dispatch({
        type: types.REFRESH_PROPS,
        props: { eosAccount: data.result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取当前支持的计价货币
 */
export function getQuotable() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/currency/quotable`
      );
      dispatch({
        type: types.REFRESH_PROPS,
        props: { publicQuotable: data.result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取当前币种分类
 */
export function getPartition() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/symbol/partition`
      );
      dispatch({
        type: types.REFRESH_PROPS_PAR,
        props: { symbolPartition: data.result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取本地pk
 */
export function loadPk() {
  return async function(dispatch) {
    try {
      const [{ pks, allPks }, localKeys] = await Promise.all([
        getUserPK(),
        loadKeyDecryptData(),
      ]);
      // const mapPks = pks.map(({ pk }) => pk);
      let pubKey = undefined;
      if (localKeys && localKeys.pubkey) {
        pubKey = localKeys.pubkey;
        dispatch(getUserPkStatus(pubKey));
      }
      window.PkSafeLock = false;
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          pks: pks || [],
          allPks,
          pubKey,
        },
      });
    } catch (e) {
      window.PkSafeLock = true;
      return Promise.reject(e);
    }
  };
}
/*
获取当前用户某个pk的status
 */
export function getUserPkStatus(pubKey) {
  return async function(dispatch) {
    if (!pubKey) {
      return;
    }
    try {
      let { data } = await context.http.get(`/BUSINESS/api/auth/pk/status`, {
        pk: pubKey,
      });
      data.result.pkBindSuccess = data.result.status === 'ACTIVED';
      dispatch({
        type: types.REFRESH_PROPS,
        props: { userPkStatus: data.result, pubKey },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取pk链上绑定状态
 */
export function pkActionStatus(curPk, callback) {
  // pubkey-delay
  return async function(dispatch) {
    const localKeys = await loadKeyDecryptData();
    if (_.isEmpty(localKeys) && !curPk) {
      return;
    }
    const pubKey = curPk || localKeys.pubkey;
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/account/bind/status/v2/${pubKey}`
      );
      if (data.returnCode === '0') {
        callback && callback(data.result);
      }
    } catch (e) {
      callback && callback(false);
      return Promise.reject(e);
    }
  };
}
/*
获取提币费用
 */
export function getWithdrawFee() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/withdraw/fee`
      );
      dispatch({
        type: types.REFRESH_PROPS,
        props: { withdrawFeeObj: data },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取所有交易对最新行情
 */
export function getAllSymbolMarket(topType, currencyListObj) {
  return async function(dispatch) {
    try {
      // let { data } = await context.http.get(`/BUSINESS/api/public/ticker`, {
      //   topType,
      // });
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          allSymbolMarket: [],
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export function refreshProps(props) {
  return {
    type: types.REFRESH_PROPS,
    props,
  };
}
/*
发送用户验证码
 */
export let sendCode = (
  type,
  method,
  methodID,
  callBack,
  history,
  exParams = {},
  formatMessage
) => {
  let _methodID = methodID;
  methodID = _methodID.split(' ').join('');
  let methodTypes = {
    phoneCode: '手机', //前置检查
    mailCode: '邮箱',
    oldPhoneCode: '手机',
  };
  if (!methodTypes[method]) {
    const error = `未知的验证码发送手段`;
    callBack && callBack(false, error);
    return {
      type: types.NOT_BIND,
    };
  }
  if (!methodID) {
    const error = `请先绑定${methodTypes[method]}`;
    callBack && callBack(false, error);
    return {
      type: types.NOT_BIND,
    };
  }
  let api = '';
  let params = {};
  const country = Cookies.get('country');
  const countryCode = JSON.parse(country || '{}').countryCode || 'CN';
  if (countryCode !== 'CN' || Cookies.get('debug')) {
    if (_config.faceBookSms === '1') {
      try {
        U.facebookCodeSend(JSON.parse(country || '{}'), methodID, r => {
          callBack && callBack(r);
        });
        return {
          type: types.NOT_BIND,
        };
      } catch (e) {
        console.log('facebook network error');
      }
    }
  }
  if (method === 'phoneCode' || method === 'oldPhoneCode') {
    api = `/BUSINESS/api/user/public/smsCode`;
    params = {
      phone: methodID,
      type,
      countryCode,
    };
  } else if (method === 'mailCode') {
    api = `/BUSINESS/api/auth/email/getVerifyCode`;
    params = {
      email: methodID,
      type,
      countryCode,
    };
  }
  return async function(dispatch) {
    let authData = await authBehavior(() => {}, {
      phone: methodID,
      countryCode,
    });
    params = Object.assign({}, params, authData, exParams);
    try {
      //发送验证码
      const { data } = await context.http.post(api, params);
      // errorCode: null
      // message: "success"
      // result: null
      // returnCode: "0"
      if (data.errorCode === 'E169') {
        //发现手机已经存在
        const confirmModal = confirm({
          content: (
            <PhoneExistModal
              onCancel={() => {
                confirmModal.destroy();
              }}
              onOk={() => {
                confirmModal.destroy();
                history.push([BASE_ROUTE, prefix, '/login'].join(''));
              }}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '350px',
        });
        dispatch({
          type: types.USER_REGISTER,
          data: { logining: false },
        });
        return;
      }
      const { returnCode, message: msg } = data;
      if (returnCode === '1002') {
        dispatch(
          sendCode(
            type,
            method,
            methodID,
            callBack,
            history,
            exParams,
            formatMessage
          )
        );
        return;
      }
      if (returnCode !== '0') {
        message.error(msg || formatMessage({ id: 'common.smsSendFail' }));
      } else {
        message.success(formatMessage({ id: 'common.smsSendSuccess' }));
      }
      const alert =
        `${returnCode}` === '0' &&
        `验证码已发送至${methodID}的${methodTypes[method]}`;
      callBack && callBack(`${returnCode}` === '0', alert);
      dispatch({
        type: types.SEND_SMSCODE,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
开启/关闭 手机验证
 */
export const confirmPhoneToggle = (params, callBack) => {
  return async function(dispatch) {
    try {
      const { data } = await context.http.post(
        `/BUSINESS/api/auth/phone/verify`,
        params
      );
      const { returnCode, message: msg } = data;
      dispatch(getUserConfig());
      callBack && callBack(`${returnCode}` === '0', msg);
      dispatch({
        type: types.CONFIRM_TOGGLE_PHONE,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
开启/关闭 谷歌验证
type= enable / disable
 */
export const confirmGoogleToggle = (params, enable, callBack) => {
  let type = (enable && 'enable') || 'disable';
  return async function(dispatch) {
    try {
      const { data } = await context.http.post(
        `/BUSINESS/api/auth/google/${type}`,
        params
      );
      const { returnCode, message: msg } = data;
      dispatch(getUserConfig());
      callBack && callBack(`${returnCode}` === '0', msg);
      dispatch({
        type: types.CONFIRM_TOGGLE_GOOGLE,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
用户注册
 */
export const registerUser = (params, history, needAuth, callBack) => {
  let {
    countryNumericCode,
    inviteCode,
    newPhone,
    newPhoneCode,
    password,
    phone,
    verifyCode = '',
    countryCode,
    testCode,
  } = params;
  phone = phone.split(' ').join('');
  return async function(dispatch) {
    dispatch({
      type: types.USER_REGISTER,
      data: { logining: true },
    });
    let authData = JSON.parse(
      sessionStorage.getItem('sessionAuthData') || '{}'
    );
    if (!!needAuth) {
      authData = await authBehavior(() => {
        dispatch({
          type: types.USER_REGISTER,
          data: {},
        });
      }, needAuth);
      if (authData.success !== 1) {
        dispatch({
          type: types.USER_REGISTER,
          data: { logining: false },
        });
        return;
      }
    }
    try {
      // //验证手机是否存在？？
      // const { data: phoneCheck } = await context.http.post(
      //   `/BUSINESS/api/auth/public/phone/nonexistent`,
      //   {
      //     clientType: 'web',
      //     ...authData,
      //     phone,
      //   }
      // );
      // const { result: nonexistent } = phoneCheck;
      // if (!nonexistent) {
      //   const confirmModal = confirm({
      //     content: (
      //       <PhoneExistModal
      //         onCancel={() => {
      //           confirmModal.destroy();
      //         }}
      //         onOk={() => {
      //           confirmModal.destroy();
      //           history.push([BASE_ROUTE, prefix, '/login'].join(''));
      //         }}
      //       />
      //     ),
      //     title: null,
      //     className: 'whaleex-common-modal',
      //     iconType: true,
      //     okCancel: false,
      //     width: '350px',
      //   });
      //   dispatch({
      //     type: types.USER_REGISTER,
      //     data: { logining: false },
      //   });
      //   return;
      // }
      if (testCode) {
        const { data: testCodeData } = await context.http.get(
          `/BUSINESS/api/public/testCode/isValid`,
          {
            testCode,
          }
        );
        if (testCodeData.returnCode === '1') {
          callBack('testCodeInvalid');
          dispatch({
            type: types.USER_REGISTER,
            data: { logining: false },
          });
          return;
        }
      }
      //进行注册操作
      let facebookData = {};
      if (verifyCode.length > 10) {
        facebookData = {
          accountKitType: 'code',
          grant_type: 'account_kit',
          code: verifyCode,
          verifyCode: undefined,
        };
      }
      const { data } = await context.http.post(
        `/BUSINESS/api/user/public/register`,
        {
          // countryNumericCode,
          // inviteCode,
          ...authData,
          password: hashPassword(password),
          phone: phone,
          verifyCode,
          code: verifyCode,
          countryCode,
          testCode,
          clientType: 'web',
          ...facebookData,
        }
      );
      if (data.errorCode === 'E123') {
        const confirmModal = confirm({
          content: (
            <PhoneExistModal
              onCancel={() => {
                confirmModal.destroy();
              }}
              onOk={() => {
                confirmModal.destroy();
                history.push([BASE_ROUTE, prefix, '/login'].join(''));
              }}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '350px',
        });
        dispatch({
          type: types.USER_REGISTER,
          data: { logining: false },
        });
        return;
      }
      const { returnCode, message: msg } = data;
      if (returnCode === '1001') {
        callBack('smsCodeInvalid');
        dispatch({
          type: types.USER_REGISTER,
          data: { logining: false },
        });
        return;
      }
      if (returnCode === '1002') {
        dispatch(
          registerUser(
            params,
            history,
            {
              type: 'auth1002',
              phone: phone,
              countryCode,
            },
            callBack
          )
        );
        return;
      }
      if (returnCode === '0') {
        dispatch(
          initUser(
            phone,
            password,
            { ...authData, countryCode },
            history,
            'register'
          )
        );
      } else {
        message.warning(msg);
      }
      dispatch({
        type: types.USER_REGISTER,
        data: { logining: false },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
忘记密码
 */
export const forgetPwdUser = (params, history, needAuth, formatMessage) => {
  let { password, phone, verifyCode = '' } = params;
  phone = phone.split(' ').join('');
  return async function(dispatch) {
    dispatch({
      type: types.USER_REGISTER,
      data: { logining: true },
    });
    let authData = JSON.parse(
      sessionStorage.getItem('sessionAuthData') || '{}'
    );
    if (!!needAuth) {
      authData = await authBehavior(() => {
        dispatch({
          type: types.USER_REGISTER,
          data: { logining: false },
        });
      }, needAuth);
      if (authData.success !== 1) {
        dispatch({
          type: types.USER_REGISTER,
          data: { logining: false },
        });
        return;
      }
    }
    try {
      const country = Cookies.get('country');
      const countryCode = JSON.parse(country || '{}').countryCode || 'CN';
      let facebookData = {};
      if (verifyCode.length > 10) {
        facebookData = {
          accountKitType: 'code',
          grant_type: 'account_kit',
          code: verifyCode,
          verifyCode: undefined,
        };
      }
      const { data } = await context.http.post(
        `/BUSINESS/api/auth/public/pwd/reset`,
        {
          ...authData,
          phone,
          countryCode,
          code: verifyCode,
          password: hashPassword(password),
          clientType: 'web',
          ...facebookData,
        }
      );
      const { returnCode, message: msg } = data;
      if (data.result === 'NOREG') {
        showUserRegisterModal(history, '?from=forgetPwd');
        dispatch({
          type: types.REFRESH_PROPS,
          props: {
            data: { logining: false },
          },
        });
        return;
      }
      if (returnCode === '1002') {
        dispatch(
          forgetPwdUser(params, history, {
            type: 'auth1002',
            phone: phone,
            countryCode,
          }),
          formatMessage
        );
        return;
      }
      if (returnCode === '0') {
        message.success(formatMessage({ id: 'common.resetPassSuccess' })); //(msg === 'new' && '注册成功！') ||
        dispatch(
          initUser(
            phone,
            password,
            { ...authData, countryCode },
            history,
            'register'
          )
        );
        // history.push([BASE_ROUTE, prefix, '/login'].join(''));
      } else {
        message.warning(msg);
      }
      dispatch({
        type: types.USER_REGISTER,
        data: { logining: false },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
/*
global setting设置
params {key:value}
 */
export function setGlobalSetting(params = {}) {
  return async function(dispatch) {
    try {
      dispatch({
        type: types.REFRESH_PROPS,
        props: params,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
window.getWhaleexEosTimer2 = undefined;
function getWhaleexEos() {
  clearTimeout(window.getWhaleexEosTimer2);
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/account/public/exchange`
      );
      if (data.returnCode !== '0') {
        message.warning(data.message);
      }
      //将时间戳变成HH:mm格式
      let t1 = _.get(data, 'result.mineConfig.feeResetCronTabInput');
      let t2 = _.get(data, 'result.mineConfig.mineCronTabInput');
      let t3 = _.get(data, 'result.mineConfig.releaseCronTabInput');
      _.set(data, 'result.mineConfig.feeResetCronTabInput', U.convert2Time(t1));
      _.set(data, 'result.mineConfig.mineCronTabInput', U.convert2Time(t2));
      _.set(data, 'result.mineConfig.releaseCronTabInput', U.convert2Time(t3));
      window.eosConfigData = data;
      dispatch({
        type: types.REFRESH_PROPS,
        props: { eosConfig: data },
      });
      window.getWhaleexEosTimer2 = setTimeout(() => {
        dispatch(getWhaleexEos());
      }, 1000 * 60);
    } catch (e) {
      dispatch({
        type: types.REFRESH_PROPS,
        props: {
          eosConfig: window.eosConfigData || { result: { mineConfig: {} } },
        },
      });
      return Promise.reject(e);
    }
  };
}
export const resign = (
  { page = 0, size = 100, symbolId, startTime = 0 },
  {
    pubKey,
    eosAccount,
    currencyListObj,
    eosConfig,
    userUniqKey,
    publicSymbolObj,
  }
) => {
  // 每次刷新重签 每4次传后端 每2次签名间隔40秒
  // 没有绑定数据 不重签名！！
  return async function(dispatch) {
    try {
      let orderParams = {
        page,
        size,
        startTime,
      };
      if (symbolId) {
        orderParams.symbolId = symbolId;
      }
      const { data } = await context.http.get(
        `/BUSINESS/api/orderForResign`,
        orderParams
      );
      if (data && data.content) {
        let delegate = data.content;
        if (delegate && delegate.length) {
          let curTime = Math.floor(Date.now() / 1000);
          delegate = delegate.filter(({ resignTime }) => {
            return curTime - resignTime > 1 * 24 * 60 * 60;
          });
          const orderedDelegate = _.orderBy(delegate, ['resignTime'], ['asc']);
          for (var i = 0; i < Math.ceil(orderedDelegate.length / 4); i++) {
            await Promise.all(
              orderedDelegate
                .slice(i * 4, (i + 1) * 4)
                .map(async (item, idx) => {
                  const {
                    orderId,
                    symbolId,
                    status,
                    price,
                    origQty,
                    execValue,
                    execAvgPrice,
                    execQty,
                    side,
                    createTime,
                    type,
                    takerFeeRate,
                    makerFeeRate,
                  } = item;
                  const symbol = publicSymbolObj[symbolId];
                  const sign = {
                    params: {
                      name: symbol.name,
                      side: `${side}`,
                      type,
                      price,
                      quantity: origQty,
                      feeRate: {
                        takerFeeRate,
                        makerFeeRate,
                      },
                    },
                    exEosAccount: eosConfig.result,
                    symbol,
                    eosAccount,
                    currencyListObj,
                    expressId: orderId,
                    userUniqKey,
                    timeStamp: Math.floor(Date.now() / 1000),
                  };
                  return new Promise(reslove => {
                    setTimeout(async () => {
                      let order = await OrderUtils.createOrder(sign, true);
                      reslove(Object.assign({}, order, { publicKey: pubKey }));
                    }, idx * 1000 * 40);
                  });
                })
            ).then(async r => {
              const { data: resignR } = await context.http.post(
                `/BUSINESS/api/order/resign`,
                { list: r }
              );
            });
          }
        }
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
