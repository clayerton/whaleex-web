import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
  Checkbox,
  Radio,
  InputNumber,
  notification,
  Icon,
  Tooltip,
  Popover,
} from 'antd';
const MineGif = _config.cdn_url + '/web-static/imgs/web/minePage/mining.gif';
import { preCondition } from 'whaleex/components/preconditions';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import U from 'whaleex/utils/extends';
import styled from 'styled-components';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import M from 'whaleex/components/FormattedMessage';
import { Wrap, Header, Left, Right, MineButton } from './style.js';
import { getMineStatus } from 'whaleex/pages/Dashboard/containers/trade/actions.js';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
let mineTimer = undefined;
const StyledInputNumber = styled(InputNumber)`
  input {
    color: #2a4452;
  }
  &:after {
    content: ${props => "'" + `${props.unit}` + "'"};
    position: absolute;
    top: 0;
    right: 22px;
    line-height: 30px;
    height: 100%;
    color: #99acb6;
  }
`;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class MineTool extends React.Component {
  constructor(props) {
    super(props);
    const { mineSettingObj, symbol, convertMap_digital } = props;
    const { baseCurrency, quoteCurrency, lotSize, maxQty, lastPrice } = symbol;
    const { tolerantEOS, mineAssetRate, maxMineAsset } = mineSettingObj;
    this.state = {
      maxTimeDelay: 5, //最大行情时延
      priceRangeRate: 50, //下单价格波动 步长
      tolerantEOS: tolerantEOS === undefined ? Infinity : tolerantEOS, //单边容忍度   quoteCurrency  20 EOS --
      priceMode: 'LIMIT', //MARKET
      mineTimes: Infinity, //挖矿次数
      mineWAL: 0, //赚取的WAL
      mineInterval: 5000, //间隔
      mineQuantity: undefined,
      autoHand: 'auto',
      minMineAsset: 0, //quoteCurrency
      maxMineAsset: maxMineAsset === undefined ? Infinity : maxMineAsset, //quoteCurrency   --
      errorMsg: {},
      mineAssetRate: mineAssetRate === undefined ? 50 : mineAssetRate,
    };
  }
  componentDidMount() {
    window.mineTimer = 0;
    this.go(0);
  }
  componentWillReceiveProps(nextProps) {
    const { symbol: _symbol, mineSettingObj, convertMap_digital } = nextProps;
    const { symbol } = this.props;
    const { baseCurrency, quoteCurrency, lotSize, maxQty, lastPrice } = _symbol;
    if (symbol.name !== _symbol.name) {
      const { tolerantEOS, mineAssetRate, maxMineAsset } = mineSettingObj;
      this.setState({
        tolerantEOS: tolerantEOS === undefined ? Infinity : tolerantEOS,
        mineAssetRate: mineAssetRate === undefined ? 50 : mineAssetRate, //quoteCurrency
        maxMineAsset: maxMineAsset === undefined ? Infinity : maxMineAsset, //quoteCurrency   --
      });
      this.endMine();
    }
    const pk = _.get(this.props, 'pubKey');
    const _pk = _.get(nextProps, 'pubKey');
    if (!pk && _pk) {
      this.prepareIds();
    }
  }
  componentWillUnmount() {
    console.log('unmount MineTool');
    this.endMine();
  }
  prepareIds = async remark => {
    const data = await this.props.getNextIdList(remark); //100
    this.ids = data.list;
    this.remark = data.remark;
    return this.ids;
  };
  checkTopLimit = () => {
    let now = Date.now();
    const { symbol } = this.props;
    const { baseCurrency, quoteCurrency } = symbol;
    getMineStatus(`${baseCurrency}${quoteCurrency}`, mineLimit => {
      let { limited, errorMsg, startTime, endTime } = mineLimit;
      if (limited) {
        let popMsg = { errorCode: 'mineLimit', message: errorMsg };
        if (!!startTime && !!endTime) {
          if (now < startTime) {
            //未开始
            popMsg = { errorCode: 'mineNotStart', startTime, endTime };
          } else if (now > endTime) {
            //已结束
            popMsg = { errorCode: 'mineHaveEnd', startTime, endTime };
          }
        }
        this.popup(popMsg);
      } else if (limited === false) {
      }
      this.setState({ mineLimit });
    });
  };
  endMine = () => {
    console.log('endMine!');
    clearTimeout(window.mineTimer);
    window.mineTimer = 'End';
    const { symbol } = this.props;
    const { baseCurrency, quoteCurrency } = symbol;
    this.props.setMineEnd();
    this.setState({
      placePrice: undefined,
      quantity: undefined,
      MINEING: false,
    });
  };

  go = async (count = 0, firstStart) => {
    let { mineInterval, MINEING } = this.state;
    let intervalSec = mineInterval / 1000;
    try {
      // this.checkTopLimit();
      if ((count >= intervalSec && MINEING) || firstStart) {
        console.log('startMine', Date.now());
        await this.startMine2();
        return this.go(0);
      }
      this.countDown(parseInt(intervalSec - count));
    } catch (e) {
      console.log(e);
    }
    if (window.mineTimer === 'End') {
      return;
    }
    window.mineTimer = setTimeout(() => {
      this.go(++count % (intervalSec + 1));
    }, 1000);
  };
  countDown = count => {
    console.log('countDown', count);
    this.setState({ mineStep: 'minewait', mineWaitSec: count });
  };
  startMine2 = async () => {
    let { mineLimit = {} } = this.state;
    if (mineLimit.limited) {
      //不需要做任何事, 因为现在到硬顶
      //放开挖矿限制！！！！！！！
      // return;
    }
    const result = await this.canMine2();
    if (result.canMine) {
      console.time('---- mineTime');
      await this.mine2(result);
      console.timeEnd('---- mineTime');
    } else {
      this.popup(result);
    }
  };
  canMine2 = async () => {
    // return { canMine: true };
    //return {canMine,message}
    const {
      intl: { formatMessage },
    } = this.props;
    const { maxTimeDelay, tolerantEOS, mineLimit } = this.state;
    const { orderBook, symbol, convertMap_digital } = this.props;
    const { tickSize: minTicker, baseCurrency, quoteCurrency } = symbol;
    let bid1 = _.get(orderBook, 'bids[0].price', 0);
    let bid1Amount = _.get(orderBook, 'bids[0].quantity', 0);
    let ask1 = _.get(orderBook, 'asks[0].price', 0);
    let ask1Amount = _.get(orderBook, 'asks[0].quantity', 0);
    let klineLastData = window.klineLastData || {};
    let avePrice = klineLastData.avgPrice;
    avePrice =
      (Math.min(ask1, avePrice * (1 + 2.5 / 100)) +
        Math.max(bid1, avePrice * (1 - 2.5 / 100))) /
      2;
    console.log(
      '!!!!',
      { ask1, bid1, kline: klineLastData.avgPrice },
      avePrice
    );

    let result = { canMine: false };
    if (bid1 == 0 || ask1 == 0) {
      result.errorCode = 'tradeEmpty';
      //单边行情是空
    } else if (
      !_.isEmpty(klineLastData) &&
      (klineLastData.avgPrice >= avePrice * (1 + 2.5 / 100) ||
        klineLastData.avgPrice <= avePrice * (1 - 2.5 / 100))
    ) {
      console.log('行情波动过大');
      result.errorCode = 'klineCrash';
    } else if (
      Date.now() - sessionStorage.getItem('lastOrderBookUpdate') <
        maxTimeDelay ||
      _.isEmpty(klineLastData)
    ) {
      result.errorCode = 'overDelay';
    } else {
      result = { canMine: true };
    }
    return result;
  };

  mine2 = async canMineResult => {
    const { minMineAsset } = this.state;
    this.setState({ mineStep: 'getOrderId' });
    if (_.isEmpty(this.ids)) {
      await this.prepareIds(this.remark);
    }
    const [buyOrderId, sellOrderId] = this.ids.splice(0, 2);
    let placePrice = this.getPrice();
    let quantity = this.getQuantity(placePrice, canMineResult); //初始对敲资金
    if (quantity < minMineAsset / placePrice) {
      //minMineAsset 现在为0  永远都不会进到这里
      this.popup({ errorCode: 'tooSmall' });
    } else {
      this.setState({ mineStep: 'stepSign' });
      let confirmSendOrder = await Promise.all([
        this.buy(placePrice, quantity, buyOrderId),
        this.sell(placePrice, quantity, sellOrderId),
      ]);
      console.log('delegate Sign done!', Date.now());
      this.setState({
        mineStep: 'stepGo',
        placePrice,
        quantity,
      });
      confirmSendOrder[0]();
      confirmSendOrder[1]();
      console.log('delegate Send!', Date.now());
    }
    await new Promise(reslove => {
      setTimeout(() => {
        reslove();
      }, 100);
    });
  };
  buy = async (placePrice, quantity, buyOrderId) => {
    return new Promise((resolve, reject) => {
      this.submitOrder(
        { expressId: buyOrderId, type: 'buy', price: placePrice, quantity },
        resolve
      );
    });
  };
  sell = async (placePrice, quantity, sellOrderId) => {
    return new Promise((resolve, reject) => {
      this.submitOrder(
        { expressId: sellOrderId, type: 'sell', price: placePrice, quantity },
        resolve
      );
    });
  };
  cancel = expressId => {
    this.props.cancelDelegate({ orderId: expressId }, 'noMsg');
  };
  submitOrder = ({ expressId, type, price, quantity }, resolve) => {
    try {
      const { priceMode = 'LIMIT' } = this.state;
      let sendWaitReslove;
      let sendWait = new Promise(reslove => {
        sendWaitReslove = reslove;
      });
      console.log('delegate', type, price, quantity, Date.now());
      this.props.submitDelegateNeedId({
        expressId,
        order: {
          sideMode: type.toUpperCase(),
          priceMode,
          quantity: U.calc(`${quantity}`),
          price: priceMode === 'LIMIT' ? U.calc(`${price}`) : '0',
        },
        callBack: async (latestDelegate, expressId) => {
          // setTimeout(() => {
          //   this.cancel(expressId);
          // }, 15000);
          const { returnCode, message, errorCode } = latestDelegate;
          if (errorCode === 'L002') {
            this.popup({ errorCode: 'orderError', message });
            console.log('L002');
          } else if (errorCode === 'E015') {
            await this.prepareIds(this.remark);
          } else if (returnCode !== '0') {
            this.popup({ errorCode: 'orderError', message });
          } else {
            this.popup();
          }
          //下单完成
        },
        waitBack: () => {
          //等待同步下单
          resolve(sendWaitReslove);
        },
        sendWait: sendWait, //阻塞函数
      });
    } catch (e) {
      console.log(e);
    }
  };
  getQuantity = (placePrice, canMineResult) => {
    //
    const { asset, symbol } = this.props;
    const {
      mineQuantity,
      maxMineAsset,
      mineAssetRate,
      tolerantEOS,
    } = this.state;
    const { baseCurrency, quoteCurrency, lotSize } = symbol;
    const { baseAsset: B, quoteAsset: Q } = asset;
    let minAsset = Math.min(+B.availableTotal, +Q.availableTotal / placePrice);
    let _minAsset = 0;
    //取资产小的一方
    _minAsset = Math.min(minAsset, maxMineAsset / placePrice);
    if (mineQuantity > 0) {
      _minAsset = Math.min(mineQuantity, minAsset);
      return U.cutNumber(_minAsset, lotSize.length - 2);
    }
    let r = (_minAsset * mineAssetRate) / 100;
    if (canMineResult.errorCode === 'mineTolerant') {
      r = Math.min(r, tolerantEOS / placePrice);
    }
    r = this.getRangePrice(0.7 * r, r);
    //加入0.7-1的随机波动
    return U.cutNumber(r, lotSize.length - 2);
  };
  getPrice = () => {
    // TODO chekc
    const { orderBook, symbol } = this.props;
    const { priceRangeRate, tolerantEOS } = this.state;
    let bid1 = _.get(orderBook, 'bids[0].price', 0);
    let bid1Amount = _.get(orderBook, 'bids[0].quantity', 0);
    let ask1 = _.get(orderBook, 'asks[0].price', 0);
    let ask1Amount = _.get(orderBook, 'asks[0].quantity', 0);
    const { tickSize, tickSize: minTicker } = symbol;
    let klineLastData = window.klineLastData || {};
    let avePrice = klineLastData.avgPrice;
    avePrice =
      (Math.min(ask1, avePrice * (1 + 2.5 / 100)) +
        Math.max(bid1, avePrice * (1 - 2.5 / 100))) /
      2;
    // avePrice - bid1 <= minTicker &&
    // bid1Amount * bid1 > tolerantEOS &&
    // (ask1 - avePrice <= minTicker && ask1Amount * ask1 > tolerantEOS)
    // 加入波动范围
    avePrice = this.getRangePrice(
      avePrice - ((avePrice - bid1) * priceRangeRate) / 100,
      avePrice + ((ask1 - avePrice) * priceRangeRate) / 100
    );
    if (avePrice - bid1 <= minTicker && bid1Amount * bid1 > tolerantEOS) {
      avePrice = this.getRangePrice(
        avePrice,
        avePrice + ((ask1 - avePrice) * priceRangeRate) / 100
      );
      this.popup({ errorCode: 'mineTolerant' });
    } else if (
      ask1 - avePrice <= minTicker &&
      ask1Amount * ask1 > tolerantEOS
    ) {
      avePrice = this.getRangePrice(
        avePrice - ((avePrice - bid1) * priceRangeRate) / 100,
        avePrice
      );
      this.popup({ errorCode: 'mineTolerant' });
    }
    //规整精度
    return U.cutNumber(avePrice, tickSize.length - 2);
  };
  getRangePrice = (Min, Max) => {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Rand * Range;
    return num;
  };
  popup = (result = {}) => {
    const {
      intl: { formatMessage },
    } = this.props;
    let now = Date.now();
    const { minMineAsset } = this.state;
    const { startTime = 0, endTime = 0 } = result;
    // 距离下次挖矿: {timeToStart}
    const errorMsgMap = {
      // mineLimit: formatMessage({ id: 'mine.personLimit' }),
      mineNotStart: formatMessage(
        { id: 'mine.mineNotStart' },
        {
          timeToStart: U.formatTimeDuration(startTime - now, undefined),
        }
      ),
      mineHaveEnd: formatMessage({ id: 'mine.mineHaveEnd' }),
      klineCrash: formatMessage({ id: 'mine.klineCrash' }),
      tooSmall: formatMessage({ id: 'mine.tooSmall' }, { num: minMineAsset }),
      tradeEmpty: formatMessage({ id: 'mine.tradeEmpty' }),
      overDelay: formatMessage({ id: 'mine.overDelay' }),
      mineTolerant: formatMessage({ id: 'mine.tolerant' }),
    };
    const { errorCode, message } = result;
    if (errorMsgMap[errorCode]) {
      console.log('popMsg', errorMsgMap[errorCode]);
      this.setState({
        errorMsg: {
          errorCode,
          msg: errorMsgMap[errorCode] || '',
        },
      });
    } else {
      console.log('popMsg', message);
      this.setState({
        errorMsg: {
          errorCode,
          msg: message || errorMsgMap[errorCode] || '',
        },
      });
    }
  };
  messageAlert = (msg, type = 'success') => {
    const {
      intl: { formatMessage },
    } = this.props;
    notification.open({
      message: <span>{formatMessage({ id: 'mine.mineStart' })}</span>,
      description: msg,
      icon: (type === 'success' && (
        <Icon type="check-circle" style={{ color: 'rgb(87, 212, 170)' }} />
      )) || (
        <Icon
          type="exclamation-circle"
          style={{ color: 'rgb(217, 242, 94)' }}
        />
      ),
    });
  };
  getMineingText = () => {
    // "stepSign": "签名",
    // "stepGo": "下单",
    // "stepCancel": "撤单",
    // "mineing": "挖矿中({step})...",
    // "minewait": "等待挖矿({second}s)",
    const {
      intl: { formatMessage },
    } = this.props;
    const { mineStep, mineWaitSec } = this.state;
    if (['stepSign'].includes(mineStep)) {
      return (
        <MineButton>
          <img src={MineGif} />
          <M id="mine.mineing1" />
        </MineButton>
      );
    } else if (['stepGo', 'stepCancel'].includes(mineStep)) {
      return (
        <MineButton>
          <img src={MineGif} />
          <M
            id="mine.mineing"
            values={{ step: formatMessage({ id: `mine.${mineStep}` }) }}
          />
        </MineButton>
      );
    }
    if (['minewait'].includes(mineStep)) {
      return <M id={`mine.${mineStep}`} values={{ second: mineWaitSec }} />;
    }
  };
  handleVisibleChange = e => {
    this.setState({
      tmpConfig: {},
    });
    if (e) {
      this.props.showMineSettingDetail();
    } else {
      this.props.hideMineSettingDetail();
    }
  };
  saveSet = () => {
    const {
      tolerantEOS: _tolerantEOS,
      mineAssetRate: _mineAssetRate,
      maxMineAsset: _maxMineAsset,
    } = this.state;
    const {
      tolerantEOS = _tolerantEOS,
      mineAssetRate = _mineAssetRate,
      maxMineAsset = _maxMineAsset,
    } = this.state.tmpConfig || {};
    this.props._setState('mineSettingObj.tolerantEOS', tolerantEOS);
    this.props._setState('mineSettingObj.mineAssetRate', mineAssetRate);
    this.props._setState('mineSettingObj.maxMineAsset', maxMineAsset);
    this.setState({
      tolerantEOS,
      mineAssetRate,
      maxMineAsset,
    });
    this.props.hideMineSettingDetail();
  };
  setCurState = (key, value) => {
    this.setState(preState => {
      let _preState = _.cloneDeep(preState);
      _.set(_preState, key, value);
      return _preState;
    });
  };
  reSet = () => {
    this.props._setState('mineSettingObj.tolerantEOS', undefined);
    this.props._setState('mineSettingObj.mineAssetRate', undefined);
    this.props._setState('mineSettingObj.maxMineAsset', undefined);
    this.setState({
      tolerantEOS: Infinity,
      mineAssetRate: 50,
      maxMineAsset: Infinity,
      tmpConfig: {},
    });
  };
  startMineClick = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    clearTimeout(window.mineTimer);
    window.mineTimer = 0;
    this.go(0, 'start');
    this.setState({ MINEING: true });
    this.props.setMineStart();
    this.messageAlert(formatMessage({ id: 'mine.mineStartALert' }));
  };
  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const {
      asset,
      symbol,
      app,
      history,
      extendData: { actions },
      _setState,
      MINEING_SETTING,
    } = this.props;
    const {
      tickSize: minTicker,
      baseCurrency,
      quoteCurrency,
      maxQty,
      lotSize,
    } = symbol;
    const { baseAsset: B, quoteAsset: Q } = asset;
    let {
      placePrice,
      quantity,
      mineQuantity,
      mineLimit = {},
      errorMsg,
      MINEING,
      mineStep,
      mineWaitSec,
    } = this.state;
    mineLimit = mineLimit || {};
    let label4 = <M id="orderInput.needAuth" />;
    let label5 = <M id="orderInput.login" />;
    let label6 = <M id="orderInput.activeDevice" />;
    let label7 = <M id="orderInput.bindDevice" />;
    const needAuth = _.get(app, 'userConfig.tradeNeedVerify');
    const needBindDevice = !_.get(app, 'userConfig.userEosAccount');
    const needActiveDevice = _.get(app, 'userPkStatus.status') !== 'ACTIVED';
    const isCustomer = !sessionStorage.getItem('userId');
    //     等待
    // 挖矿中（签名/下单/撤单）
    // 异常
    // 	行情延迟超限/可用资金不足/达到硬顶/
    // {' '}
    // ≈{' '}
    // {(
    //   this.state.tolerantEOS * convertMap_digital[baseCurrency]
    // ).toFixed(4)}{' '}
    // EOS
    return (
      <Wrap key={'mineTool-' + symbol.name} id={'mineTool-' + symbol.name}>
        <Popover
          placement="bottomRight"
          overlayClassName="minesetting-pop"
          content={
            <div className="setting-wrap">
              <div className="key">
                <M id="mine.everyTimePay" />{' '}
                <Tooltip
                  placement="top"
                  className="title_tip"
                  title={formatMessage({ id: 'mine.everyTimePayInfo' })}
                >
                  <i className="iconfont icon-ArtboardCopy7" />
                </Tooltip>
              </div>
              <div className="input-wrap">
                <StyledInputNumber
                  min={1}
                  max={100}
                  style={{ fontSize: '12px' }}
                  value={_.get(
                    this.state,
                    'tmpConfig.mineAssetRate',
                    this.state.mineAssetRate
                  )}
                  onChange={value => {
                    const _value = Number(value) || 0;
                    this.setCurState('tmpConfig.mineAssetRate', _value);
                    // _setState('mineSettingObj.mineAssetRate', _value);
                  }}
                  unit={'%'}
                />
              </div>
              <div className="key">
                <M id="mine.maxBuySell" />{' '}
              </div>
              <div className="input-wrap">
                <StyledInputNumber
                  style={{ fontSize: '12px' }}
                  value={_.get(
                    this.state,
                    'tmpConfig.maxMineAsset',
                    this.state.maxMineAsset === Infinity
                      ? ''
                      : this.state.maxMineAsset
                  )}
                  onChange={value => {
                    this.setCurState('tmpConfig.maxMineAsset', value);
                    // _setState('mineSettingObj.maxMineAsset', _value);
                  }}
                  placeholder={formatMessage({ id: 'mine.quantityInput' })}
                  unit={quoteCurrency}
                />
              </div>
              <div className="button-wrap">
                <StyledButton onClick={this.reSet}>
                  <M id="mine.reset" />
                </StyledButton>
                <StyledButton type="primary" onClick={this.saveSet}>
                  <M id="mine.saveSet" />
                </StyledButton>
              </div>
            </div>
          }
          trigger={'click'}
          visible={MINEING_SETTING}
          onVisibleChange={this.handleVisibleChange}
        >
          <span className="mine-setting">
            <i className="iconfont icon-trade_mining-setting" />
          </span>
        </Popover>
        <Header>
          <div className="left">
            <div>
              <M id="mine.available" />
            </div>
            <div className="text-right">
              <div>
                {+B.availableTotal || 0} {B.currency}
              </div>
              <div>
                {+Q.availableTotal || 0} {Q.currency}
              </div>
            </div>
          </div>
          <div className="right">
            <div>
              <div className="large">
                <M id="mine.already" />
              </div>
              <div>
                <M id="mine.cost" />
              </div>
            </div>
            <div className="text-right">
              <div className="large">
                {mineLimit.personTotalMineAmount || '0.00'} WAL
              </div>
              <div>{mineLimit.totalFee2EOS || '0.00'} EOS</div>
            </div>
          </div>
        </Header>
        <div
          style={{
            display: 'flex',
            marginTop: '10px',
            height: 'calc(100% - 55px)',
          }}
        >
          <Left>
            <div>
              <div className="key">
                <M id="mine.price" />{' '}
                <Tooltip
                  placement="top"
                  className="title_tip"
                  title={formatMessage({ id: 'mine.tooltipPrice' })}
                >
                  <i className="iconfont icon-ArtboardCopy7" />
                </Tooltip>
              </div>
              <div className="input-wrap">
                <StyledInputNumber
                  style={{ fontSize: '12px' }}
                  value={this.state.placePrice}
                  disabled
                  unit={quoteCurrency}
                  placeholder={formatMessage({ id: 'mine.avePrice' })}
                />
              </div>
              <div className="key">
                <M id="mine.quantity" />{' '}
              </div>
              <div className="input-wrap">
                <StyledInputNumber
                  style={{ fontSize: '12px' }}
                  min={0}
                  max={+maxQty}
                  step={lotSize}
                  value={
                    this.state.autoHand === 'auto'
                      ? this.state.quantity
                      : this.state.mineQuantity
                  }
                  onChange={value => {
                    value = U.formatInsertData(
                      `${(value > maxQty && maxQty) || value}`,
                      lotSize.length - 2
                    );
                    this.setState({ mineQuantity: value });
                  }}
                  unit={baseCurrency}
                  disabled={this.state.autoHand === 'auto'}
                  placeholder={formatMessage({ id: 'mine.quantityInput' })}
                />
              </div>
            </div>
            <div>
              <div className="button">
                <StyledButton
                  type="primary"
                  disabled={
                    this.state.autoHand === 'hand' &&
                    (Number(mineQuantity) || 0) <= 0
                  }
                  onClick={() => {
                    preCondition(
                      'trade',
                      app,
                      history,
                      { superProps: this.props, actions },
                      () => {
                        if (MINEING) {
                          return;
                        }
                        if (isCustomer) {
                          const path = [BASE_ROUTE, prefix, '/login'].join('');
                          history.push(path);
                        } else {
                          this.startMineClick();
                        }
                      }
                    )();
                  }}
                >
                  {(MINEING && this.getMineingText()) ||
                    (isCustomer && label5) ||
                    (needBindDevice && label7) ||
                    (needActiveDevice && label6) ||
                    (needAuth && label4) || <M id="mine.startmine" />}
                </StyledButton>
              </div>
              <div className="text-line">
                <span className="error" />
                {(MINEING && (
                  <span
                    className="stop-mine"
                    onClick={() => {
                      this.endMine();
                    }}
                  >
                    <M id="mine.alert" />
                  </span>
                )) || <span />}
              </div>
            </div>
          </Left>
          <Right>
            <div className="key">
              <M id="mine.interval" />{' '}
              <Tooltip
                placement="top"
                className="title_tip"
                title={formatMessage({ id: 'mine.tooltipInterval' })}
              >
                <i className="iconfont icon-ArtboardCopy7" />
              </Tooltip>
            </div>
            <div className="input-wrap">
              <RadioGroup
                onChange={e => {
                  this.setState({ mineInterval: e.target.value });
                }}
                value={this.state.mineInterval}
                disabled={MINEING}
              >
                <RadioButton value={3000}>3 s</RadioButton>
                <RadioButton value={60000}>60 s</RadioButton>
                <RadioButton value={500}>0.5 s</RadioButton>
              </RadioGroup>
            </div>
            <div className="key">
              <M id="mine.mode" />{' '}
              <Tooltip
                placement="top"
                className="title_tip"
                title={formatMessage({ id: 'mine.tooltipMode' })}
              >
                <i className="iconfont icon-ArtboardCopy7" />
              </Tooltip>
            </div>
            <div className="input-wrap-radio">
              <RadioGroup
                disabled={MINEING}
                onChange={e => {
                  const checkValue = e.target.value;
                  this.setState({
                    autoHand: checkValue,
                    quantity: undefined,
                    mineQuantity:
                      checkValue === 'auto'
                        ? undefined
                        : this.state.mineQuantity,
                  });
                }}
                value={this.state.autoHand}
              >
                <Radio value={'auto'}>
                  <M id="mine.auto" />
                </Radio>
                <Radio value={'hand'}>
                  <M id="mine.hand" />
                </Radio>
              </RadioGroup>
            </div>
            <span className="error">
              {_.get(this.state, 'errorMsg.msg') || ''}
            </span>
            <a
              className="url-style no-line tutorial-link"
              target="_blank"
              href="https://support.whaleex.com/hc/zh-cn/articles/360018979712-%E5%88%9B%E4%B8%96%E6%8C%96%E7%9F%BF%E5%8D%B3%E5%B0%86%E5%BC%80%E5%90%AF-%E6%8C%96%E7%9F%BF%E6%94%BB%E7%95%A5%E6%8A%A2%E5%85%88%E7%9C%8B"
            >
              <M id="mine.tutorial" />
              <Icon type="right" />
            </a>
          </Right>
        </div>
      </Wrap>
    );
    // <p>
    //   资产
    //   <span>
    //     {B.total} {B.currency} ({B.total * convertMap_digital[baseCurrency]}{' '}
    //     {Q.currency})/ {Q.total} {Q.currency}
    //   </span>
    // </p>
    // <p>
    //   可用
    //   <span>
    //     {+B.availableTotal} {B.currency} ({B.availableTotal *
    //       convertMap_digital[baseCurrency]}{' '}
    //     {Q.currency})/ {+Q.availableTotal} {Q.currency}
    //   </span>
    // </p>
    // <p>
    //   <span>
    //     最大行情时延:
    //     <Input
    //       style={{ width: 50 }}
    //       value={this.state.maxTimeDelay}
    //       onChange={e => {
    //         this.setState({ maxTimeDelay: e.target.value });
    //       }}
    //     />
    //   </span>
    //   <span>
    //     下单价格波动:
    //     <Input
    //       style={{ width: 50 }}
    //       value={this.state.priceRangeRate}
    //       onChange={e => {
    //         this.setState({ priceRangeRate: e.target.value });
    //       }}
    //     />
    //   </span>
    //   <span>
    //     单边容忍度:
    //     <Input
    //       style={{ width: 50 }}
    //       value={this.state.tolerantEOS}
    //       onChange={e => {
    //         this.setState({ tolerantEOS: e.target.value });
    //       }}
    //     />
    //   </span>
    //   <span>
    //     挖矿次数:
    //     <Input
    //       style={{ width: 50 }}
    //       value={this.state.mineTimes}
    //       onChange={e => {
    //         this.setState({ mineTimes: e.target.value });
    //       }}
    //     />
    //   </span>
    //   <span>
    //     挖矿间隔(s):
    //     <Input
    //       style={{ width: 50 }}
    //       value={this.state.mineInterval}
    //       onChange={e => {
    //         this.setState({ mineInterval: e.target.value });
    //       }}
    //     />
    //   </span>
    //   <span>
    //     对撞资产:
    //     <Input
    //       style={{ width: 50 }}
    //       value={this.state.mineQuantity}
    //       onChange={e => {
    //         this.setState({ mineQuantity: e.target.value });
    //       }}
    //     />
    //   </span>
    //   <span>
    //     <Checkbox
    //       checked={this.state.priceMode === 'MARKET'}
    //       onChange={e => {
    //         console.log(e.target.checked);
    //         this.setState({
    //           priceMode: (e.target.checked && 'MARKET') || 'LIMIT',
    //         });
    //       }}
    //     >
    //       市价单成交
    //     </Checkbox>
    //   </span>
    // </p>
    // <p>
    //   <span>
    //     挖矿状态：{(sessionStorage.getItem(
    //       `mine_${baseCurrency}_${quoteCurrency}`
    //     ) &&
    //       '挖矿中') ||
    //       '未挖矿'}
    //   </span>
    // </p>
    // <Button
    //   onClick={() => {
    //     if (
    //       sessionStorage.getItem(`mine_${baseCurrency}_${quoteCurrency}`)
    //     ) {
    //       this.endMine();
    //     }
    //     sessionStorage.setItem(
    //       `mine_${baseCurrency}_${quoteCurrency}`,
    //       'mineing'
    //     );
    //     this.forceUpdate();
    //     this.startMine();
    //   }}
    // >
    //   {(sessionStorage.getItem(`mine_${baseCurrency}_${quoteCurrency}`) &&
    //     '停止挖矿') ||
    //     '开始挖矿'}
    // </Button>
  }
}

MineTool.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(MineTool);
