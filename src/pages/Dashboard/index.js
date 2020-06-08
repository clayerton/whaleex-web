import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { injectIntl } from 'react-intl';
import injectReducer from 'dyc/utils/injectReducer';
import { Layout, Icon, Menu } from 'antd';
import {
  MenuTop,
  Breadcrumb,
  LanguageSelector,
  UserMenu,
  M,
} from 'whaleex/components';
import HelpAction from 'whaleex/components/HelpAction';
import AppDownload from 'whaleex/components/AppDownload';
import {
  AppDownload as AppDownloadPage,
  NotFound,
  Maintenance,
  HomePage,
} from 'whaleex/pages/Dashboard/containers';
import PageFooter from 'whaleex/common/footer';
import {
  StyledLayout,
  StyledHeader,
  StyledContentFlow,
  StyledContentStatic,
} from './style.js';
const logo = _config.cdn_url + '/web-static/imgs/logo/logo.png';
const logo2 = _config.cdn_url + '/web-static/imgs/logo/logo2.png';
const minerHeader =
  _config.cdn_url + '/web-static/imgs/web/minePage/head_mining.png';
import { pageMap, unZip, shouldShowMaintenance } from 'whaleex/routeMap';
import * as allActions from 'whaleex/common/actions.js';
import { changeLocale } from 'containers/LanguageProvider/actions.js';

import reducer from './reducer';
const { Header, Footer, Sider } = Layout;
class DashboardRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  urlJump = (path, pure) => () => {
    if (path === '/login') {
      _czc.push(['_trackEvent', '头部登录入口', '点击']);
    } else if (path === '/register') {
      _czc.push(['_trackEvent', '头部注册入口', '点击']);
    }
    const { baseRoute, prefix = '' } = this.props;
    if (pure) {
      this.props.history.push([path].join(''));
    } else {
      this.props.history.push([baseRoute, prefix, path].join(''));
    }
  };
  wrapHeader = (Comp, wrap, path) => {
    /**
     * 包裹头部和面包屑
     */
    const { match, history, baseRoute, prefix } = this.props;
    if (!wrap) {
      return <Comp {...this.props} />;
    }
    let color = '#fff';
    let ContentWrap = StyledContentFlow;
    if (path === '/homePage' || path === '/' || path === '') {
      color = 'transparent';
      ContentWrap = StyledContentStatic;
    } else if (path === '/eosworld' || path === '/minePage') {
      color = 'dark-transparent';
      ContentWrap = StyledContentStatic;
    }
    return (
      <StyledLayout style={{ minHeight: '100vh' }}>
        <StyledHeader
          color={color}
          id={
            ((path === '/homePage' ||
              path === '/' ||
              path === '' ||
              path === '/eosworld' ||
              path === '/minePage') &&
              'home-page-header') ||
            ''
          }
        >
          <div className="menu-wrap">
            <div className="logo">
              <div
                onClick={() => {
                  this.props.history.push('');
                }}
              >
                <i
                  className={
                    'iconfont icon-logo-white-traverse header-logo ' +
                      (['dark-transparent', 'transparent'].includes(color) &&
                        'white') || ''
                  }
                />
              </div>
            </div>
            <div className="info-wrap">
              <div className="menu-item">
                <span
                  onClick={() => {
                    const windowPath = window.location.pathname;
                    const r =
                      windowPath
                        .split('?')
                        .shift()
                        .match(/trade\/(?:orderBook\/)(.*)/) || [];
                    const symbolStr = r[1];
                    if (symbolStr) {
                      this.urlJump('/trade/' + symbolStr)();
                    } else {
                      this.urlJump(`/trade/${U.getLastSelectSymbol()}`)();
                    }
                  }}
                >
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
                  rel="nofollow"
                  href="https://github.com/WhaleEx/API"
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
                  logout={this.props.actions.logout}
                  permissions={this.props.permissions}
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
                updateUserConfig={this.props.actions.updateUserConfig}
                locale={this.props.language.locale}
                curLan={_.get(this.props, 'userConfig.language')}
              />
            </div>
            {/*  <span>{sessionStorage.getItem('user')}</span>
            <a
              onClick={() => {
                this.props.actions.logout(history);
              }}
            >
              退出
            </a>*/}
          </div>
        </StyledHeader>
        <ContentWrap>
          <Comp {...this.props} />
        </ContentWrap>
      </StyledLayout>
    );
  };
  render() {
    const { baseRoute, prefix } = this.props;
    const {
      intl: { formatMessage },
    } = this.props;
    const top_url_matcher = {
      '/notFound': NotFound,
      '/download-web': AppDownloadPage,
      '/maintenance': Maintenance,
      '/': HomePage,
    };
    return (
      <div style={{ background: '#fff' }}>
        <Switch>
          <Route
            render={() => {
              return (
                <div>
                  <Helmet
                    title={formatMessage({ id: 'title' })}
                    meta={[
                      {
                        name: 'keywords',
                        content: formatMessage({ id: 'keywords' }),
                      },
                      {
                        name: 'description',
                        content: formatMessage({ id: 'description' }),
                      },
                    ]}
                  />
                  <Switch>
                    {unZip(pageMap)
                      .map(({ path, title, component: Comp }, i) => {
                        return (
                          <Route
                            key={i}
                            exact
                            path={[baseRoute, prefix, path].join('')}
                            render={props => {
                              if (shouldShowMaintenance(path)) {
                                return this.wrapHeader(Maintenance, true);
                              }
                              return this.wrapHeader(
                                Comp,
                                path !== '/trade' &&
                                  path !== '/trade/:symbolStr' &&
                                  path !== '/whaleex/dash/trade/:symbolStr',
                                path
                              );
                            }}
                          />
                        );
                      })
                      .concat(
                        Object.keys(top_url_matcher).map((path, i) => {
                          const CompTop = top_url_matcher[path];
                          return (
                            <Route
                              key={'top_' + i}
                              exact
                              path={path}
                              render={props => {
                                return this.wrapHeader(CompTop, true, path);
                              }}
                            />
                          );
                        })
                      )}
                    <Redirect to={[baseRoute, prefix, '/'].join('')} />
                  </Switch>
                </div>
              );
            }}
          />
        </Switch>
      </div>
    );
  }
}

DashboardRouter.propTypes = {
  match: PropTypes.object,
};
export const mapStateToProps = state => ({
  ...state.get('app'),
  language: state.get('language').toJS(),
});
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { changeLocale }),
    dispatch
  ),
});
const withReducer = injectReducer({ key: 'pages', reducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withReducer,
    withConnect
  )(DashboardRouter)
);
