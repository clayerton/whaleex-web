import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import U from 'whaleex/utils/extends';
import { OrderList, M } from 'whaleex/components';
import { getColumns, columnsHeader } from './columns.js';
import './style.less';
const StyledOrder = styled.div`
  width: 100%;
  height: 100%;
  color: #4e6a79;
  padding: 0 0 10px 0;
  > div {
    padding: 0 10px;
  }
  * {
    cursor: pointer;
    user-select: none;
  }
  .order-card-title {
    border-bottom: 1px solid #e8e8e8;
    padding: 11px 10px;
    color: #658697;
    font-size: 14px;
    font-family: 'rLight';
  }
`;
const StyledFlow = styled.div`
  overflow: auto;
  height: calc(100% - 73px);
`;

export default class TradeHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      ['list', 'isCpuSymbol']
    );
    if (isChanged) {
      return true;
    }
    return false;
  }
  render() {
    const { list, symbol, isCpuSymbol } = this.props;
    const style = {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    };
    const { baseCurrency, quoteCurrency, lotSize } = symbol;
    return (
      <StyledOrder>
        <div className="order-card-title">
          <M id="tradeHistory.list" />
        </div>
        <OrderList
          columns={getColumns(
            { base: baseCurrency, quote: quoteCurrency },
            isCpuSymbol
          )}
          header
        />
        <StyledFlow>
          <OrderList
            data={list.map(i => {
              const { timestamp, price, bidAsk } = i;
              return { ...i, price: (bidAsk === 'A' && price) || -price };
            })}
            columns={getColumns({ lotSize }, isCpuSymbol)}
            style={style}
          />
        </StyledFlow>
      </StyledOrder>
    );
  }
}

TradeHistory.PropTypes = {
  handler: PropTypes.function,
};
