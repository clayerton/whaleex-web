import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { AlertWrap, StyledAlert, ChainStatusBar } from './style.js';
import { LayoutLR, M, Switch, Table, DeepBreadcrumb } from 'whaleex/components';
import { Spin } from 'antd';
import { Breadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { injectIntl } from 'react-intl';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { match } = this.props;
    const {
      params: { id },
    } = match;
    this.props.actions.getChainDetail(id);
  }
  componentWillReceiveProps(nextProps) {}
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  checkStatus = (step, type) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const status = {
      INITIAL: [formatMessage({ id: 'chainStatus.waitChain' })],
      WAITING: [formatMessage({ id: 'chainStatus.waitChain' })],
      PENDING_CONFIRM: [
        formatMessage({ id: 'chainStatus.waitChain' }),
        formatMessage({ id: 'chainStatus.chaining' }),
      ],
      CONFIRMED: [
        formatMessage({ id: 'chainStatus.waitChain' }),
        formatMessage({ id: 'chainStatus.chaining' }),
        formatMessage({ id: 'chainStatus.waiting' }),
      ],
      BALANCE_WAITING: [
        formatMessage({ id: 'chainStatus.waitChain' }),
        formatMessage({ id: 'chainStatus.chaining' }),
        formatMessage({ id: 'chainStatus.waiting' }),
      ],
      BALANCE_PENDING_CONFIRM: [
        formatMessage({ id: 'chainStatus.waitChain' }),
        formatMessage({ id: 'chainStatus.chaining' }),
        formatMessage({ id: 'chainStatus.waiting' }),
      ],
      SUCCESS: [
        formatMessage({ id: 'chainStatus.waitChain' }),
        formatMessage({ id: 'chainStatus.chaining' }),
        formatMessage({ id: 'chainStatus.waiting' }),
        formatMessage({ id: 'chainStatus.waitSuccess' }),
      ],
      FAILURE: [
        formatMessage({ id: 'chainStatus.waitChain' }),
        formatMessage({ id: 'chainStatus.chaining' }),
        formatMessage({ id: 'chainStatus.waiting' }),
      ],
    };
    return status[type].includes(step);
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      intl: { formatMessage },
    } = this.props;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const statusData = _.get(this.props, 'store.result', []);
    // if (_.isEmpty(statusData)) {
    //   return (
    //     <div className="spin-center height-auto">
    //       <Spin size="large" spinning={true} />
    //     </div>
    //   );
    // }
    const arr = [
      formatMessage({ id: 'chainStatus.waitChain' }),
      formatMessage({ id: 'chainStatus.chaining' }),
      formatMessage({ id: 'chainStatus.waiting' }),
      formatMessage({ id: 'chainStatus.waitSuccess' }),
    ];
    const step = arr.map((i, k) => {
      const statu = this.checkStatus(
        i,
        (!!statusData && statusData.status) || 'INITIAL'
      );

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
          </div>
        </div>
      );
    });
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/tradeDetail"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[
            <M id="tradeDetail.history" />,
            <M id="tradeDetail.execHistory" />,
            <M id="tradeDetail.uploadChain" />,
          ]}
          actions={[
            this.urlJump('/user/tradeDetail'),
            this.urlJump('/user/tradeDetail?tab=2'),
          ]}
        />
        <div className="chainStatus-box">
          <AlertWrap>
            <StyledAlert
              message={formatMessage(
                { id: 'chainStatus.tipMess' },
                { data: 2 }
              )}
              type="warning"
              closable
            />
          </AlertWrap>
          <ChainStatusBar>
            <div className="depo-status">{step}</div>
          </ChainStatusBar>
        </div>
      </LayoutLR>
    );
  }
}

Address.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').chainStatus.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(allActions, dispatch),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Address)
);
