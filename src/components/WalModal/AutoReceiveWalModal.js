import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import { Icon } from 'antd';
import U from 'whaleex/utils/extends';

import styled from 'styled-components';
import M from 'whaleex/components/FormattedMessage'; //step-2
import { Coin } from 'whaleex/components';
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
export const Wrap = styled.div`
  .award-list {
    overflow-y: auto;
    height: 170px;
    > span {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background-color: #ffe7c5;
      margin-bottom: 8px;
      display: block;
      line-height: 40px;
      padding-left: 24px;
      text-align: left;
      color: #303030;
      font-size: 14px;
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        margin-top: 18px;
      }
    }
  }
  &.AutoReceiveWalModal {
    text-align: center;
    position: relative;
    width: 400px;
    margin: 0 auto;
    img {
      margin-bottom: 20px;
      width: 400px;
    }
    p {
      color: #f0e8b2;
      font-size: 36px;
      position: absolute;
      left: 0;
      right: 0;
      top: 63px;
    }
    .wal-deposit {
      font-size: 16px;
      height: 200px;
      width: 360px;
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      top: 246px;
      .wal-amount {
        color: #f0e8b2;
        font-size: 12px;
        margin-bottom: 8px;
        display: flex;
      }
    }
    .close-btn {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
`;

export default class AutoReceiveWalModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { onCancel, onOk, data, asyncData } = this.props;
    const [autoReceiveCurrency, convertMap] = asyncData;
    const { icon } = autoReceiveCurrency;
    const lan = U.getUserLan(); //step-4 取当前语言
    // step-5 IntlProvider 包裹组件
    if (typeof data.result === 'string') {
      data.result = { WAL: data.result };
    }
    const eosAmount = Object.keys(data.result).reduce((pre, coin) => {
      let sum = pre + data.result[coin] * convertMap[coin];
      return sum;
    }, 0);
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="AutoReceiveWalModal">
          <img
            src={_config.cdn_url + '/web-static/imgs/walModal/redEnvelope.png'}
          />
          <p>
            <M id="components.receiveSuccess" />
          </p>
          <div className="wal-deposit">
            <span className="wal-amount">
              <M
                id="components.receiveAmount"
                values={{
                  amount: eosAmount.toFixed(4),
                }}
              />
            </span>

            <div className="award-list">
              {Object.keys(data.result).map(coin => {
                return (
                  <span key={coin}>
                    {autoReceiveCurrency
                      .filter(({ shortName }) => shortName === coin)
                      .map(i => {
                        const { icon } = i;
                        return <Coin key={i} icon={icon} />;
                      })}
                    {data.result[coin]} {coin}
                  </span>
                );
              })}
            </div>
          </div>
          <Icon />
          <img
            src={_config.cdn_url + '/web-static/imgs/walModal/close2.png'}
            type="close"
            onClick={onCancel}
            className="close-btn"
          />
        </Wrap>
      </IntlProvider>
    );
  }
}
