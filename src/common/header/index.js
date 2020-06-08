/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import React, { Component } from 'react';

import CSSModules from 'react-css-modules';
import { Dropdown } from 'antd';
import { StyledHeader } from 'whaleex/pages/Dashboard/style.js';
import { LanguageSelector, UserMenu, M } from 'whaleex/components';
import HelpAction from 'whaleex/components/HelpAction';
import AppDownload from 'whaleex/components/AppDownload';
import ThemeSwitch from 'whaleex/components/ThemeSwitch';
import context from 'whaleex/utils/service';
// context.user.isLogin()
import styles from './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const logo = _config.cdn_url + '/web-static/imgs/logo/logo.png';
const logo2 = _config.cdn_url + '/web-static/imgs/logo/logo2.png';
const minerHeader =
  _config.cdn_url + '/web-static/imgs/web/minePage/head_mining.png';
@CSSModules(styles, { allowMultiple: true })
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: '',
    };
  }
  urlJump = (path, pure) => () => {
    if (path === '/login') {
      _czc.push(['_trackEvent', '头部登录入口', '点击']);
    } else if (path === '/register') {
      _czc.push(['_trackEvent', '头部注册入口', '点击']);
    }
    if (pure) {
      this.props.history.push([path].join(''));
    } else {
      this.props.history.push([BASE_ROUTE, prefix, path].join(''));
    }
  };
  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  render() {
    const { actions, history } = this.props;
    return (
      <StyledHeader>
        <div className="menu-wrap">
          <div className="logo">
            <div
              onClick={() => {
                this.props.history.push('');
              }}
            >
              <i className={'iconfont icon-logo-white-traverse header-logo '} />
            </div>
          </div>
          <div className="info-wrap">
            <div className="menu-item">
              <span onClick={this.urlJump(`/trade/${U.getLastSelectSymbol()}`)}>
                <M id="route.trade" />
              </span>
            </div>
            <div className="menu-item">
              <span onClick={this.urlJump('/market')}>
                <M id="route.market" />
              </span>
            </div>
            <div className="menu-item">
              <span
                onClick={() => {
                  window.location.href =
                    _config.static_url + '/static/node/news.html';
                }}
              >
                <M id="route.nodeEos" />
              </span>
            </div>
            {/* <div className="menu-item">
              <span onClick={this.urlJump('/eosworld')}>
                <M id="route.eosworld" />
              </span>
            </div> */}
            <div className="menu-item">
              <span
                onClick={() => {
                  window.open(
                    'https://static.whaleex.com.cn/whitepaper/WhaleEx_zh.1.12.pdf'
                  );
                }}
              >
                <M id="route.whitePaper" />
              </span>
            </div>
            <div className="menu-item">
              <span onClick={this.urlJump('/minePage')}>
                <M id="route.minePage" />
                <img src={minerHeader} className="small-logo" />
              </span>
            </div>
            <div className="menu-item">
              <span
                onClick={() => {
                  window.location.href =
                    _config.static_url + '/poster/index.html';
                }}
              >
                <M id="route.news" />
              </span>
            </div>
            <div className="menu-item">
              <a
                href="https://github.com/WhaleEx/API"
                ref="nofollow"
                target="_blank"
              >
                <span>API</span>
              </a>
            </div>
            {/* <div className="menu-item">
              <span>WAL分红</span>
            </div>
            <div className="menu-item">
              <span>EOS节点投票</span>
            </div>
            <div className="menu-item">
              <span>EOS LABS</span>
            </div> */}
          </div>
        </div>
        <div className="header-right-action">
          {(sessionStorage.getItem('userId') && (
            <div className="user-menu">
              <UserMenu
                history={history}
                logout={actions.logout}
                permissions={this.permissions}
              />
            </div>
          )) || (
            <div className="user-menu">
              <span onClick={this.urlJump('/login')} id="head_login">
                <M id="route.login" />
              </span>
              <span
                onClick={this.urlJump('/register')}
                style={{ marginLeft: '20px' }}
                id="head_register"
              >
                <M id="route.register" />
              </span>
            </div>
          )}
          <div>
            <AppDownload urlJump={this.urlJump} />
          </div>
          <div>
            <HelpAction />
          </div>
          <div className="language-action">
            <LanguageSelector
              changeLocale={this.props.actions.changeLocale}
              locale={this.props.language.locale}
            />
          </div>
          <ThemeSwitch changeTheme={this.props.actions.changeTheme} />
        </div>
      </StyledHeader>
    );
  }
}
