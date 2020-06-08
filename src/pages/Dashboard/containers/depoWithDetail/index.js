import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { M, LayoutCT, LayoutLR, DeepBreadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { Spin, Modal } from 'antd';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { injectIntl } from 'react-intl';
import U from 'whaleex/utils/extends';
import { WithdrawNotArrived } from 'whaleex/components/WalModal';
const confirm = Modal.confirm;
import {
  DePo,
  StyledAlert,
  AlertWrap,
  TopItems,
  DepoStatusBar,
  DepoContent,
} from './style/style.js';
import { resetState, getDepoDetail, convertMap } from './actions';
const defaultStatusImg =
  _config.cdn_url + '/web-static/imgs/web/depowithPage/dengdaitibi.png';
const errorimg = _config.cdn_url + '/web-static/imgs/web/depowithPage/error.png';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class DepoWithDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.pageInit(this.props);
  }
  componentWillReceiveProps(nextProps, nextState) {
    this.pageInit(nextProps);
  }
  componentWillUnmount() {
    this.props.resetState();
    clearTimeout(window.getDepoDetailTimer);
  }
  pageInit = props => {
    const { checkedPageStatus } = this.state;
    const { legalTender, match } = props;
    const {
      params: { type, recordId },
    } = match;
    if (!checkedPageStatus && legalTender) {
      this.setState({ checkedPageStatus: true });
      let coinId = recordId
        .substring(recordId.lastIndexOf('&') + 1)
        .toUpperCase();
      let _recordId = recordId.substring(0, recordId.indexOf('&'));
      this.props.getDepoDetail(_recordId);
      this.props.convertMap(legalTender);
    }
  };
  checkStatus = (step, type = 'FAILURE') => {
    const {
      intl: { formatMessage },
    } = this.props;
    const status = {
      INITIAL: [formatMessage({ id: 'depoWithDetail.fqtb' })],
      PENDING_CONFIRM: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
      ],
      WAITING: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
      ],
      CONFIRMED: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
      ],
      BALANCE_WAITING: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
        formatMessage({ id: 'depoWithDetail.eoszl' }),
      ],
      BALANCE_PENDING_CONFIRM: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
        formatMessage({ id: 'depoWithDetail.eoszl' }),
      ],
      SUCCESS: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
        formatMessage({ id: 'depoWithDetail.eoszl' }),
        formatMessage({ id: 'depoWithDetail.dataAsync' }),
      ],
      SYNC_START: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
        formatMessage({ id: 'depoWithDetail.eoszl' }),
        formatMessage({ id: 'depoWithDetail.dataAsync' }),
      ],
      SYNC_SUCCESS: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
        formatMessage({ id: 'depoWithDetail.eoszl' }),
        formatMessage({ id: 'depoWithDetail.dataAsync' }),
        formatMessage({ id: 'depoWithDetail.tbdz' }),
      ],
      FAILURE: [
        formatMessage({ id: 'depoWithDetail.fqtb' }),
        formatMessage({ id: 'depoWithDetail.tjqq' }),
      ],
    };
    return status[type].includes(step);
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };

  withDrawNotArrived = () => {
    const confirmModal = confirm({
      content: (
        <WithdrawNotArrived
          onCancel={noMoreLoginError => {
            confirmModal.destroy();
          }}
          onOk={noMoreLoginError => {
            confirmModal.destroy();
          }}
        />
      ),
      title: null,
      className: 'whaleex-common-modal',
      iconType: true,
      okCancel: false,
      width: '500px',
    });
  };

  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      store = {},
      legalTender,
      intl: { formatMessage },
    } = this.props;
    const {
      params: { type, recordId },
    } = match;
    let coinId = recordId
      .substring(recordId.lastIndexOf('&') + 1)
      .toUpperCase();
    const { statusObj = {}, coinFee } = store;
    const { status } = statusObj;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    //coinfee或status空
    if (_.isEmpty(statusObj) || _.isEmpty(coinFee)) {
      return (
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user"
          history={history}
          match={match}
        >
          <DeepBreadcrumb
            arr={[
              <M id="asset.myAsset" />,
              <M id="asset.tabWithdraw" />,
              <M id="route.withdrawDetail" />,
            ]}
            actions={[this.urlJump('/user'), this.props.history.goBack]}
          />
          <div className="spin-center">
            <Spin size="large" spinning={true} />
          </div>
        </LayoutLR>
      );
    }

    const ExtraContent = (
      <div className="depoWithPage-extends">
        <a onClick={this.withDrawNotArrived}>
          <M id="components.withdrawNotArrived" />
        </a>
      </div>
    );

    const arr = [
      formatMessage({ id: 'depoWithDetail.fqtb' }),
      formatMessage({ id: 'depoWithDetail.tjqq' }),
      formatMessage({ id: 'depoWithDetail.eoszl' }),
      formatMessage({ id: 'depoWithDetail.dataAsync' }),
      formatMessage({ id: 'depoWithDetail.tbdz' }),
    ];
    const step = arr.map((i, k) => {
      const statu = this.checkStatus(i, status);
      const time = [
        statusObj.createTime,
        statusObj.confirmTime,
        statusObj.balanceTime,
        statusObj.syncRequestTime,
        statusObj.syncSuccessTime,
      ];
      // createTime 发起请求 1
      // confirmTime 主链确认成功
      // pendingTime 待确认 --
      // waitingTime  --
      // balanceTime 清算完成
      // syncRequestTime 同步
      // syncSuccessTime
      if (status == 'FAILURE') {
        return (
          <div key={k} className="mapDetail">
            <div className="detail-line">
              {k === 0 ? (
                ''
              ) : (
                <div className={(statu && 'error-bar error-active') || 'bar'} />
              )}
              {k === 3 ? (
                <div className={statu && 'error-bar error-active'} />
              ) : (
                ''
              )}
              <div className={(statu && '_circle error-active') || '_circle'} />
            </div>
            <div
              className={
                (statu && 'title-line error-activeText') || 'title-line'
              }
            >
              <span>{i}</span>
              <span>
                {time[k] ? moment(+time[k]).format('YYYY/MM/DD HH:mm:ss') : ''}
              </span>
            </div>
          </div>
        );
      } else {
        return (
          <div key={k} className="mapDetail">
            <div className="detail-line">
              {k === 0 ? (
                ''
              ) : (
                <div className={(statu && 'bar active') || 'bar'} />
              )}
              <div className={(statu && '_circle active') || '_circle'} />
            </div>
            <div className={(statu && 'title-line activeText') || 'title-line'}>
              <span>{i}</span>
              <span>
                {time[k] ? moment(+time[k]).format('YYYY/MM/DD HH:mm:ss') : ''}
              </span>
            </div>
          </div>
        );
      }
    });
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}
      >
        {/* <LayoutCT history={history} match={match} /> */}
        <DeepBreadcrumb
          arr={[
            <M id="asset.myAsset" />,
            <M id="asset.tabWithdraw" />,
            <M id="route.withdrawDetail" />,
          ]}
          actions={[this.urlJump('/user'), this.props.history.goBack]}
          extend={ExtraContent}
        />
        <DePo>
          <div className="depoWithDetail-box">
            {/* {type}-{recordId} */}
            <AlertWrap>
              <StyledAlert
                message={formatMessage({ id: 'depoWithDetail.wxts' })}
                type="warning"
                closable
              />
            </AlertWrap>
            <TopItems>
              {status === 'FAILURE' ? (
                <div className="error-process">
                  <img src={errorimg} />
                  <p>
                    <M id="depoWithDetail.failed" />
                  </p>
                  <StyledButton
                    className="confirm-btn"
                    type="primary"
                    onClick={this.urlJump(
                      '/assetAction/withdraw/' + coinId
                    )}
                  >
                    <M id="depoWithDetail.again" />
                  </StyledButton>
                </div>
              ) : (
                <div>
                  <img src={defaultStatusImg} />
                </div>
              )}
              <DepoStatusBar>
                <div className="depo-status">{step}</div>
              </DepoStatusBar>
              <DepoContent>
                <div className="depo-div">
                  <label>
                    <M id="depoWithDetail.tbsl" />
                  </label>
                  <span>
                    {U.calc(`${statusObj.amount} + ${statusObj.fee}`)} {coinId}
                  </span>
                </div>
                {/* <div className="depo-div">
                      <label>
                        <M id="depoWithDetail.bzlx" />
                      </label>
                      <span>{statusObj.currency}</span>
                    </div> */}
                <div className="depo-div">
                  <label>
                    <M id="depoWithDetail.depoWithAdress" />
                  </label>
                  <span>{statusObj.eosAccount}</span>
                </div>
                <div className="depo-div">
                  <label>
                    <M id="depoWithDetail.sxf" />
                  </label>
                  <span>
                    {statusObj.fee} {coinId}
                  </span>
                </div>
                <div className="depo-div">
                  <label>
                    <M id="depoWithDetail.dzsl" />
                  </label>
                  <span>
                    {statusObj.amount} {coinId}
                    <span className="changeCny">
                      ≈{unitMap[legalTender]}
                      {(coinFee[coinId] * statusObj.amount).toFixed(2)}
                    </span>
                  </span>
                </div>
              </DepoContent>
            </TopItems>
          </div>
        </DePo>
      </LayoutLR>
    );
  }
}

DepoWithDetail.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').depoWithDetail.toJS();
}

export const mapDispatchToProps = {
  resetState,
  getDepoDetail,
  convertMap,
};

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(DepoWithDetail)
);
