import React from 'react';
import _ from 'lodash';
import U from 'whaleex/utils/extends';
import PropTypes from 'prop-types';
import M from 'whaleex/components/FormattedMessage';
import OrderItem from './orderItem.js';
import OrderItemCPU from './orderItemCPU.js';
import './style.less';
import { Tabs } from 'antd';
import Cookies from 'js-cookie';
import { preCondition } from 'whaleex/components/preconditions';
import { injectIntl } from 'react-intl';
import MineTool from '../MineTool';
const TabPane = Tabs.TabPane;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class OrderInput extends React.Component {
  constructor(props) {
    super(props);
    const { userInput } = props;
    this.state = {
      userInput,
      priceMode: U.getSearch('priceMode') || 'LIMIT',
      MINEING: false,
    };
  }
  componentDidMount() {
    if (U.getSearch('priceMode') === 'MINE') {
      this.props.setMineStart();
    }
  }
  componentWillReceiveProps(nextProps) {
    // 控件外可能引起的状态更改
    if (!_.isEqual(nextProps.userInput, this.props.userInput)) {
      this.setState({ userInput: nextProps.userInput });
    }
    let symbolName = _.get(this.props, 'symbol.name');
    let _symbolName = _.get(nextProps, 'symbol.name');
    if (symbolName !== _symbolName) {
      this.props.setMineEnd();
      clearTimeout(window.mineTimer);
      window.mineTimer = 'End';
      this.setState({
        mineSettingObj: {},
        MINEING_SETTING: false,
        MINEING: false,
        priceMode: 'LIMIT',
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'userInput',
        'symbol',
        'baseAsset',
        'quoteAsset',
        'convertMap',
        'convertMap_digital',
        'legalTender',
        'BUYloading',
        'SELLloading',
        'forceUpdateTimerbuy',
        'forceUpdateTimersell',
        'app',
        'initialValue',
        'orderBook',
        'symbolCanMine',
        'isCpuSymbol',
        'currentStakeFor',
      ]
    );
    const isStateChanged = U.isObjDiff(
      [nextState, this.state],
      ['userInput', 'priceMode', 'MINEING', 'MINEING_SETTING']
    );
    if (isChanged || isStateChanged) {
      return true;
    }
    return false;
  }
  // setOrderState = (type = 'sell', key, value) => {
  //   this.setState(preState => {
  //     const preTypeState = preState.userInput[type];
  //     const typeState = { ...preTypeState, [key]: value };
  //     return {
  //       ...preState,
  //       userInput: {
  //         ...preState.userInput,
  //         [type]: {
  //           ...preTypeState,
  //           [key]: value,
  //         },
  //       },
  //     };
  //   });
  // };
  setPriceMode = v => {
    //LIMIT MARKET MINE
    if (this.state.MINEING) {
      return;
    }
    const { symbol } = this.props;
    const { baseCurrency, quoteCurrency } = symbol;
    const path = `/trade/${baseCurrency}_${quoteCurrency}?priceMode=${v}`;
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
    this.setState({ priceMode: v });
    if (v === 'MINE') {
      this.props.setMineStart();
      this.setState({ showMineSetting: true });
    } else {
      this.props.setMineEnd();
      this.setState({ showMineSetting: false });
    }
  };
  _setState = (key, value) => {
    this.setState(preState => {
      let _preState = _.cloneDeep(preState);
      _.set(_preState, key, value);
      return _preState;
    });
  };
  setMineStart = () => {
    this.setState({ MINEING: true });
  };
  setMineEnd = () => {
    this.setState({ MINEING: false });
  };
  showMineSettingDetail = () => {
    this.setState({ MINEING_SETTING: true });
  };
  hideMineSettingDetail = () => {
    this.setState({ MINEING_SETTING: false });
  };
  render() {
    const {
      quoteAsset,
      baseAsset,
      symbol,
      convertMap,
      convertMap_digital,
      legalTender,
      submitDelegate,
      clearOrderStateClickType,
      getNextIdList,
      submitDelegateNeedId,
      initialValue,
      app,
      history,
      forceUpdateTimerbuy,
      forceUpdateTimersell,
      actions,
      cancelDelegate,
      symbolCanMine,
      isCpuSymbol,
      currentStakeFor,
    } = this.props;
    const byPass = _.get(app, 'permissions.byPassword', true);
    const havePass = _.get(app, 'permissions.hasPassword', 'true');
    const {
      userInput,
      priceMode,
      MINEING,
      MINEING_SETTING,
      showMineSetting,
    } = this.state;
    const show = !_.isEmpty(symbol);
    const { tradeForbidden24h } = app.permissions || {};
    const canTrade24 = (
      <span className="canTrade24">
        <M id="trade.canTrade24" values={{ data: 24 }} />
      </span>
    );
    const { orderBook } = this.props;
    const mineProps = {
      orderBook,
      symbol,
      legalTender,
      convertMap,
      convertMap_digital,
      getNextIdList,
      submitDelegateNeedId,
      cancelDelegate,
      MINEING,
      MINEING_SETTING,
      setMineStart: this.setMineStart,
      setMineEnd: this.setMineEnd,
      app,
      history,
      extendData: { actions },
      mineSettingObj: this.state.mineSettingObj || {},
      showMineSettingDetail: this.showMineSettingDetail,
      hideMineSettingDetail: this.hideMineSettingDetail,
    };
    const OrderComp = (isCpuSymbol && OrderItemCPU) || OrderItem;
    return (
      <div className="order-input-box">
        <div className="title">
          <Tabs
            defaultActiveKey={priceMode}
            activeKey={priceMode}
            onChange={this.setPriceMode}
            className="with-baseline"
            tabBarExtraContent={
              (havePass === 'false' && (
                <span className="canTrade24">
                  <M
                    id="trade.havepass1"
                    values={{
                      goSetpass: (
                        <span>
                          <span
                            className="goLogin"
                            onClick={() => {
                              history.push(
                                [
                                  BASE_ROUTE,
                                  prefix,
                                  '/usercenter/setPass',
                                ].join('')
                              );
                            }}
                          >
                            <M id="trade.havepass2" />
                          </span>
                        </span>
                      ),
                    }}
                  />
                  {/* <M id="trade.havepass1" />
                  <span
                    className="goLogin"
                    onClick={() => {
                      history.push(
                        [BASE_ROUTE, prefix, '/usercenter/setPass'].join(
                          ''
                        )
                      );
                    }}>
                    <M id="trade.havepass2" />
                  </span>
                  <M id="trade.havepass3" /> */}
                </span>
              )) ||
              (!byPass && (
                <span className="canTrade24">
                  <M
                    id="trade.bypass1"
                    values={{
                      goVerifyPass: (
                        <span>
                          <span
                            className="goLogin"
                            onClick={() => {
                              preCondition(
                                'trade',
                                app,
                                history,
                                { superProps: this.props, actions },
                                () => {}
                              )();
                            }}
                          >
                            <M id="trade.bypass2" />
                          </span>
                          <M id="trade.bypass3" />
                        </span>
                      ),
                    }}
                  />
                </span>
              )) ||
              (tradeForbidden24h === true && (
                <span className="canTrade24">
                  <M id="trade.canTrade24" values={{ data: 24 }} />
                </span>
              )) ||
              ''
            }
          >
            {(!MINEING && (
              <TabPane tab={<M id="orderInput.limit" />} key="LIMIT" />
            )) ||
              null}
            {(!MINEING && (
              <TabPane tab={<M id="orderInput.market" />} key="MARKET" />
            )) ||
              null}
            {(((symbolCanMine && _config.showMineTool === 'true') ||
              Cookies.get('mineTool')) && (
              <TabPane tab={<M id="orderInput.mine" />} key="MINE" />
            )) ||
              null}
          </Tabs>
        </div>
        <div className="box">
          {(priceMode === 'MINE' && (
            <MineTool
              asset={{ quoteAsset, baseAsset }}
              {...mineProps}
              _setState={this._setState}
            />
          )) ||
            null}
          {show && priceMode !== 'MINE' && (
            <OrderComp
              type="buy"
              {...userInput['buy']}
              priceMode={priceMode}
              asset={{ quoteAsset, baseAsset }}
              legalTender={legalTender}
              symbol={symbol}
              convertMap={convertMap}
              convertMap_digital={convertMap_digital}
              submitDelegate={submitDelegate}
              clearOrderStateClickType={clearOrderStateClickType}
              initialValue={initialValue['sell']}
              app={app}
              history={history}
              forceUpdateTimer={forceUpdateTimerbuy}
              extendData={{ actions }}
              isCpuSymbol={isCpuSymbol}
              currentStakeFor={currentStakeFor}
            />
          )}
          {show && priceMode !== 'MINE' && (
            <OrderComp
              type="sell"
              {...userInput['sell']}
              priceMode={priceMode}
              asset={{ quoteAsset, baseAsset }}
              legalTender={legalTender}
              symbol={symbol}
              convertMap={convertMap}
              convertMap_digital={convertMap_digital}
              submitDelegate={submitDelegate}
              clearOrderStateClickType={clearOrderStateClickType}
              initialValue={initialValue['buy']}
              app={app}
              history={history}
              forceUpdateTimer={forceUpdateTimersell}
              extendData={{ actions }}
              isCpuSymbol={isCpuSymbol}
            />
          )}
        </div>
      </div>
    );
  }
}

OrderInput.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(OrderInput);
