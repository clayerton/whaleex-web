/** Copyright © 2013-2017 DataYes, All Rights Reserved. */
import Cookies from 'js-cookie';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import injectReducer from 'utils/injectReducer';
import styled, { ThemeProvider } from 'styled-components';
import context from 'whaleex/utils/service';
import { Spin, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import {
  changeLocale,
  changeTheme,
  getTheme,
} from 'containers/LanguageProvider/actions.js';
import 'ant-design-pro/dist/ant-design-pro.css';
// Import CSS reset and Global Styles
import 'whaleex/global-styles';
import 'whaleex/style/main.less';
import routes from 'whaleex/routes';
import * as allActions from './actions';
import * as allChainActions from './actionsChain';
import U from 'whaleex/utils/extends';
window.U = U;
import reducer from './reducer';
import { addCnzzListener } from './cnzz.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class App extends Component {
  constructor(props) {
    super(props);
    window.walHistory = this.props.history; // 可在任何地方进行路由跳转
    this.props.actions.changeTheme();
    this.props.actions.getLoginToken(isLogin => {
      this.props.actions.getCommonData();
      if (!isLogin) {
        const isNoJumpPage = this.noJumpPage(props);
        this.props.actions.changeLocale(U.getUserLan());
        // 未登录的情况下 用户会被定位到登录页面 不会出现notfound页面
        this.props.actions.logout(this.props.history, isNoJumpPage);
      } else {
        this.props.actions.initialApp(lan => {
          this.props.actions.changeLocale(
            sessionStorage.getItem('userLan') || lan
          ); //tmplz-1
        });
      }
    });
    this.state = {
      resigned: false,
    };
    // context.initialize();
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  componentWillReceiveProps(nextProps, nextState) {
    const { resigned } = this.state;
    const _url = _.get(nextProps, 'location.pathname');
    const url = _.get(this.props, 'location.pathname');
    if (url !== _url) {
      this.logoutRedirect(nextProps);
    }
    const {
      pubKey,
      eosAccount,
      currencyListObj,
      eosConfig,
      userUniqKey,
      publicSymbolObj,
    } = nextProps;
    if (
      _config.order_resign === 'true' &&
      !resigned &&
      pubKey &&
      eosAccount &&
      currencyListObj &&
      eosConfig &&
      userUniqKey &&
      publicSymbolObj
    ) {
      this.setState({ resigned: true });
      this.props.actions.resign(
        {},
        {
          pubKey,
          eosAccount,
          currencyListObj,
          eosConfig,
          userUniqKey,
          publicSymbolObj,
        }
      );
    }
  }
  componentDidMount() {
    this.props.actions.globalPublicData();
    this.logoutRedirect();
    setTimeout(() => {
      addCnzzListener();
    }, 1000);
  }
  noJumpPage = props => {
    //在未登录时不会跳转的页面
    const pages = [
      'login',
      'register',
      'forgetPwd',
      'homePage',
      'download-web',
      'trade',
      'notFound',
      'maintenance',
      'eosworld',
      'minePage',
      'market',
      '/',
      '',
    ];
    const curPage = _.get(props, 'location.pathname', '/')
      .split('/')
      .pop();
    const pathname = _.get(props, 'location.pathname', '/');
    return pages.includes(curPage) || pathname.includes('/trade');
  };
  logoutRedirect = async props => {
    //注册页面等 不跳转
    const isNoJumpPage = this.noJumpPage(props || this.props);
    let isLogin = await context.user.isLogin();
    const pathname = _.get(props || this.props, 'location.pathname', '/');
    if (
      !(isLogin || sessionStorage.getItem('user')) &&
      pathname.includes('/trade')
    ) {
      this.props.actions.initialTrade();
    } else if (!(isLogin || sessionStorage.getItem('user')) && !isNoJumpPage) {
      const path = [BASE_ROUTE, prefix, '/login'].join('');
      this.props.history.push(path);
    }
  };
  render() {
    const {
      location: { search },
      locale,
    } = this.props;
    const IsLoginPage =
      _.get(this.props, 'location.pathname', '/')
        .split('/')
        .pop() === 'login';
    const isNoJumpPage = this.noJumpPage(this.props);
    const pathname = _.get(this.props, 'location.pathname', '/');
    if (
      (!pathname.includes('/trade') &&
        !isNoJumpPage &&
        !sessionStorage.getItem('userId')) ||
      !locale
    ) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    // {!IsLoginPage && <Header {...this.props} />}
    return (
      <div style={{ height: '100%' }} className={'whaleex'}>
        <LocaleProvider locale={(locale === 'zh' && zhCN) || enUS}>
          <ThemeProvider
            theme={() => {
              return getTheme();
            }}
          >
            <div className={`main ${(IsLoginPage && 'loginPage') || ''}`}>
              {routes}
            </div>
          </ThemeProvider>
        </LocaleProvider>
        {
          // <Footer />
        }
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    ...state.get('app'),
    ...state.get('language').toJS(),
  };
};

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign(
      {},
      allActions,
      { changeLocale, changeTheme },
      allChainActions
    ),
    dispatch
  ),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: 'app', reducer });
export default compose(
  withRouter,
  withReducer,
  withConnect
)(App);
