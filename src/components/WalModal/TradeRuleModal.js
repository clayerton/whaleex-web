import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import U from 'whaleex/utils/extends';
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon, Checkbox } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from './style.js';
import Styled from 'styled-components';
const StyledFrame = Styled.div`
  iframe{
    height: 250px;
    border: none;
    width: 100%;
    padding: 0 25px 20px;
    max-height: 700px;
  }
`;
export default class TradeRuleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { onCancel, onOk, remoteInfo } = this.props;
    const {
      expectBalanceHours,
      exchangeDayLimit,
      feePercent,
      feeResetCronTabInput,
      feeUserPosition,
      invitationRewardValidDays,
      invitePercent,
      inviteeReward,
      inviterReward,
      mineAvailablePercent,
      mineCronTabInput,
      mineReleasePercent,
      releaseCronTabInput,
      releaseLimit,
      releasePercent,
      unstakeWaitSeconds,
      exchangeAccumulateLimit,
      exchangeHourLimit,
    } = remoteInfo || {};
    // const { exchangeDayLimit } = mineConfig;
    const lan = U.getUserLan(); //step-4 取当前语言
    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="TradeRuleModal">
          <Icon
            type="close"
            onClick={() => {
              onCancel();
            }}
            className="close-btn"
          />
          <div className="content">
            <h1>
              <M id="userProtocol.mineTitle" />
            </h1>

            <div className="modal-text">
              <M
                id="invite.tradeRule"
                values={{
                  percent1: U.percentNumber(
                    mineAvailablePercent + mineReleasePercent
                  ).join(''),
                  percent2: U.percentNumber(mineAvailablePercent).join(''),
                  percent3: U.percentNumber(mineReleasePercent).join(''),
                  time: mineCronTabInput || '0',
                  total: 30,
                  //  U.formatInsertData(
                  //   exchangeAccumulateLimit / Math.pow(10, 8)
                  // ), //唐定要求修改 原来是 3.6   后端数字有bug 先写死
                  output: 50,
                  exchangeDayLimit: exchangeDayLimit,
                  // Number(exchangeHourLimit) || 0,
                }}
                richFormat
              />
              <span style={{ float: 'right', marginBottom: 10 }}>
                <M
                  id="invite.detail"
                  values={{
                    detail: (
                      <a
                        target="_blank"
                        href="https://support.whaleex.com/hc/zh-cn/articles/360019297071-WhaleEx%E4%BA%A4%E6%98%93%E6%8C%96%E7%9F%BF%E7%BB%86%E5%88%99"
                      >
                        <M id="orderHistory.detail" />
                      </a>
                    ),
                  }}
                />
              </span>
              {/* <img src={mineImg.url} /> */}
            </div>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
