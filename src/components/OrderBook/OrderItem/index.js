import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import NetworkDetector from 'whaleex/components/NetworkDetector';
import './style.less';
// display: flex;
const StyledItem = styled.div`
  align-items: center;
  min-height: 37px;
  height: 40px;
  background: #fff;
  z-index: 2;
  position: ${props => props.showIdx !== 'all' && 'relative'};
  left: ${props => props.showIdx !== 'all' && ' -10px'};
  padding-left: ${props => props.showIdx !== 'all' && '10px'};
  width: ${props => props.showIdx !== 'all' && 'calc(100% + 10px)'};
  box-shadow: ${props =>
    (props.showIdx === 'buy' && `0px 2px 3px 0px rgba(124, 166, 188, 0.1)`) ||
    (props.showIdx === 'sell' && '0px -2px 3px 0px rgba(124, 166, 188, 0.1)') ||
    'none'};
  &:active {
    opacity: 0.5;
  }
  .item-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    > div:first-child {
      display: flex;
      flex-direction: column;
      > span {
        &.bigNum {
          font-size: 18px;
          text-align: right;
          color: #44cb9c;
          padding: 0 5px;
          &.bid {
            color: #f27762;
          }
        }
        &.smallNum {
          font-size: 10px;
          text-align: left;
          color: #99acb6;
          padding: 0 10px;
        }
      }
    }
  }
  .extend-container {
    min-height: 37px;
    margin-right: 15px;
  }
`;
export default class OrderItem extends React.Component {
  render() {
    const {
      data,
      symbol,
      convertMap = {},
      convertMap_digital = {},
      legalTender,
      id,
      showIdx,
      network,
      symbolMarket,
      isCpuSymbol,
    } = this.props;
    const { lastPrice } = symbolMarket;
    const { price = lastPrice, quantity, bidAsk } = data;
    const { quoteCurrency } = symbol;
    return (
      <StyledItem
        id={id || 'order-item'}
        data-price={price}
        data-quantity={0}
        data-askBId={'buy'}
        showIdx={showIdx}
      >
        <div className="item-container">
          {(isCpuSymbol && (
            <div>
              <span className={`bigNum ${(bidAsk === 'A' && 'ask') || 'bid'}`}>
                {U.getPercentFormat(price)}
              </span>
            </div>
          )) || (
            <div>
              <span className={`bigNum ${(bidAsk === 'A' && 'ask') || 'bid'}`}>
                {price}
              </span>
              <span className="smallNum">
                ≈{unitMap[legalTender]}
                {U.formatLegalTender(
                  price * convertMap_digital[quoteCurrency] * convertMap['EOS']
                )}
              </span>
            </div>
          )}

          <div className="extend-container">
            <NetworkDetector network={network} />
          </div>
        </div>
      </StyledItem>
    );
  }
}

OrderItem.PropTypes = {
  handler: PropTypes.function,
};
