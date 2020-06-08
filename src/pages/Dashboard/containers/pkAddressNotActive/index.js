import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Modal } from 'antd';
import {
  LayoutLR,
  M,
  Switch,
  Table,
  DeepBreadcrumb,
  DeviceCard,
} from 'whaleex/components';
import { DeveiceLimitModal } from 'whaleex/components/WalModal';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { List } from './style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const confirm = Modal.confirm;
export class PkAddressNotActive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.actions.getPkBinded();
  }
  componentWillReceiveProps(nextProps) {}
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  goActive = pk => {
    const { pks = [] } = this.props;
    if (pks.length >= 10000) {
      const confirmModal = confirm({
        content: (
          <DeveiceLimitModal
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
        width: '400px',
      });
    } else {
      this.urlJump('/usercenter/pkAddress/bind/' + pk)();
    }
  };
  render() {
    const { history, match, baseRoute, prefix } = this.props;
    const storedPks = _.get(this.props, 'store.storedPks', []);
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[
            <M id="route.userCenter" />,
            <M id="route.pkAddressNotActive" />,
          ]}
          actions={[this.urlJump('/user/setting')]}
        />
        <List>
          {storedPks.map((i, idx) => {
            const { deviceInfo, pk, status, createdTime } = i;
            return (
              <DeviceCard
                key={idx}
                info={{
                  deviceInfo,
                  addTime: createdTime,
                  pk,
                }}
                superContext={this}
                isGoUnbind={false}
              />
            );
          })}
          {(!storedPks.length && (
            <div className="noStoredDevice">
              <M id="pkAddress.noStoredDevice" />
            </div>
          )) ||
            null}
        </List>
      </LayoutLR>
    );
  }
}

PkAddressNotActive.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').pkAddressNotActive.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(allActions, dispatch),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withRouter,
  withConnect
)(PkAddressNotActive);
