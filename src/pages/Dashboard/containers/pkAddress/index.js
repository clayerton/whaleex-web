import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import U from 'whaleex/utils/extends';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Breadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { M, LayoutLR } from 'whaleex/components';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { chainModal } from 'whaleex/common/actionsChain.js';
import _ from 'lodash';
import {
  AddressBind,
  AddressBinding,
  AddressList,
  AddressUnbind,
  AddressBindHistory,
} from './components';
import * as allActions from './actions';
import { loadPk } from 'whaleex/common/actions.js';
import { AddressManageWrap } from './style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const steps = ['BIND', 'LIST', 'UNBIND', 'HISTORY'];
export class PkAddress extends React.Component {
  constructor(props) {
    super(props);
    const pks = _.get(props, 'pks');
    const urlPageStatus = _.get(props, 'match.params.step');
    if (urlPageStatus) {
      this.state = { pks, pageStatus: urlPageStatus.toUpperCase() };
    } else if (pks === undefined) {
      this.state = {};
    } else {
      const { pubKey } = props;
      const pageStatus = this.getPageStatus(pks, pubKey);
      this.state = { pks, pageStatus };
    }
  }
  componentDidMount() {
    const { pubKey } = this.props;
    const userPk = _.get(this.props, 'match.params.pk');
    const urlPageStatus = _
      .get(this.props, 'match.params.step', '')
      .toUpperCase();
    this.props.actions.getUserPKs(
      this.urlJump,
      urlPageStatus,
      userPk || pubKey
    );
    this.props.actions.getWallets();
    if (U.getSearch('force') === 'true') {
      this.generatePk();
    }
  }
  componentWillUnmount() {
    clearTimeout(window.scatterTimer);
  }
  generatePk = async () => {
    const { userUniqKey, allPks, eosConfig } = this.props;
    const localKeys = await loadKeyDecryptData();
    const pk = await chainModal({
      userUniqKey,
      pks: allPks || [],
      eos: eosConfig,
      localKeys,
      userId: sessionStorage.getItem('userId'),
    });
    this.props.actions.loadPk();
    this.setState({ _pubKey: pk });
  };
  // componentWillReceiveProps(nextProps) {
  //   const isChanged = U.isObjDiff(
  //     [nextProps, this.props],
  //     ['store.pks', 'pubKey']
  //   );
  //   if (isChanged) {
  //     this.initPage(nextProps);
  //   }
  // }
  initPage = props => {
    const { pks } = props.store;
    const { pubKey } = props;
    const pageStatus = this.getPageStatus(pks, pubKey);
    this.setState({ pks, pageStatus });
  };
  getPageStatus = (pks, pubKey) => {
    return (pks.some(({ pk }) => pk === pubKey) && 'LIST') || 'BIND';
  };
  nextStep = (nextData, step = 1) => {
    const { pageStatus } = this.state;
    const _step = steps.indexOf(pageStatus) + step;
    this.setState({
      pageStatus: steps[_step],
      nextData,
    });
  };
  urlJump = path => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  goStep = (nextData, step) => {
    this.setState({
      pageStatus: steps[step],
      nextData,
    });
  };
  getBindHistory = () => {
    this.props.actions.getBindHistory();
  };
  render() {
    let {
      history,
      match,
      baseRoute,
      prefix,
      eosAccount,
      currencyListObj,
      store: { bindHistory = [], pks, wallets = [] },
      pubKey,
    } = this.props;
    const { _pubKey } = this.state;
    const userPk = _.get(this.props, 'match.params.pk');
    const { pageStatus, nextData } = this.state;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    let data = {
      ...this.props,
      eosAccount,
      pageStatus:
        ((!pageStatus ||
          _.isEmpty(this.props.currencyListObj) ||
          eosAccount === undefined ||
          pks === undefined ||
          (pubKey === undefined && !userPk)) &&
          'LOADING') ||
        pageStatus,
      nextStep: this.nextStep,
      urlJump: this.urlJump,
      goStep: this.goStep,
      depositAddress: _.get(currencyListObj, 'EOS.depositAddress'),
      pks,
      nextData,
    };
    if (userPk && pageStatus === 'BIND') {
      data.pubKey = userPk;
    }
    if (_pubKey && !pubKey) {
      data.pubKey = _pubKey;
      data.pageStatus = 'BIND';
    }
    //来自于哪个页面 有一个路由的特殊处理
    const pageFrom = U.getSearch('from');
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath={(pageFrom === 'asset' && '/user') || '/user/setting'}
        history={history}
        match={match}>
        <AddressManageWrap>
          {(data.pageStatus === 'LOADING' && (
            <div className="spin-center height-auto">
              <Spin size="large" spinning={true} />
            </div>
          )) ||
            null}
          {(data.pageStatus === 'BIND' && <AddressBind {...data} />) || null}
          {(data.pageStatus === 'LIST' && <AddressList {...data} />) || null}
          {(data.pageStatus === 'UNBIND' && <AddressUnbind {...data} />) ||
            null}
          {(data.pageStatus === 'HISTORY' && (
            <AddressBindHistory
              {...data}
              getBindHistory={this.getBindHistory}
              bindHistory={bindHistory}
            />
          )) ||
            null}
        </AddressManageWrap>
      </LayoutLR>
    );
  }
}

PkAddress.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').pkAddress.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...allActions, loadPk }, dispatch),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withRouter,
  withConnect
)(PkAddress);
