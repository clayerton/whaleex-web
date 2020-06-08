import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import U from 'whaleex/utils/extends';
import OrderItem from './OrderItem';
import { ListenOrderBookPosition, ListenOrderBookClick } from './listener.js';
import { getColumns, getColumnsHeader } from './columns.js';
import { OrderList } from 'whaleex/components';
import M from 'whaleex/components/FormattedMessage';
import './style.less';
const StyledOrder = styled.div`
  width: 100%;
  height: 100%;
  color: #4e6a79;
  padding: 0 0 12px 0px;
  padding-right: 0;
  position: relative;
  > div {
    padding-left: 10px;
  }
  > div:nth-child(2) {
    padding-right: 10px;
  }
  * {
    cursor: pointer;
    user-select: none;
  }
  .order-card-title {
    border-bottom: 1px solid #e8e8e8;
    font-size: 14px;
    font-family: 'rLight';
    * {
      color: #658697;
      font-size: 15px;
    }
    .ant-select-selection__rendered {
      margin: 0;
    }
    > div:first-child {
      padding: 6px 0;
    }
    > div > div:last-child {
      > span {
        display: block;
        width: 100%;
        text-align: right;
      }
    }
  }
`;
const StyledFlow = styled.div`
  height: calc(100% - 73px);
  overflow: auto;
`;
let timer = undefined;
const getDefaultState = (precision, partition) => {
  if (partition === 'CPU') {
    return {
      showIdx: 'all', //buy,all
      accuracyIdx: precision,
      showList: [
        { key: 'sell', label: <M id="orderBook.onlySell" /> },
        { key: 'buy', label: <M id="orderBook.onlyBuy" /> },
        { key: 'all', label: <M id="orderBook.all" /> },
      ],
      accuracyList: [
        {
          key: precision,
          label: (
            <M id="orderBook.precision" values={{ precision: precision - 2 }} />
          ),
        },
      ],
    };
  }
  return {
    showIdx: 'all', //buy,all
    accuracyIdx: precision - 2,
    showList: [
      { key: 'sell', label: <M id="orderBook.onlySell" /> },
      { key: 'buy', label: <M id="orderBook.onlyBuy" /> },
      { key: 'all', label: <M id="orderBook.all" /> },
    ],
    accuracyList: [
      {
        key: precision,
        label: <M id="orderBook.precision" values={{ precision }} />,
      },
      {
        key: precision - 1,
        label: (
          <M id="orderBook.precision" values={{ precision: precision - 1 }} />
        ),
      },
      {
        key: precision - 2,
        label: (
          <M id="orderBook.precision" values={{ precision: precision - 2 }} />
        ),
      },
    ],
  };
};
export default class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    const { precision, partition } = props.symbol;
    this.state = getDefaultState(precision, partition);
  }
  componentWillReceiveProps(nextProps) {
    const { precision, partition } = this.props.symbol;
    const { precision: _precision, partition: _partition } = nextProps.symbol;
    if (precision !== _precision || partition !== _partition) {
      this.setState(preState => {
        return Object.assign(
          {},
          preState,
          getDefaultState(_precision, _partition)
        );
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    //最后成交改变 则认为 orderBook 需要更新
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'latestTrade',
        'legalTender',
        'asks',
        'bids',
        'symbolMarket',
        'convertMap',
        'symbol',
      ]
    );
    const isStateChanged = U.isObjDiff(
      [nextState, this.state],
      ['showIdx', 'accuracyIdx', 'network']
    );
    //TODO change to really data
    if (isChanged || isStateChanged) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.SetOrderBookPosition();
    ListenOrderBookPosition();
    ListenOrderBookClick((type, data) => {
      const { price, quantity, askBId, depth = 0 } = data;
      const { lotSize } = this.props.symbol;
      const { showIdx, accuracyIdx } = this.state;
      let sideType = (askBId === 'buy' && 'asks') || 'bids';
      const list = this.props[sideType];
      const askData = this.mergeData(list, accuracyIdx, lotSize, sideType);
      let _list = askData.slice(0, depth);
      const sum = _.sumBy(_list, o => +o.quantity);
      this.props.onClickBookItem(askBId, {
        price,
        quantity: (type === 'dblclick' && sum) || 0,
        keytype: type,
      });
    });
    const loop = () => {
      clearTimeout(timer);
      let curTime = +new Date();
      let lastUpdateTime = sessionStorage.getItem('lastOrderBookUpdate');
      if (curTime - lastUpdateTime > 60 * 1000) {
        this.setState({
          network: { type: 'close' },
        });
      } else if (curTime - lastUpdateTime > 6000) {
        this.setState({
          network: {
            type: 'delay',
            time: Math.floor((curTime - lastUpdateTime) / 1000),
          },
        });
      } else {
        this.setState({
          network: {},
        });
      }
      timer = setTimeout(() => {
        loop();
      }, 1000);
    };
    timer = setTimeout(loop, 15000);
  }
  componentDidUpdate() {
    // const orderFlow = document.getElementById('order-flow');
    //   orderFlow.scrollTop = 0;
    const { tabChange } = this.state;
    if (tabChange) {
      this.SetOrderBookPosition();
      this.setState({ tabChange: false });
    }
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }
  SetOrderBookPosition = force => {
    const { showIdx } = this.state;
    const orderFlow = document.getElementById('order-flow');
    if (showIdx === 'all' || force) {
      orderFlow.scrollTop =
        (orderFlow.scrollHeight - orderFlow.offsetHeight) / 2;
    } else if (showIdx === 'sell') {
      orderFlow.scrollTop = 1000;
    } else if (showIdx === 'buy') {
      orderFlow.scrollTop = 0;
    }
  };
  getDecimal = (num, precision, dir = 'bid') => {
    let base = Math.pow(10, precision);
    if (dir === 'bid') {
      return (Math.floor(U.calc(`${num} * ${base}`)) / base).toFixed(precision);
    }
    return (Math.ceil(U.calc(`${num} * ${base}`)) / base).toFixed(precision);
  };
  mergeData = (data, precision, lotSize, askBid) => {
    return data.reduce((pre, cur, idx) => {
      const { price, quantity } = cur;
      const preLast = pre.slice(-1)[0] || {};
      const { price: _price, quantity: _quantity } = preLast;
      const newPrice = this.getDecimal(+price, precision, askBid);
      if (newPrice === _price) {
        preLast.quantity = this.getDecimal(
          +preLast.quantity + +quantity,
          lotSize.length - 2,
          askBid
        );
      } else {
        pre.push({
          price: newPrice,
          quantity: this.getDecimal(+quantity, lotSize.length - 2, askBid),
        });
      }
      return pre;
    }, []);
  };
  mapData = (asks, bids) => {
    const { showIdx, accuracyIdx } = this.state;
    const { lotSize } = this.props.symbol;
    let bidsLength = 20,
      asksLength = 20;
    if (showIdx === 'sell') {
      bidsLength = 0;
      asksLength = 20;
    } else if (showIdx === 'buy') {
      bidsLength = 20;
      asksLength = 0;
    }
    // const maxBidsAmount = _.get(_.maxBy(bids, o => +o.quantity), 'quantity', 1);
    const askData = this.mergeData(asks, accuracyIdx, lotSize, 'ask');
    const bidData = this.mergeData(bids, accuracyIdx, lotSize, 'bid');
    const maxAmount = _.get(
      _.maxBy(askData.slice(0, 20).concat(bidData.slice(0, 20)), o => +o.quantity),
      'quantity',
      1
    );
    const colorAsksData = askData.slice(0, asksLength).reduce(
      (pre, cur, idx) => {
        const { price } = cur;
        pre.data.push({
          ...cur,
          same: pre.tag && price.slice(0, -2) === pre.tag,
          rate: -cur.quantity / maxAmount,
          orderIdx: -(idx + 1),
        });
        pre.tag = price.slice(0, -2);
        return pre;
      },
      { data: [], tag: undefined }
    ).data;
    const askL = colorAsksData.length;
    if (askL < asksLength) {
      for (let i = 0, l = asksLength - askL; i < l; i++) {
        colorAsksData.push({ orderIdx: -(askL + i + 1), rate: 0 });
      }
    }
    const colorBidsData = bidData.slice(0, bidsLength).reduce(
      (pre, cur, idx) => {
        const { price } = cur;
        pre.data.push({
          ...cur,
          same: pre.tag && price.slice(0, -2) === pre.tag,
          rate: cur.quantity / maxAmount,
          orderIdx: idx + 1,
        });
        pre.tag = price.slice(0, -2);
        return pre;
      },
      { data: [], tag: undefined }
    ).data;
    const bidsL = colorBidsData.length;
    if (bidsL < bidsLength) {
      for (let i = 0, l = bidsLength - bidsL; i < l; i++) {
        colorBidsData.push({ orderIdx: bidsL + i + 1, rate: 0 });
      }
    }
    return {
      colorAsksData,
      colorBidsData,
    };
  };
  setFilter = (key, value) => {
    this.setState({ [key]: value, tabChange: true });
  };
  // resetPosition = () => {
  //   // const sellOrder = document.getElementById('sell-order');
  //   // if (sellOrder) {
  //   //   sellOrder.scrollTop = sellOrder.scrollHeight;
  //   // }
  //   this.SetOrderBookPosition(true);
  // };
  render() {
    // const { asks, bids, rate, unit } = this.props;
    const {
      asks,
      bids,
      latestTrade,
      symbol,
      convertMap,
      convertMap_digital,
      legalTender,
      history,
      symbolMarket,
      isCpuSymbol,
    } = this.props;
    const { showIdx, network } = this.state;
    const { colorAsksData, colorBidsData } = this.mapData(asks, bids);
    const style = (showIdx === 'all' && {}) || {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    };
    const { baseCurrency, quoteCurrency } = symbol;
    return (
      <StyledOrder>
        <OrderList
          className="order-card-title"
          columns={getColumnsHeader(this, isCpuSymbol)}
          header
          filter={this.state}
          setFilter={this.setFilter}
        />
        <OrderList
          columns={getColumns({
            base: baseCurrency,
            quote: quoteCurrency,
            isCpuSymbol,
          })}
          header
        />
        <StyledFlow
          type={showIdx}
          className={'type-' + showIdx}
          id="order-flow"
        >
          <OrderList
            data={colorAsksData.reverse()}
            columns={getColumns({ isCpuSymbol })}
            style={style}
            id="sell-order"
            display={['sell', 'all'].includes(showIdx)}
          />
          <OrderItem
            data={latestTrade}
            symbol={symbol}
            convertMap={convertMap}
            convertMap_digital={convertMap_digital}
            legalTender={legalTender}
            showIdx={showIdx}
            network={network}
            symbolMarket={symbolMarket}
            isCpuSymbol={isCpuSymbol}
          />
          <OrderList
            data={colorBidsData}
            columns={getColumns({ isCpuSymbol })}
            style={style}
            display={['buy', 'all'].includes(showIdx)}
          />
        </StyledFlow>
        <OrderItem
          data={latestTrade}
          symbol={symbol}
          convertMap={convertMap}
          convertMap_digital={convertMap_digital}
          legalTender={legalTender}
          network={network}
          symbolMarket={symbolMarket}
          id="order-item-affix"
          isCpuSymbol={isCpuSymbol}
        />
      </StyledOrder>
    );
  }
}

OrderBook.PropTypes = {
  handler: PropTypes.function,
};
