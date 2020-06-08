import React from 'react';

import { Slider, InputNumber, Button, Icon, message } from 'antd';
import U from 'whaleex/utils/extends';
import M from 'whaleex/components/FormattedMessage';
import Loading from '../Loading';
//TODO whay from 'whaleex/components'; will be type undefined but M have no error
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

import { unitMap } from 'whaleex/utils/dollarMap.js';
import { preCondition } from 'whaleex/components/preconditions';
math.config({
  number: 'BigNumber',
  precision: 20,
});
import './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let timerT = { T: 0 };
const StyledInputNumber = styled(InputNumber)`
  input {
    color: #2a4452;
    width: calc(100% - 70px);
  }
  &:after {
    content: ${props => "'" + `${props.unit}` + "'"};
    position: absolute;
    top: 0;
    right: 22px;
    line-height: 35px;
    height: 100%;
    color: #99acb6;
  }
`;
class OrderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.calcNextState(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'asset',
        // 'symbol',
        'legalTender',
        'convertMap',
        'convertMap_digital',
        'priceMode',
        'price',
        'quantity',
        'initialValue',
        'forceUpdateTimer',
        'app.userPkStatus',
        'app.userConfig',
        'app.permissions',
        'isCpuSymbol',
      ]
    );
    const isSymbolChange = U.isObjDiff(
      [nextProps.symbol, this.props.symbol],
      ['baseCurrencyId', 'quoteCurrencyId']
    );
    const isStateChange = U.isObjDiff(
      [nextState, this.state],
      [
        'marks',
        'inputValue',
        'sliderValue',
        'priceValue',
        'maxTargetAsset',
        'step',
        'step1',
        'loading',
        'stateForceTimer',
      ]
    );
    if (isChanged || isSymbolChange || isStateChange) {
      const isTimeChanged = U.isObjDiff(
        [nextProps, this.props],
        ['forceUpdateTimer']
      );
      let clickEventObj = {};
      if (isTimeChanged) {
        clickEventObj = {
          changeKey:
            (nextProps.keytype === 'click' && 'priceValue') || 'inputValue',
        };
      }
      this.checkOverLimit(Object.assign({}, nextState, clickEventObj));
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'asset',
        'legalTender',
        'convertMap',
        'convertMap_digital',
        'priceMode',
        'price',
        'quantity',
        'initialValue',
        'forceUpdateTimer',
      ]
    );
    const isSymbolChange = U.isObjDiff(
      [nextProps.symbol, this.props.symbol],
      ['baseCurrencyId', 'quoteCurrencyId']
    );
    //价格模式或交易对更改，则将用户数量输入框清空
    const priceModeChanged = U.isObjDiff(
      [nextProps, this.props],
      ['priceMode', 'symbol']
    );
    if (isChanged || isSymbolChange || priceModeChanged) {
      const {
        asset,
        symbol,
        quantity,
        type,
        keytype,
        priceMode,
        initialValue = {},
      } = nextProps;
      const {
        lastPrice,
        lotSize,
        tickSize,
        baseCurrency,
        quoteCurrency,
        quotePrecision,
      } = symbol;
      const { price = '' } = nextProps;
      let _priceValue = this.state.priceValue || price;
      const LIMIT = priceMode === 'LIMIT';
      const BUY = type === 'buy';
      let maxTargetAsset = this.getMaxTargetAsset(nextProps, _priceValue);
      const { max, baseUnit, maxRaw } = this.getMaxSlide(
        nextProps,
        maxTargetAsset
      );
      const step =
        (!LIMIT && BUY && `${U.formatMathPow(0.1, quotePrecision)}`) || lotSize;
      let newObject = {
        step: step,
        step1: tickSize,
        maxTargetAsset,
        // priceValue: price,
        marks: {
          0: '0' + baseUnit,
          25: '',
          50: '',
          75: '',
          100: max,
        },
        maxRaw,
      };
      if (keytype === 'click' && LIMIT) {
        newObject = Object.assign({}, newObject, {
          priceValue: price,
        });
      } else if (keytype === 'dblclick' && LIMIT && quantity !== undefined) {
        newObject = Object.assign({}, newObject, {
          priceValue: price,
          sliderValue:
            (+maxTargetAsset === 0 && '0') || (quantity / maxTargetAsset) * 100,
          inputValue: U.formatInsertData(`${quantity}`, step.length - 2),
        });
      } else if (priceModeChanged) {
        newObject = Object.assign({}, newObject, {
          priceValue: price,
          sliderValue: 0,
          inputValue: 0,
        });
      }
      this.setState(newObject);
    }
  }
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  checkOverLimit = ({ inputValue, maxRaw, changeKey }) => {
    const { type } = this.props;
    const BUY = type === 'buy';
    let _maxRaw = maxRaw || '0';
    if (inputValue > 0 && +inputValue > +_maxRaw) {
      const {
        intl: { formatMessage },
      } = this.props;
      // if (changeKey === 'priceValue') {
      //   message.destroy();
      //   message.error(
      //     formatMessage({ id: (BUY && 'trade.overPrice') || 'trade.overPrice' })
      //   );
      // } else if (changeKey === 'inputValue') {
      //   message.destroy();
      //   message.error(
      //     formatMessage({
      //       id: (BUY && 'trade.overAmount') || 'trade.overAmountSell',
      //     })
      //   );
      // }
    }
  };
  getLabelMap = baseCurrency => {
    return {
      buy: {
        label1: <M id="orderInput.buyPrice" />,
        label2: <M id="orderInput.buyQty" />,
        label3: <M id="orderInput.buy" values={{ sth: baseCurrency }} />,
        label4: <M id="orderInput.needAuth" />,
        label5: <M id="orderInput.login" />,
        label6: <M id="orderInput.activeDevice" />,
        label7: <M id="orderInput.bindDevice" />,
        color: '#44cb9c',
      },
      sell: {
        label1: <M id="orderInput.sellPrice" />,
        label2: <M id="orderInput.sellQty" />,
        label3: <M id="orderInput.sell" values={{ sth: baseCurrency }} />,
        label4: <M id="orderInput.needAuth" />,
        label5: <M id="orderInput.login" />,
        label6: <M id="orderInput.activeDevice" />,
        label7: <M id="orderInput.bindDevice" />,
        color: '#f27762',
      },
    };
  };
  /*
  获得滑动条的最大值和单位
   */
  getMaxSlide = (props, maxTargetAsset) => {
    const { asset, symbol, quantity = 0, type, priceMode } = props;
    const {
      lotSize,
      tickSize,
      baseCurrency,
      quoteCurrency,
      quotePrecision,
    } = symbol;
    const LIMIT = priceMode === 'LIMIT';
    const BUY = type === 'buy';
    const baseUnit = ` ${(!LIMIT && BUY && quoteCurrency) || baseCurrency}`;
    const step =
      (!LIMIT && BUY && `${U.formatMathPow(0.1, quotePrecision)}`) || lotSize;
    let max =
      (!LIMIT &&
        BUY &&
        U.cutNumber(asset.quoteAsset.availableTotal || 0, step.length - 2)) ||
      U.cutNumber(maxTargetAsset, step.length - 2);
    return { baseUnit, max: `${max}${baseUnit}`, maxRaw: max };
  };
  calcNextState = (props, priceValue) => {
    const {
      asset,
      symbol,
      quantity = 0,
      type,
      priceMode,
      initialValue = {},
    } = props;
    const {
      lastPrice,
      lotSize,
      tickSize,
      baseCurrency,
      quoteCurrency,
      quotePrecision,
    } = symbol;
    const LIMIT = priceMode === 'LIMIT';
    const BUY = type === 'buy';
    const step =
      (!LIMIT && BUY && `${U.formatMathPow(0.1, quotePrecision)}`) || lotSize;
    let { price = '' } = props;
    let _priceValue = priceValue || price;
    let maxTargetAsset = this.getMaxTargetAsset(props, _priceValue);
    const { baseUnit, max, maxRaw } = this.getMaxSlide(props, maxTargetAsset);
    const _state = {
      maxTargetAsset,
      inputValue: quantity,
      sliderValue:
        (+maxTargetAsset === 0 && '0') || (quantity / maxTargetAsset) * 100,
      step: step,
      step1: tickSize,
      marks: {
        0: '0' + baseUnit,
        25: '',
        50: '',
        75: '',
        100: max,
      },
      maxRaw,
    };
    return _state;
  };
  getMaxTargetAsset = (props, price) => {
    const { asset, symbol, quantity = 0, type, keytype } = props;
    const BUY = type === 'buy';

    const myAsset = asset[(BUY && 'quoteAsset') || 'baseAsset'];
    if (_.isEmpty(asset) || !myAsset) {
      return 0;
    }
    const { lastPrice } = symbol;
    let maxTargetAsset = myAsset.availableTotal;
    if (BUY) {
      maxTargetAsset = maxTargetAsset / price;
    }
    return maxTargetAsset === Infinity || !maxTargetAsset ? 0 : maxTargetAsset;
  };
  setSuperState = (key, value) => {
    this.props.setSuperState(key, value);
  };
  submitOrder = () => {
    try {
      this.setState({ loading: true });
      setTimeout(() => {
        const { loading } = this.state;
        if (loading) {
          this.setState({ loading: false });
        }
      }, 10000);
      const { type, priceMode = 'LIMIT' } = this.props;
      const { inputValue, priceValue } = this.state;
      const that = this;
      this.props.clearOrderStateClickType();
      this.props.submitDelegate(
        {
          sideMode: type.toUpperCase(),
          priceMode,
          quantity: U.calc(`${inputValue}`),
          price: priceMode === 'LIMIT' ? U.calc(`${priceValue}`) : '0',
        },
        () => {
          //inputValue: 0, sliderValue: 0,清除用户输入
          that.setState({ loading: false });
        }
      );
    } catch (e) {
      this.setState({ loading: false });
    }
  };
  onSliderChange = ratio => {
    const {
      symbol: { lotSize, quotePrecision },
      setSuperState,
      priceMode,
      type,
      asset,
    } = this.props;
    this.props.clearOrderStateClickType();
    const { maxTargetAsset } = this.state;
    const LIMIT = priceMode === 'LIMIT';
    const BUY = type === 'buy';
    const maxAsset =
      (!LIMIT && BUY && +asset.quoteAsset.availableTotal) || maxTargetAsset;
    const inputValue = (maxAsset * ratio) / 100;
    // if (setSuperState) {
    //   setSuperState('quantity', inputValue);
    // } else {
    const step =
      (!LIMIT && BUY && `${U.formatMathPow(0.1, quotePrecision)}`) || lotSize;
    this.setState({
      changeKey: 'sliderValue',
      inputValue: U.formatInsertData(inputValue, step.length - 2),
      sliderValue: ratio,
      stateForceTimer: +new Date(),
    });
  };
  onpriceValueChange = _priceValue => {
    const {
      setSuperState,
      symbol: { tickSize },
    } = this.props;
    this.props.clearOrderStateClickType();
    const { inputValue } = this.state;
    _priceValue = U.formatInsertData(_priceValue, tickSize.length - 2);
    let maxTargetAsset = this.getMaxTargetAsset(this.props, _priceValue);
    const { max, baseUnit, maxRaw } = this.getMaxSlide(
      this.props,
      maxTargetAsset
    );
    this.setState({
      changeKey: 'priceValue',
      maxTargetAsset,
      priceValue: _priceValue,
      sliderValue:
        (+maxTargetAsset === 0 && '0') || (inputValue / maxRaw) * 100 || '0',
      marks: {
        0: '0' + baseUnit,
        25: '',
        50: '',
        75: '',
        100: max,
      },
      maxRaw,
      stateForceTimer: +new Date(),
    });
  };
  onInputChange = (value = 0) => {
    const {
      symbol: { lotSize, tickSize, maxQty, minQty, quotePrecision },
      priceMode,
      type,
    } = this.props;
    this.props.clearOrderStateClickType();
    const LIMIT = priceMode === 'LIMIT';
    const BUY = type === 'buy';
    const step =
      (!LIMIT && BUY && `${U.formatMathPow(0.1, quotePrecision)}`) || lotSize;
    const { setSuperState } = this.props;
    const { maxTargetAsset, maxRaw } = this.state;
    value = U.formatInsertData(
      `${(value > maxQty && maxQty) || value}`,
      step.length - 2
    );
    // if (setSuperState) {
    //   setSuperState('quantity', value);
    // } else {
    this.setState({
      changeKey: 'inputValue',
      inputValue: value,
      sliderValue:
        (+maxTargetAsset === 0 && '0') ||
        (+maxRaw === 0 && '0') ||
        (value / maxRaw) * 100 ||
        0,
      stateForceTimer: +new Date(),
    });
    // }
  };
  jumpToDeposit = currency => () => {
    this.urlJump('/assetAction/deposit/' + currency.toUpperCase())();
  };
  render() {
    const {
      symbol,
      type,
      asset,
      legalTender,
      convertMap = {},
      convertMap_digital = {},
      priceMode,
      intl: { formatMessage },
      app,
      history,
      extendData: { actions },
      isCpuSymbol,
    } = this.props;
    const {
      marks,
      inputValue,
      sliderValue,
      priceValue,
      maxTargetAsset,
      step,
      step1,
      loading,
    } = this.state;
    const { baseCurrency, quoteCurrency, tickSize, maxQty, minQty } = symbol;
    const LIMIT = priceMode === 'LIMIT';
    const BUY = type === 'buy';
    const { availableTotal: maxAsset, currency } =
      asset[(BUY && 'quoteAsset') || 'baseAsset'] || {};
    const {
      label1,
      label2,
      label3,
      label4,
      label5,
      label6,
      label7,
      color,
    } = this.getLabelMap(baseCurrency)[type];
    const execR = (inputValue * priceValue || 0).toFixed(step1.length - 2);
    const loadingComp = <Loading />;
    const needAuth = _.get(app, 'userConfig.tradeNeedVerify');
    const needBindDevice = !_.get(app, 'userConfig.userEosAccount');
    const needActiveDevice = _.get(app, 'userPkStatus.status') !== 'ACTIVED';
    const isCustomer = !sessionStorage.getItem('userId');
    const { tradeForbidden24h } = app.permissions || {};
    return (
      <div className={`order-item order-item-${type}`}>
        {((!isCpuSymbol || (isCpuSymbol && BUY)) && (
          <div className="order-header">
            <div>
              <M id="orderInput.available" values={{ num: +maxAsset || '0' }} />
              {currency}
            </div>
            <span>
              <a
                onClick={() => {
                  preCondition(
                    'deposit',
                    app,
                    history,
                    { superProps: this.props, actions },
                    () => {
                      history.push(
                        [
                          BASE_ROUTE,
                          prefix,
                          `/assetAction/deposit/${currency}`,
                        ].join('')
                      );
                    }
                  )();
                }}
              >
                <M id="orderInput.withdraw" />
              </a>
            </span>
          </div>
        )) || <div className="order-header">&nbsp;</div>}
        <div className="form-item">
          <span className="key">{label1}</span>
          <div className="input-wrap">
            <StyledInputNumber
              className="input-price"
              min={0}
              max={99999999999}
              step={U.calc(`${step1} * 100`)}
              value={LIMIT ? priceValue : ''}
              placeholder={
                (!LIMIT && formatMessage({ id: 'orderInput.bestExec' })) || ''
              }
              onChange={this.onpriceValueChange}
              unit={LIMIT ? quoteCurrency : ''}
              disabled={!LIMIT}
            />
            <span
              style={{
                color: (LIMIT && 'inherit') || 'transparent',
              }}
            >
              ≈{unitMap[legalTender]}
              {(
                priceValue *
                  convertMap_digital[quoteCurrency] *
                  convertMap['EOS'] || 0
              ).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="form-item">
          <span className="key">{label2}</span>
          <div className="input-wrap">
            <StyledInputNumber
              className="input-quantity"
              min={0}
              max={+maxQty}
              step={step}
              value={inputValue}
              onChange={this.onInputChange}
              unit={(!LIMIT && BUY && quoteCurrency) || baseCurrency}
            />
            <span
              style={{
                color: (LIMIT && 'inherit') || 'transparent',
                // color: (!LIMIT && BUY && 'transparent') || 'inherit',
                letterSpacing: '0.5px',
              }}
            >
              <M id="orderInput.sumVolume" />: {(+execR === 0 && '0') || execR}
              {quoteCurrency}
            </span>
          </div>
        </div>
        <div>
          <Slider
            marks={marks}
            onChange={this.onSliderChange}
            value={+sliderValue}
          />
        </div>
        <div className={'button ' + ((loading && 'opacity-btn') || '')}>
          <Button
            type="primary"
            onClick={() => {
              _czc.push(['_trackEvent', '交易按钮', '点击', type]);
              if (isCustomer) {
                const path = [BASE_ROUTE, prefix, '/login'].join('');
                history.push(path);
                return;
              }
              preCondition(
                'trade',
                app,
                history,
                { superProps: this.props, actions },
                () => {
                  if (isCustomer) {
                    const path = [BASE_ROUTE, prefix, '/login'].join('');
                    history.push(path);
                  } else if (+maxAsset === 0) {
                    this.jumpToDeposit(currency)();
                  } else {
                    this.submitOrder();
                  }
                }
              )();
            }}
            disabled={
              !needAuth &&
              !needBindDevice &&
              !needActiveDevice &&
              +maxAsset !== 0 &&
              (loading || !+inputValue || tradeForbidden24h === true)
            }
          >
            {(loading && loadingComp) || null}
            {(isCustomer && label5) ||
              (needBindDevice && label7) ||
              (needActiveDevice && label6) ||
              (needAuth && label4) ||
              (+maxAsset === 0 && (
                <M id="trade.goRechange" values={{ currency: currency }} />
              )) ||
              label3}
          </Button>
        </div>
      </div>
    );
  }
}

OrderItem.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(OrderItem);
