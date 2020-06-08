import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedNumber } from 'react-intl';
import U from 'whaleex/utils/extends';
import { M, Coin } from 'whaleex/components';
import { preCondition } from 'whaleex/components/preconditions';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { WalWrap, BodyList, BodyHeader } from './style.js';
export class WalCard extends React.Component {
  render() {
    const {
      icon,
      unitMap,
      legalTender,
      totalAsset,
      convertMap,
      convertMap_digital,
      legaldigital,
      freeAmount,
      frozenAmount,
      stakeAmount,
      fixedAmount,
      totalAmount,
      unStakingAmount,
      urlJump,
      app,
      history,
      actions,
      formatMessage,
      mineConfig = {},
    } = this.props;
    const {
      unstakeWaitSeconds,
      mineAvailablePercent,
      mineReleasePercent,
      releasePercent,
    } = mineConfig;
    const totalWal = totalAmount;
    const text1 = (
      <span className="title_tip">
        <M id="asset.text1" />
      </span>
    );
    const text2 = (
      <span className="title_tip">
        <M id="asset.text2" />
      </span>
    );
    const text3 = (
      <span className="title_tip">
        <M
          id="asset.text3"
          values={{
            data: U.convertTime(unstakeWaitSeconds, formatMessage).join(''),
          }}
        />
      </span>
    );
    const text4 = (
      <span className="title_tip">
        <M
          id="position.tipsList"
          values={{
            percent1: U.percentNumber(mineReleasePercent).join(''),
            percent2: U.percentNumber(releasePercent).join(''),
          }}
          richFormat
        />
      </span>
    );

    return (
      <WalWrap>
        {/* <BodyHeader className="title">
          <div>
            <span>
              <Coin icon={icon} />
            </span>
            <span>WAL</span>
            <span>{totalWal}</span>
            <span className="user-asset-convert">
              ≈ {unitMap[legalTender]}
              {
                <FormattedNumber
                  value={
                    totalWal * convertMap_digital['WAL'] * convertMap['EOS'] ||
                    0
                  }
                />
              }
            </span>
          </div>
          <div>
            <span
              className="url-style no-line lineheight"
              onClick={() => {
                preCondition(
                  'deposit',
                  app,
                  history,
                  { superProps: this.props, actions },
                  urlJump(`/assetAction/deposit/WAL`)
                )();
              }}>
              <M id="asset.deposit" />
            </span>
            <span
              className="url-style no-line lineheight"
              onClick={() => {
                preCondition(
                  'withdraw',
                  app,
                  history,
                  { superProps: this.props, actions },
                  urlJump(`/assetAction/withdraw/WAL`)
                )();
              }}>
              <M id="asset.withdraw" />
            </span>
          </div>
        </BodyHeader> */}
        <BodyList>
          <div>
            <div className="title">
              <span>
                <M id="asset.freeAvailable" />(WAL)
                <Tooltip placement="top" className="title_tip" title={text2}>
                  <i className="iconfont icon-ArtboardCopy7" />
                </Tooltip>
              </span>
              <span className="big-number">{freeAmount}</span>
              <StyledButton
                className="confirm-btn"
                id="myasset_to_stake"
                type="primary"
                onClick={() => {
                  _czc.push(['_trackEvent', '我的资产-去锁仓', '点击']);
                  urlJump('/assetAction/positionLock')();
                }}
              >
                <M id="asset.goLock" />
              </StyledButton>
            </div>
          </div>
          {/* <div>
            <div className="title">
              <span>
                <M id="asset.frozen" />(WAL)
                <Tooltip placement="top" className="title_tip" title={text1}>
                  <i className="iconfont icon-ArtboardCopy7" />
                </Tooltip>
              </span>
              <span className="big-number">{frozenAmount}</span>
            </div>
          </div>
          <div>
            <div className="title">
              <span>
                <M id="asset.waitRelease" />(WAL)
                <Tooltip placement="top" className="title_tip" title={text4}>
                  <i className="iconfont icon-ArtboardCopy7" />
                </Tooltip>
              </span>
              <span className="big-number">
                {U.calc(`${fixedAmount}`) || 0}
              </span>
              <span
                className="url-style no-line lineheight"
                onClick={urlJump('/assetAction/positionList')}>
                <M id="asset.view" />
              </span>
            </div>
          </div> */}
          <div>
            <div className="title">
              <span className="text-no-wrap">
                <M id="asset.locking" />(WAL)
              </span>
              <span className="big-number">{stakeAmount}</span>
              <span
                className="url-style no-line lineheight"
                onClick={() => {
                  _czc.push(['_trackEvent', '我的资产-去解锁', '点击']);
                  urlJump('/assetAction/positionUnlock')();
                }}
              >
                <M id="asset.goUnlock" />
              </span>
            </div>
          </div>
          <div>
            <div className="title">
              <span className="text-no-wrap">
                <M id="asset.unlocking" />(WAL)
                <Tooltip placement="top" className="title_tip" title={text3}>
                  <i className="iconfont icon-ArtboardCopy7" />
                </Tooltip>
              </span>
              <span className="big-number">{unStakingAmount}</span>
              <span
                className="url-style no-line lineheight"
                onClick={urlJump('/assetAction/positionUnlockList')}
              >
                <M id="asset.view" />
              </span>
            </div>
          </div>
        </BodyList>
      </WalWrap>
    );
  }
}

WalCard.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(WalCard);
