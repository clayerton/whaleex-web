import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { M, LayoutCT, LayoutLR, DeepBreadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { Spin } from 'antd';
import U from 'whaleex/utils/extends';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { injectIntl } from 'react-intl';
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
const errorimg =
  _config.cdn_url + '/web-static/imgs/web/depowithPage/error.png';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class DepositDetail extends React.Component {
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
    clearTimeout(window.getDepoDetail__Timer);
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
      PENDING_CONFIRM: [
        formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
      ],
      SUCCESS: [
        formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
        formatMessage({ id: 'depoWithDetail.deposiASureSuccess' }),
      ],
      SYNC_START: [
        formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
        formatMessage({ id: 'depoWithDetail.deposiASureSuccess' }),
        formatMessage({ id: 'depoWithDetail.dataAsync' }),
      ],
      SYNC_SUCCESS: [
        formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
        formatMessage({ id: 'depoWithDetail.deposiASureSuccess' }),
        formatMessage({ id: 'depoWithDetail.dataAsync' }),
        formatMessage({ id: 'depoWithDetail.depositSuccess' }),
      ],
      FAILURE: [
        formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
        formatMessage({ id: 'depoWithDetail.deposiASureSuccess' }),
        formatMessage({ id: 'depoWithDetail.dataAsync' }),
      ],
    };
    return status[type].includes(step);
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
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
    console.log(this.props);
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
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
              <M id="asset.tabDeposit" />,
              <M id="route.depositDetail" />,
            ]}
            actions={[this.urlJump('/user'), this.props.history.goBack]}
          />
          <div className="spin-center">
            <Spin size="large" spinning={true} />
          </div>
        </LayoutLR>
      );
    }
    const arr = [
      formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
      formatMessage({ id: 'depoWithDetail.deposiASureSuccess' }),
      formatMessage({ id: 'depoWithDetail.dataAsync' }),
      formatMessage({ id: 'depoWithDetail.depositSuccess' }),
    ];
    const step = arr.map((i, k) => {
      const statu = this.checkStatus(i, status);
      const time = [
        statusObj.createTime,
        statusObj.pendingTime,
        statusObj.syncRequestTime,
        statusObj.syncSuccessTime,
      ];
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
            <M id="asset.tabDeposit" />,
            <M id="route.depositDetail" />,
          ]}
          actions={[this.urlJump('/user'), this.props.history.goBack]}
        />
        <div>
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
                      <M id="depoWithDetail.sitfailed" />
                    </p>
                    <StyledButton
                      className="confirm-btn"
                      type="primary"
                      onClick={this.urlJump('/assetAction/deposit/' + coinId)}
                    >
                      <M id="depoWithDetail.sitagain" />
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
                      <M id="depoWithDetail.depositAccount" />
                    </label>
                    <span>
                      {statusObj.amount} {coinId}
                    </span>
                  </div>
                  <div className="depo-div">
                    <label>
                      <M id="depoWithDetail.depositCard" />
                    </label>
                    <span>{statusObj.eosAccount}</span>
                  </div>
                  <div className="depo-div">
                    <label>
                      <M id="depoWithDetail.sxf" />
                    </label>
                    <span>0</span>
                  </div>
                  <div className="depo-div">
                    <label>
                      <M id="depoWithDetail.dzsl" />
                    </label>
                    <span>
                      {statusObj.amount} {coinId}
                      <span className="changeCny">
                        ≈{unitMap[legalTender]}
                        {/* {(coinFee[0].EOS * statusObj.amount).toFixed(8)} */}
                        {U.formatLegalTender(
                          statusObj.amount * coinFee[coinId]
                        )}
                      </span>
                    </span>
                  </div>
                </DepoContent>
              </TopItems>
            </div>
          </DePo>
        </div>
      </LayoutLR>
    );
  }
}
DepositDetail.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').depositDetail.toJS();
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
  )(DepositDetail)
);
