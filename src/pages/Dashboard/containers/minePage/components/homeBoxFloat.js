import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import {
  StyledCarousel,
  WalSlide,
  HomeBoxFloatText,
  BoxWrap,
  Box,
  MiddleLine,
} from './style.js';
import { M } from 'whaleex/components';
import Progress from './Progress.js';
import { Icon, Spin, Modal, Tooltip } from 'antd';
import U from 'whaleex/utils/extends';
import TradeRuleModal from 'whaleex/components/WalModal/TradeRuleModal.js';
import LockRuleModal from 'whaleex/components/WalModal/LockRuleModal.js';
const modals = {
  TradeRuleModal,
  LockRuleModal,
};
const profitImg = _config.cdn_url + '/web-static/imgs/profit.png';
const tradeImg = _config.cdn_url + '/web-static/imgs/trade.png';
const confirm = Modal.confirm;

class HomeBoxFloat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getRuleInfo = async key => {
    // LockRuleModal  ActiveRuleModal
    const { remoteInfo } = this.props;
    const WhichModal = modals[key];
    const confirmModal = confirm({
      content: (
        <WhichModal
          onCancel={() => {
            confirmModal.destroy();
          }}
          onOk={() => {
            confirmModal.destroy();
          }}
          remoteInfo={remoteInfo}
        />
      ),
      title: null,
      className: 'whaleex-common-modal',
      iconType: true,
      okCancel: false,
      width: '450px',
    });
  };

  urlJump = router => {
    this.props.urlJump(router);
  };
  render() {
    let {
      intl: { formatNumber },
    } = this.props;
    let {
      walData = {}, //walDataResult
      convertMap = {},
      convertMap_digital = {},
      feePercent,
      formatMessage,
      legalTender,
      remoteInfo,
      noticeList = [],
      activityList = [],
    } = this.props;
    const {
      exchangeAccumulateLimit,
      exchangeDayLimit,
      exchangeHourLimit,
      startup,
      feeAsRepoFundPercent,
    } = remoteInfo;
    const { all, youself } = walData;
    const {
      yesterdayMineAmount,
      currentRemainAmount,
      currentHourRemainAmount,
      totalTradingVolume,
      yesterdayRepoFundAmount,
      totalRepoFundAmount,
      yesterdayRepoFundDetails,
      accumulateMineAmount: alreadyTrade,
      avgWALPrice,
    } = all;
    const {
      accumulateMineAmount,
      currentMineAmount,
      yesterdayMineAmount: myyesterday,
    } = youself;
    let unit = 'WAL';
    return (
      <div>
        <BoxWrap>
          <div className="progress">
            <Progress
              data={{
                startup,
                already: alreadyTrade, //这个不需要换算
                total: 30,
                // exchangeAccumulateLimit / Math.pow(10, 8), //1亿  Math.pow(10,8) 该数值请做好换算 以亿为单位
              }}
            />
          </div>

          <div className="data-statistics">
            <div className="top-row">
              <a
                href="https://support.whaleex.com/hc/zh-cn/articles/360016323972-WAL%E4%BB%8B%E7%BB%8D"
                target="_blank"
              >
                <M id="homePage.whatWal" />
              </a>
              <a
                className="right-style"
                onClick={() => {
                  this.getRuleInfo('TradeRuleModal');
                }}
              >
                <M id="homePage.tradeRule" />
              </a>
            </div>

            <div className="data-info">
              <div className="data-frame">
                <div>
                  <div className="data-content">
                    {(exchangeHourLimit !== exchangeDayLimit && (
                      <p>
                        <M id="homePage.thisHour" />
                        <Tooltip
                          placement="top"
                          title={formatMessage(
                            { id: 'homePage.tooltip1' },
                            { sum: formatNumber(exchangeHourLimit || 0) }
                          )}
                        >
                          <i className="iconfont icon-ArtboardCopy7" />
                        </Tooltip>
                      </p>
                    )) || (
                      <p>
                        <M id="homePage.lastHourAvgPrice" />
                        <Tooltip
                          placement="top"
                          title={formatMessage({
                            id: 'homePage.tooltipAvgPrice',
                          })}
                        >
                          <i className="iconfont icon-ArtboardCopy7" />
                        </Tooltip>
                      </p>
                    )}
                    {(exchangeHourLimit !== exchangeDayLimit && (
                      <a>
                        {(startup &&
                          formatNumber(currentHourRemainAmount || 0)) ||
                          '--'}{' '}
                        <span>WAL</span>
                      </a>
                    )) || (
                      <a>
                        {(startup && avgWALPrice) || '--'} <span>EOS</span>
                      </a>
                    )}
                  </div>
                  <div className="data-content-little">
                    <p>
                      <M id="homePage.tradeAmount" />
                      <a>
                        {(startup && formatNumber(yesterdayMineAmount || 0)) ||
                          '--'}{' '}
                        <span>WAL</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <MiddleLine />
              <div className="data-frame">
                <div>
                  <div className="data-content">
                    <p>
                      <M id="homePage.thisDay" />
                      <Tooltip
                        placement="top"
                        title={formatMessage(
                          { id: 'homePage.tooltip2' },
                          { sum: formatNumber(exchangeDayLimit || 0) }
                        )}
                      >
                        <i className="iconfont icon-ArtboardCopy7" />
                      </Tooltip>
                    </p>
                    <a>
                      {(startup && formatNumber(currentRemainAmount || 0)) ||
                        '--'}{' '}
                      <span>WAL</span>
                    </a>
                  </div>

                  <div className="data-content-little">
                    <p>
                      <M id="homePage.circulationTotal" />
                      <a>
                        {(startup && formatNumber(totalTradingVolume || 0)) ||
                          '--'}{' '}
                        <span>WAL</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <MiddleLine />
              <div className="data-frame">
                <div>
                  <div className="data-content">
                    <p>
                      <M id="homePage.fundTotal" />
                      {/* <Tooltip
                        placement="top"
                        title={formatMessage({ id: 'homePage.tooltip4' })}
                      >
                        <i className="iconfont icon-ArtboardCopy7" />
                      </Tooltip>{' '} */}
                    </p>
                    <a>
                      ≈{' '}
                      {(startup &&
                        formatNumber(totalRepoFundAmount || 0, {
                          maximumFractionDigits: 4,
                        })) ||
                        '--'}{' '}
                      <span>EOS</span>
                    </a>
                  </div>

                  <div className="data-content-little">
                    <p>
                      <M id="homePage.fund" />
                      <Tooltip
                        placement="top"
                        title={formatMessage(
                          { id: 'homePage.tooltip3' },
                          {
                            percent: U.percentNumber(feeAsRepoFundPercent).join(
                              ''
                            ),
                          }
                        )}
                      >
                        <i className="iconfont icon-ArtboardCopy7" />
                      </Tooltip>{' '}
                      <a>
                        ≈{' '}
                        {(startup &&
                          formatNumber(yesterdayRepoFundAmount || 0, {
                            maximumFractionDigits: 4,
                          })) ||
                          '--'}{' '}
                        <span>EOS</span>
                        <Tooltip
                          placement="top"
                          title={
                            <div>
                              {Object.keys(yesterdayRepoFundDetails || {}).map(
                                key => {
                                  return (
                                    <p>
                                      <span>
                                        {yesterdayRepoFundDetails[key]}
                                      </span>{' '}
                                      <span>{key}</span>
                                    </p>
                                  );
                                }
                              )}
                            </div>
                          }
                        >
                          <i className="iconfont icon-ArtboardCopy7" />
                        </Tooltip>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {sessionStorage.getItem('userId') ? (
            <div className="flex-div">
              <span className="left-style">
                <img src={profitImg} />
                <M id="homePage.myProfit" />
              </span>
              <Box style={{ paddingTop: 35 }}>
                <p>
                  <M id="homePage.todayTrade" />
                </p>
                <div>
                  <span className="number">
                    {(startup && formatNumber(currentMineAmount || 0)) ||
                      '-.---'}
                  </span>
                  <span className="unit">WAL</span>
                </div>
                <div className="data-content-little">
                  <p>
                    <M id="homePage.yesterdayTrade" />
                    <a>
                      {(startup && formatNumber(myyesterday || 0)) || '-.---'}{' '}
                      <span>WAL</span>
                    </a>
                  </p>
                </div>
              </Box>
              <MiddleLine />
              <Box>
                <p>
                  <M id="homePage.tradeTotal" />
                </p>
                <div>
                  <span className="number">
                    {(startup && formatNumber(accumulateMineAmount || 0)) ||
                      '-.---'}
                  </span>
                  <span className="unit">WAL</span>
                </div>
              </Box>
              <MiddleLine />
              <Box>
                <img src={tradeImg} />
                {sessionStorage.getItem('userId') ? (
                  <a
                    className="button"
                    onClick={() => {
                      this.urlJump(`/trade/${U.getLastSelectSymbol()}`);
                    }}
                    id="want_mine"
                  >
                    <M id="homePage.gowk" />
                  </a>
                ) : (
                  <a
                    className="button"
                    onClick={() => {
                      this.urlJump('/login');
                    }}
                    id="want_mine"
                  >
                    <M id="homePage.gowk" />
                  </a>
                )}
              </Box>
            </div>
          ) : (
            <div className="flex-div">
              <span className="left-style">
                <img src={profitImg} />
                <M id="homePage.myProfit" />
              </span>
              <span
                className="right-style"
                onClick={() => {
                  this.urlJump('/login');
                }}
              >
                <M id="homePage.loginLook" />
              </span>
              <Box style={{ paddingTop: 35 }}>
                <p>
                  <M id="homePage.todayTrade" />
                </p>
                <div>
                  <span className="number">-.---</span>
                  <span className="unit">WAL</span>
                </div>
                <div className="data-content-little">
                  <p>
                    <M id="homePage.yesterdayTrade" />
                    <a>
                      -.--- <span>WAL</span>
                    </a>
                  </p>
                </div>
              </Box>
              <MiddleLine />
              <Box>
                <p>
                  <M id="homePage.tradeTotal" />
                </p>
                <div>
                  <span className="number">-.---</span>
                  <span className="unit">WAL</span>
                </div>
              </Box>
              <MiddleLine />
              <Box>
                <img src={tradeImg} />
                {sessionStorage.getItem('userId') ? (
                  <a
                    className="button"
                    onClick={() => {
                      this.urlJump(`/trade/${U.getLastSelectSymbol()}`);
                    }}
                    id="want_mine"
                  >
                    <M id="homePage.gowk" />
                  </a>
                ) : (
                  <a
                    className="button"
                    onClick={() => {
                      this.urlJump('/login');
                    }}
                    id="want_mine"
                  >
                    <M id="homePage.gowk" />
                  </a>
                )}
              </Box>
            </div>
          )}
        </BoxWrap>
      </div>
    );
  }
}

HomeBoxFloat.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(HomeBoxFloat);
