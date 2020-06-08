import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Icon, Menu, notification, Spin } from 'antd';
import Cookies from 'js-cookie';
import { Switch } from 'whaleex/components';
const logo = _config.cdn_url + '/web-static/imgs/logo/logo.png';
const logo2 = _config.cdn_url + '/web-static/imgs/logo/logo2.png';
import Styled from 'styled-components';
import U from 'whaleex/utils/extends';
import Helmet from 'react-helmet';
import CoinDetail from './components/coinDetail.js';
import { unitMap, colorMap } from 'whaleex/utils/dollarMap.js';
import {
  StyledLayout,
  StyledHeader,
  StyledContent,
} from 'whaleex/pages/Dashboard/style.js';
import { StyledViewWrap, CoinDetailSpan } from './style/style.js';
import {
  OrderBook,
  TradeHistory,
  OrderHistory,
  OrderInput,
  LanguageSelector,
  M,
  SymbolSwitch,
  UserMenu,
  TradingView,
  DeepView,
} from 'whaleex/components';
//TODO why cant import direct
import HelpAction from 'whaleex/components/HelpAction';
import AppDownload from 'whaleex/components/AppDownload';
import './style/layout.less';
import './style/style.less';
import {
  clearTradeInfo,
  initTradeInfo,
  getUserAsset,
  submitDelegate,
  getAllDelegate,
  cancelOrder,
  getSymbolMarket,
  stopWebsocket,
  getDeepData,
  getIds,
  getNextId,
  getNextIdList,
  getUserFee,
  submitDelegate2,
  getNewsList,
  getDepth,
} from './actions';
import {
  logout,
  login,
  updateUserConfig,
  getUserConfig,
  getAllSymbolMarket,
  getUserPkStatus,
  getSymbolList,
  getStakeFor,
  setStakeFor,
} from 'whaleex/common/actions.js';
import * as subscribe from 'whaleex/common/actionsSubscribe.js';
import { changeLocale } from 'containers/LanguageProvider/actions.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let timer = {};
const ExtraDiv = Styled.div`
  margin: 0 10px;
`;
export class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: U.getSearch('tab') || 0,
      activeTab_2: U.getSearch('tab') || 0,
      paginationPage: {},
      orderInput: {
        userInput: {
          sell: {
            price: undefined,
            quantity: undefined,
          },
          buy: {
            price: undefined,
            quantity: undefined,
          },
        },
      },
      initialValue: {},
      tabIdx: 1,
      checked: true,
      MINEING: false,
    };
  }
  componentDidMount() {
    const {
      history,
      publicSymbol = [],
      match: { params },
    } = this.props;
    if (!_.isEmpty(publicSymbol)) {
      this.pageInit(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const isChanged = U.isObjDiff([nextProps, this.props], ['match.params']);
    if (isChanged || !timer.getAllDelegateT) {
      this.setState({
        tabIdx: 1,
        orderInput: {
          userInput: {
            sell: {
              price: undefined,
              quantity: undefined,
            },
            buy: {
              price: undefined,
              quantity: undefined,
            },
          },
        },
      });
      this.pageInit(nextProps);
    }
    const { userUniqKey, userPkStatus, pubKey } = this.props;
    const {
      userUniqKey: _userUniqKey,
      userPkStatus: _userPkStatus,
      pubKey: _pubKey,
    } = nextProps;
    if (
      (!userUniqKey || _.isEmpty(userPkStatus) || !pubKey) &&
      _userUniqKey &&
      !_.isEmpty(_userPkStatus) &&
      _pubKey
    ) {
      this.props.getIds({ pk: _pubKey, userUniqKey: _userUniqKey });
    }
  }
  componentWillUnmount() {
    Object.keys(timer).forEach(key => {
      clearTimeout(timer[key]);
    });
    timer = {};
    // clearTimeout(window.getWhaleDataTimer);
    // TODO 记得关注下停止websocket的情况 是否会有异常
    this.props.stopWebsocket();
  }
  setMineStart = () => {
    this.setState({
      MINEING: true,
      activeTab: 2,
      activeTab_2: 0,
    });
  };
  setMineEnd = () => {
    this.setState({
      MINEING: false,
      activeTab: 2,
      activeTab_2: 0,
    });
  };
  getCurSymbol = props => {
    const { match, publicSymbol } = props || this.props;
    const [baseCurrency, quoteCurrency] = (match.params.symbolStr || '').split(
      '_'
    );
    let curSymbol = publicSymbol.filter(i => {
      return (
        i.baseCurrency === baseCurrency && i.quoteCurrency === quoteCurrency
      );
    })[0];
    if (!curSymbol) {
      curSymbol = publicSymbol[0];
    }
    return curSymbol;
  };
  /**
   * 首次进入或切换交易对时  页面初始化
   */
  pageInit = props => {
    this.toogleExpandCoinDetail(false); //关闭币种详情展开
    Object.keys(timer).forEach(key => {
      clearTimeout(timer[key]);
    });
    timer = {};
    //清空所有数据
    this.props.clearTradeInfo();
    this.setOrderState(undefined, {
      quantity: undefined,
      price: undefined,
      keytype: 'keytype',
    });
    clearInterval(window.tvtimer);
    const isCustomer = !sessionStorage.getItem('userId');
    const {
      match,
      publicSymbol,
      pubKey,
      userUniqKey,
      app,
      userPkStatus = {},
    } = props;
    let userPhone = _.get(props, 'app.userConfig.phone', '');
    userPhone = userPhone || '';
    const [baseCurrency, quoteCurrency] = (
      match.params.symbolStr ||
      Cookies.get(`lastSelectSymbol`) ||
      ''
    ).split('_');
    if (match.params.symbolStr) {
      Cookies.set(`lastSelectSymbol`, match.params.symbolStr);
    }
    if (!_.isEmpty(publicSymbol)) {
      let curSymbol = publicSymbol.filter(i => {
        return (
          i.baseCurrency === baseCurrency && i.quoteCurrency === quoteCurrency
        );
      })[0];
      if (!match.params.symbolStr || !curSymbol) {
        curSymbol = curSymbol || publicSymbol[0];
        const { baseCurrency, quoteCurrency } = curSymbol;
        const path = `/trade/${baseCurrency}_${quoteCurrency}`;
        this.props.history.push([BASE_ROUTE, prefix, path].join(''));
        return;
      }
      window.curActiveSymbolId = curSymbol.id;
      //初始化交易页面
      this.props.initTradeInfo(
        curSymbol,
        undefined,
        undefined,
        ({ asks, bids }) => {
          // this.setState({ initialValue: { sell: asks[1], buy: bids[1] } });
        }
      );
      !isCustomer && this.props.getUserFee(curSymbol); //交易对手续费
      const loopAskId = () => {
        clearTimeout(timer.getNewIds);
        if (userPkStatus.status === 'ACTIVED') {
          this.props.getIds({ pk: pubKey, userUniqKey });
        }
        timer.getNewIds = setTimeout(() => {
          !_config.stop_request_roll && loopAskId();
        }, 1000 * 60 * 40);
      };
      !isCustomer && loopAskId();
      const loop = () => {
        clearTimeout(timer.getAllDelegateT);
        //获取手续费 获取 用户资产
        !isCustomer && this.props.getUserAsset(curSymbol);
        !isCustomer && this.props.getStakeFor();
        this.props.getSymbolList();
        // 不可删 清除轮询
        //获取用户 委托即历史成交
        const { checked } = this.state;
        !isCustomer && this.getAllDelegate((checked && curSymbol) || undefined);
        // this.props.getAllDelegate(
        //   (this.state.checked && curSymbol) || undefined,
        //   0,
        //   1000
        // );
        //获取pk状态
        const needAuth = !_.get(this.props.app, 'userConfig.idCardVerify');
        const loopAskPkStatus =
          _.get(this.props.app, 'userPkStatus.status') !== 'ACTIVED';
        if (!isCustomer) {
          needAuth && this.props.getUserConfig(); //身份审核？
          loopAskPkStatus && this.props.getUserPkStatus(this.props.app.pubKey); //pk status？
        }
        timer.getAllDelegateT = setTimeout(() => {
          !_config.stop_request_roll && loop();
        }, 5000);
      };
      loop();
      //TODO need to small
      const loopMarket = () => {
        clearTimeout(timer.getMarket);
        //获取深度数据 深度100
        this.props.getDepth(curSymbol);
        // this.props.getDeepData(curSymbol,100);
        //获取交易对行情
        this.props.getSymbolMarket(curSymbol);
        timer.getMarket = setTimeout(() => {
          !_config.stop_request_roll && loopMarket();
        }, 5000);
      };
      loopMarket();
    }
  };
  getAllDelegate = (symbol, paginationPageProps, activeTabProps) => {
    const { activeTab, activeTab_2, paginationPage } = this.state;
    const {
      trade: { store },
    } = this.props;
    const partition = _.get(store, `symbol.partition`);
    this.props.getAllDelegate(
      symbol,
      paginationPageProps || paginationPage || {},
      () => {},
      activeTabProps || activeTab,
      activeTab_2,
      partition
      // params
    );
  };
  onSwitch = checked => {
    this.setState({ checked });
    if (!checked) {
      //显示所有交易对
      this.getAllDelegate(undefined);
    } else {
      const { publicSymbol, match } = this.props;
      const [baseCurrency, quoteCurrency] = (
        match.params.symbolStr || ''
      ).split('_');
      let curSymbol = publicSymbol.filter(i => {
        return (
          i.baseCurrency === baseCurrency && i.quoteCurrency === quoteCurrency
        );
      })[0];
      this.getAllDelegate({ id: curSymbol.id });
    }
  };
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
  setOrderState = (type = 'sell', value) => {
    this.setState(preState => {
      const stateClone = _.cloneDeep(preState);
      // TODO 不好对逻辑
      const { quantity, price, keytype } = value;
      stateClone.orderInput.userInput['sell'] = {
        quantity,
        price,
        keytype,
      };
      stateClone.orderInput.userInput['buy'] = {
        quantity,
        price,
        keytype,
      };
      return Object.assign({}, stateClone, {
        [`forceUpdateTimersell`]: +new Date(),
        [`forceUpdateTimerbuy`]: +new Date(),
      });
    });
  };
  clearOrderStateClickType = () => {
    this.setState(preState => {
      const stateClone = _.cloneDeep(preState);
      stateClone.orderInput.userInput.sell.keytype = '';
      stateClone.orderInput.userInput.buy.keytype = '';
      return stateClone;
    });
  };
  changeActiveTab = (key, source) => {
    const { checked, paginationPage = {} } = this.state;
    let curSymbol = this.getCurSymbol(this.props);
    this.setState({ [`activeTab${(source && `_${source}`) || ''}`]: key });
    this.getAllDelegate(checked ? curSymbol : undefined, paginationPage, key);
  };
  nextPage = tabKey => () => {
    this.setState(preState => {
      let { paginationPage = {}, checked } = preState;
      let curSymbol = this.getCurSymbol(this.props);
      let prePage = paginationPage[tabKey] || 0;
      paginationPage = { ...paginationPage, [tabKey]: prePage + 1 };
      preState.paginationPage = paginationPage;
      if (tabKey === 'news') {
        const {
          trade: { store },
        } = this.props;
        const lastData = _.get(store, 'news.content', []);
        this.props.getNewsList(
          { page: prePage + 1, symbol: curSymbol },
          lastData
        ); //start 0
      } else {
        this.getAllDelegate(checked ? curSymbol : undefined, paginationPage);
      }
      return preState;
    });
  };
  submitDelegateNeedId = ({
    expressId,
    order,
    callBack,
    waitBack,
    sendWait,
  }) => {
    const {
      store: { symbol = {}, feeRate = {}, signIds = {} },
    } = this.props.trade;
    const {
      currencyListObj,
      eosAccount: { eosAccount },
      userUniqKey,
      pubKey,
      userConfig,
      eosConfig,
    } = this.props;

    const delegateParams = Object.assign({}, order, {
      // sideMode
      // priceMode
      // price
      // quantity
      userEosAccount: eosAccount,
      symbol,
      currencyListObj,
      feeRate,
      expressId,
      publicKey: pubKey,
      exEosAccount: _.get(eosConfig, 'result.exEosAccount'), //"whaleexchang"
      userUniqKey,
      // bindMemo: (!isActived && `bind:${pubKey}:WhaleEx`) || '', //需要激活带上bindmemo
    });
    this.props.submitDelegate2(
      delegateParams,
      (r, orderId) => {
        this.getAllDelegate(this.state.checked ? symbol : undefined);
        //用户下单后立刻执行行情刷新请求
        this.props.getSymbolMarket(symbol);
        callBack && callBack(r, orderId);
      },
      waitBack,
      sendWait
    );
  };
  getNextIdListFunc = remark => {
    const { userUniqKey, pubKey } = this.props;
    return getNextIdList({ pk: pubKey, userUniqKey, remark });
  };
  submitDelegate = (order, callBack) => {
    //order { sideMode, priceMode, quantity, price }
    const {
      store: { symbol = {}, feeRate = {}, signIds = {} },
    } = this.props.trade;
    const {
      currencyListObj,
      eosAccount: { eosAccount },
      userUniqKey,
      pubKey,
      userConfig,
      eosConfig,
      currentStakeFor,
    } = this.props;

    this.props.getNextId({
      signIds,
      pk: pubKey,
      userUniqKey,
      callBack: (expressId, remark) => {
        let currentStakeForAccount =
          order.sideMode === 'BUY' && symbol.partition === 'CPU'
            ? currentStakeFor || eosAccount
            : undefined;
        const delegateParams = Object.assign({}, order, {
          // sideMode
          // priceMode
          // price
          // quantity
          userEosAccount: eosAccount,
          symbol,
          currencyListObj,
          feeRate,
          expressId,
          publicKey: pubKey,
          exEosAccount: _.get(eosConfig, 'result.exEosAccount'), //"whaleexchang"
          currentStakeForAccount,
          userUniqKey,
          remark,
          // bindMemo: (!isActived && `bind:${pubKey}:WhaleEx`) || '', //需要激活带上bindmemo
        });
        setTimeout(() => {
          this.props.submitDelegate(delegateParams, (r, orderId) => {
            this.getAllDelegate(this.state.checked ? symbol : undefined);
            //用户下单后立刻执行行情刷新请求
            this.props.getSymbolMarket(symbol);
            callBack && callBack(r, orderId); //用户输入清零
            this.messageAlert(r);
          });
        }, 500);
      },
    });
  };
  cancelDelegate = (order, noMsg) => {
    const { cancelDelegateFuncDisable } = this.state;
    if (!cancelDelegateFuncDisable || noMsg === 'noMsg') {
      this.setState({ cancelDelegateFuncDisable: true });
      const {
        store: { symbol = {} },
      } = this.props.trade;
      const {
        pubKey,
        intl: { formatMessage },
        userUniqKey,
      } = this.props;
      this.props.cancelOrder(
        Object.assign({}, order, {
          symbol,
          publicKey: pubKey,
          userUniqKey,
        }),
        r => {
          this.getAllDelegate(this.state.checked ? symbol : undefined);
          setTimeout(() => {
            this.setState({ cancelDelegateFuncDisable: false });
          }, 1000);
          noMsg !== 'noMsg' && this.messageAlert(r, 'cancel');
        }
      );
    }
  };
  messageAlert = (delegateResult, type) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const { returnCode, message, msg = message, errorCode } = delegateResult;
    const successMsg =
      (type === 'cancel' && formatMessage({ id: 'trade.orderCancel' })) ||
      formatMessage({ id: 'trade.orderUpdate' });
    notification.open({
      message: <span>{formatMessage({ id: 'trade.orderNotice' })}</span>,
      description:
        (returnCode === '0' && successMsg) ||
        (msg || `${formatMessage({ id: 'auth.networkErr' })}`),
      icon: (returnCode === '0' && (
        <Icon type="check-circle" style={{ color: 'rgb(87, 212, 170)' }} />
      )) || (
        <Icon
          type="exclamation-circle"
          style={{ color: 'rgb(217, 242, 94)' }}
        />
      ),
    });
  };
  setStateValue = (key, value) => {
    this.setState({ [key]: value });
  };
  toogleExpandCoinDetail = value => {
    const preStatus = this.state.CoinDetailExpand;
    if (value !== undefined) {
      this.setState({ CoinDetailExpand: value });
      return;
    }
    this.setState({ CoinDetailExpand: !preStatus });
  };
  render() {
    let {
      intl: { formatNumber },
    } = this.props;
    const isCustomer = !sessionStorage.getItem('userId');
    const {
      match: {
        params: { id: dashboardId },
        path,
      },
      history,
      trade: { store },
      app,
      convertMap = {},
      convertMap_digital = {},
      publicSymbol,
      publicQuotable,
      allSymbolMarket = [],
      legalTender,
      subscribe,
      subscription,
      currencyList,
      currencyListObj,
      symbolPartition,
      currentStakeFor,
    } = this.props;
    let {
      orderInput: { userInput },
      tabIdx,
      forceUpdateTimerbuy,
      forceUpdateTimersell,
      checked,
      activeTab,
      activeTab_2,
      initialValue,
      MINEING,
      CoinDetailExpand,
    } = this.state;
    const symbol = _.get(store, 'symbol', {});
    const isCpuSymbol = _.get(symbol, 'partition') === 'CPU';
    if (
      _.isEmpty(symbol) ||
      _.isEmpty(publicSymbol) ||
      _.isEmpty(currencyList)
    ) {
      return (
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    const symbolMarket = _.get(store, 'symbolMarket', {});
    const asks = _.get(store, 'orderBook.asks', []);
    const bids = _.get(store, 'orderBook.bids', []);
    const {
      lastPrice,
      priceChangePercent,
      high,
      low,
      baseVolume,
    } = symbolMarket;
    const marketTrend =
      (priceChangePercent > 0 && 'upper') ||
      (priceChangePercent < 0 && 'lower') ||
      'sideway';
    const symbolSwitchProps = {
      quotable: publicQuotable,
      symbolMarket: publicSymbol,
      symbolPartition,
      symbol,
      subscription,
      currencyList,
      convertMap,
      convertMap_digital,
      legalTender,
      actions: this.props, //getSymbolList
      history,
      currencyListObj,
      app,
    };
    let symbolCanMine =
      _.get(
        app,
        `whaleData.symbolsRemain.${symbol.baseCurrency}${symbol.quoteCurrency}`,
        false
      ) && !_config.disableMineList.split(',').includes(symbol.name);
    const orderBookProps = {
      asks,
      bids,
      latestTrade: _.get(store, 'latestTrade', {}),
      symbol,
      convertMap,
      convertMap_digital,
      legalTender,
      history,
      symbolMarket,
      isCpuSymbol,
    };
    const tradeHistoryProps = {
      list: _.get(store, 'latestTradeList', []),
      symbol,
      isCpuSymbol,
    };
    const orderInputProps = Object.assign(
      { baseAsset: {}, quoteAsset: {} },
      _.pick(store, ['baseAsset', 'quoteAsset', 'symbol']),
      {
        convertMap,
        convertMap_digital,
        legalTender,
        submitDelegate: this.submitDelegate,
        getNextIdList: this.getNextIdListFunc,
        submitDelegateNeedId: this.submitDelegateNeedId,
        cancelDelegate: this.cancelDelegate,
        clearOrderStateClickType: this.clearOrderStateClickType,
        initialValue, //asks,bids
        app,
        history,
        forceUpdateTimerbuy,
        forceUpdateTimersell,
        orderBook: store.orderBook,
        actions: this.props,
        setMineStart: this.setMineStart,
        setMineEnd: this.setMineEnd,
        symbolCanMine,
        isCpuSymbol,
        currentStakeFor,
      }
    );
    const orderHistoryProps = {
      isCpuSymbol,
      publicSymbol,
      symbol, //当前交易对
      convertMap,
      convertMap_digital,
      legalTender,
      superProps: { checked },
      tabsData: {
        tabOpenOrder: _.get(store, 'delegate', {}),
        tabHistoryOrder: _.get(store, 'delegatehistory', {}),
        tabHistoryTrade: _.get(store, 'delegateexecHistory', []),
        tabNews: _.get(store, 'news', {}),
      },
      ExtraContent:
        (!isCustomer && (
          <ExtraDiv>
            <Switch checked={checked} onSwitch={this.onSwitch} />
          </ExtraDiv>
        )) ||
        null,
      activeTab,
      activeTab_2,
      changeActiveTab: this.changeActiveTab,
      cancelDelegate: this.cancelDelegate,
      callBacks: {
        tabOpenOrder: { nextPage: this.nextPage('tabOpenOrder') },
        tabHistoryOrder: { nextPage: this.nextPage('tabHistoryOrder') },
        tabHistoryTrade: { nextPage: this.nextPage('tabHistoryTrade') },
        tabNews: { nextPage: this.nextPage('news') },
      },
    };

    const DeepProps = {
      ..._.get(store, 'deepData', { asks: [], bids: [] }),
      symbol,
    };
    const TradingViewProps = {
      symbol: symbol.name,
      tabIdx,
      setTabIdx: this.setStateValue.bind(null, 'tabIdx'),
      MINEING,
    };
    const currencyObj = _.get(this.props, 'trade.store.currencyDetail', {});
    return (
      <StyledLayout style={{ height: '100vh' }}>
        <StyledHeader>
          <Helmet
            title={`${(legalTender && unitMap[legalTender]) ||
              ''}${(lastPrice &&
              formatNumber(
                (
                  lastPrice *
                    convertMap_digital[symbol.quoteCurrency] *
                    convertMap['EOS'] || 0
                ).toFixed(2)
              )) ||
              ''} - ${symbol.baseCurrency}/${symbol.quoteCurrency} | WhaleEx`}
          />
          <div className="trade-menu-wrap">
            <div className="logo">
              <div
                onClick={() => {
                  this.props.history.push('');
                }}
              >
                <i
                  className={'iconfont icon-logo-white-traverse header-logo '}
                />
              </div>
            </div>
            <div className="info-wrap">
              <div className="coin-pair">
                <SymbolSwitch {...symbolSwitchProps} />
              </div>
              <CoinDetailSpan
                onClick={() => {
                  this.toogleExpandCoinDetail();
                }}
              >
                <i className="iconfont icon-nav_tread_coindetai" />
                <M id="trade.coinIntroduce" />
              </CoinDetailSpan>
              <div className="tips-wrap">
                {(!isCpuSymbol && (
                  <div className="symbol-tips">
                    <div
                      className="bigNum"
                      style={{ color: colorMap[marketTrend] }}
                    >
                      <span>{lastPrice}</span>
                    </div>
                    <div className="smallNum">
                      <span>
                        ≈{legalTender && unitMap[legalTender]}
                        {U.formatLegalTender(
                          lastPrice *
                            convertMap_digital[symbol.quoteCurrency] *
                            convertMap['EOS']
                        )}
                      </span>
                      <span style={{ color: colorMap[marketTrend] }}>
                        <span>{(priceChangePercent > 0 && '+') || ''}</span>
                        {(priceChangePercent * 100 || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )) ||
                  null}
                {(isCpuSymbol && (
                  <div className="tips">
                    <span>
                      <M id="trade.interest" />
                    </span>
                    <div>
                      <span>{U.getPercentFormat(lastPrice)}</span>
                      <span
                        style={{
                          color: colorMap[marketTrend],
                          marginLeft: '10px',
                        }}
                      >
                        <span>{(priceChangePercent > 0 && '+') || ''}</span>
                        {(priceChangePercent * 100 || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )) ||
                  null}
                <div className="tips">
                  <span>
                    <M id="trade.24High" values={{ data: 24 }} />
                  </span>
                  <span>
                    {!isCpuSymbol
                      ? high
                      : `${(high && (high * 100).toFixed(2)) || '--'}%`}
                  </span>
                </div>
                <div className="tips">
                  <span>
                    <M id="trade.24Low" values={{ data: 24 }} />
                  </span>
                  <span>
                    {!isCpuSymbol
                      ? low
                      : `${(low && (low * 100).toFixed(2)) || '--'}%`}
                  </span>
                </div>
                <div className="tips">
                  <span>
                    <M id="trade.24Volume" values={{ data: 24 }} />
                  </span>
                  <span>{baseVolume}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="header-right-action">
            {(sessionStorage.getItem('userId') && (
              <div className="user-menu">
                <span
                  onClick={this.urlJump('/market')}
                  style={{ marginRight: 24 }}
                >
                  <M id="route.market" />
                </span>
                <UserMenu
                  history={history}
                  logout={this.props.logout}
                  permissions={this.props.permissions}
                />
              </div>
            )) || (
              <div className="user-menu">
                <span
                  onClick={this.urlJump('/market')}
                  style={{ marginRight: 24 }}
                >
                  <M id="route.market" />
                </span>
                <span onClick={this.urlJump('/login')} id="head_login">
                  <M id="common.login" />
                </span>
                <span
                  onClick={this.urlJump('/register')}
                  style={{ marginLeft: '20px' }}
                  id="head_register"
                >
                  <M id="common.reg" />
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
                changeLocale={this.props.changeLocale}
                updateUserConfig={this.props.updateUserConfig}
                locale={this.props.language.locale}
                curLan={_.get(this.props, 'userConfig.language')}
              />
            </div>
          </div>
        </StyledHeader>
        <StyledContent
          data={!!CoinDetailExpand}
          style={{ backgroundColor: '#f6f8fa' }}
        >
          {(CoinDetailExpand && (
            <CoinDetail currencyObj={currencyObj} isCpuSymbol={isCpuSymbol} />
          )) ||
            null}
          <div className="trade-wrap">
            <StyledViewWrap
              className={`kline shadowBox ${(tabIdx && 'deep-tab') ||
                'kline-tab'}`}
            >
              {(MINEING && (
                <OrderHistory {...orderHistoryProps} MINEING={MINEING} />
              )) ||
                null}
              <TradingView
                {...TradingViewProps}
                className="KlineChart"
                tabIdx={tabIdx}
              />
              {(tabIdx === 0 && !MINEING && (
                <DeepView className="DeepChart" {...DeepProps} />
              )) ||
                null}
            </StyledViewWrap>
            <div className="order-tool">
              <div className="order shadowBox">
                <div className="order-book">
                  {!_.isEmpty(store.symbol) && (
                    <OrderBook
                      {...orderBookProps}
                      onClickBookItem={this.setOrderState}
                    />
                  )}
                </div>
                <div className="order-history">
                  <TradeHistory {...tradeHistoryProps} />
                </div>
              </div>
              <div className="operation shadowBox">
                <OrderInput userInput={userInput} {...orderInputProps} />
              </div>
            </div>
            <div className="history shadowBox">
              <OrderHistory
                {...orderHistoryProps}
                MINEING={MINEING}
                source="2"
              />
            </div>
          </div>
        </StyledContent>
      </StyledLayout>
    );
  }
}

Trade.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return {
    app: state.get('app'),
    trade: state.get('pages').trade.toJS(),
    language: state.get('language').toJS(),
  };
}

export const mapDispatchToProps = {
  clearTradeInfo,
  initTradeInfo,
  getUserFee,
  getUserConfig,
  getUserPkStatus,
  getUserAsset,
  submitDelegate,
  getAllDelegate,
  cancelOrder,
  getSymbolMarket,
  getSymbolList,
  changeLocale,
  getAllSymbolMarket,
  stopWebsocket,
  logout,
  updateUserConfig,
  getDeepData,
  getIds,
  getNextId,
  login,
  submitDelegate2,
  getStakeFor,
  setStakeFor,
  getNewsList,
  getDepth,
  ...subscribe,
};

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Trade)
);
