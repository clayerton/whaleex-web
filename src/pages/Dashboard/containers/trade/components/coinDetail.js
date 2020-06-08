import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import QueueAnim from 'rc-queue-anim';
import './style.less';
import { M } from 'whaleex/components';
import U from 'whaleex/utils/extends';
import { Spin } from 'antd';
export const CoinDetailWrap = styled.div`
  height: 130px;
  background-color: #f6f8fa;
  padding: 0 60px;
`;
export default class CoinDetail extends React.Component {
  render() {
    const { currencyObj = {}, isCpuSymbol } = this.props;
    let {
      publishVolume,
      circulateVolume,
      whitePaper,
      website,
      description = {},
      contractQuery,
    } = currencyObj;
    const lan = U.getUserLan();
    const _description = JSON.parse(description);
    const desc = _.get(_description, lan) || '--';

    //description===undefined loading null ''
    // <Spin>
    const cpuStyle =
      (isCpuSymbol && {
        width: '80%',
      }) ||
      {};
    return (
      <QueueAnim type="top">
        <Spin size="large" spinning={!currencyObj} key="coinDetail">
          <CoinDetailWrap>
            <div className="wrap-style">
              <div className="introduction" style={cpuStyle}>
                <p>
                  <M id="trade.introduction" />
                </p>
                <span>{desc}</span>
              </div>
              {(!isCpuSymbol && (
                <div className="coin-info">
                  <div className="wrap-style">
                    <div className="item">
                      <div>
                        <span>
                          <M id="trade.totalAmount" />
                        </span>
                        {(publishVolume && (
                          <a>
                            {publishVolume} <M id="trade.billion" />
                          </a>
                        )) ||
                          '--'}
                      </div>
                      <div>
                        <span>
                          <M id="trade.contractName" />
                        </span>
                        <a>{contractQuery || '--'}</a>
                      </div>
                    </div>
                    <div className="item">
                      <div>
                        <span>
                          <M id="trade.circulation" />
                        </span>
                        {(circulateVolume && (
                          <a>
                            {circulateVolume} <M id="trade.billion" />
                          </a>
                        )) ||
                          '--'}
                      </div>
                      <div>
                        <span>
                          <M id="trade.website" />
                        </span>
                        <a
                          href={website}
                          target="_blank"
                          style={{ cursor: 'pointer' }}
                        >
                          {website || '--'}
                        </a>
                      </div>
                    </div>
                    <div className="item">
                      <div>
                        <span>
                          <M id="route.whitePaper" />
                        </span>
                        <a
                          href={whitePaper}
                          target="_blank"
                          style={{ cursor: 'pointer' }}
                        >
                          {whitePaper || '--'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )) ||
                null}
            </div>
          </CoinDetailWrap>
        </Spin>
      </QueueAnim>
    );
  }
}
