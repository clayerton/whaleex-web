import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Input, Tooltip, Icon, Spin, Checkbox, Modal } from 'antd';
import { preCondition } from 'whaleex/components/preconditions';
import { injectIntl } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
const defaultUserImg =
  _config.cdn_url + '/web-static/imgs/web/default-user.png';
const loginUserImg = _config.cdn_url + '/web-static/imgs/web/login-user.png';
import { FormattedNumber } from 'react-intl';
import Loading from 'whaleex/components/Loading';
import {
  AssetWrap,
  AssetSearch,
  AssetTotal,
  AssetTable,
  WalWrap,
  AssetContainer,
} from './style.js';
import './style.less';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { unitMap } from 'whaleex/utils/dollarMap';
import U from 'whaleex/utils/extends';
import * as allActions from './actions';
import * as ST from '../user/status.js';
import * as appActions from 'whaleex/common/actions.js';
import { InputWithClear } from 'whaleex/components';
import { getColumns, scrollX } from './columns.js';
import WalCard from './components/walCard.js';
import { DeveiceLimitModal } from 'whaleex/components/WalModal';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { chainModal } from 'whaleex/common/actionsChain.js';
import {
  UserItem,
  LeftItems,
  RightItems,
  UserConfig,
  UserConfigWrap,
} from '../user/style/style.js';
const Search = Input.Search;
const confirm = Modal.confirm;
import { M, LayoutLR, Switch, Table } from 'whaleex/components';
import Switch2 from 'whaleex/components/Switch';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const CheckboxGroup = Checkbox.Group;

let timer = undefined;
let timerUser = undefined;
let timerPkStatus = undefined;
export class Asset extends React.Component {
  constructor(props) {
    super(props);
    const storageHideSmall = localStorage.getItem('hideSmall');
    this.state = {
      filterSymbol: undefined,
      pagination: {
        current: 1,
        pageSize: 15,
        total: 0,
      },
      hideSmall:
        storageHideSmall === 'false' || !storageHideSmall ? false : true,
    };
  }
  componentDidMount() {
    const convertMap_digital = _.get(this.props, 'convertMap_digital');
    if (!!convertMap_digital) {
      this.pageInit(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const isEmpty = !_.get(nextProps, 'store.assetList');
    const convertMap_digital = _.get(nextProps, 'convertMap_digital');
    if (isEmpty && !!convertMap_digital) {
      this.pageInit(nextProps);
    }
  }
  componentWillUnmount() {
    clearTimeout(timer);
    clearTimeout(timerUser);
    clearTimeout(timerPkStatus);
  }

  getUserAssets = (props, state) => {
    const {
      convertMap_digital,
      legaldigital,
      userConfig: { legalTender, walPayEnable },
    } = props;
    const { hideSmall } = state || this.state;
    this.props.actions.getUserAsset(
      convertMap_digital,
      legaldigital,
      r => {
        this.props.actions.setUserData('withdrawNeedVerify', r);
      },
      !hideSmall
    );
  };
  pageInit = props => {
    const {
      convertMap_digital,
      legaldigital,
      userConfig: { legalTender, walPayEnable },
    } = props;
    const loop = () => {
      clearTimeout(timer);
      this.getUserAssets(props);
      timer = setTimeout(() => {
        !_config.stop_request_roll && loop();
      }, 10000);
    };
    loop();
    this.loopPkActionStatus(props);
    this.loopUser(props);
    this.setState({ checkedValues: [legalTender], checked: walPayEnable });
  };
  loopPkActionStatus = props => {
    clearTimeout(timerPkStatus);
    const { userUniqKey } = props;
    this.props.actions.pkActionStatus(undefined, r => {
      //0 bind 1UNBIND
      //pending_confirm success failure
      const {
        pkStatus: actionType,
        executing: actionStatus,
        eosAccount: actionAcount,
      } = r;
      this.setState({ actionType, actionStatus, actionAcount });
    });
    timerPkStatus = setTimeout(() => {
      !_config.stop_request_roll && this.loopPkActionStatus(props);
    }, 5000);
  };
  loopUser = props => {
    clearTimeout(timerUser);
    const { userConfig = {}, pks = [], allPks = [], pubKey, userPkStatus } =
      props || this.props;
    const { actionType, actionStatus, actionAcount } = this.state;
    const { idCardStatus } = userConfig;
    const localPkStatus = ST.getLocalPkStatus(
      {
        actionType,
        actionStatus,
        actionAcount,
      },
      allPks,
      pubKey,
      userPkStatus
    );
    const loopAskPkStatus = ['BINDING', 'UNBINDING', 'STORED'].includes(
      localPkStatus.cur
    );
    const needAuth = idCardStatus === 'UNBIND' || !idCardStatus;
    if (loopAskPkStatus || needAuth) {
      needAuth && this.props.actions.getUserConfig(); //身份审核
      loopAskPkStatus && this.props.actions.getUserPkStatus(pubKey); //pk status？
      timerUser = setTimeout(() => {
        !_config.stop_request_roll && this.loopUser();
      }, 5000);
    }
  };
  _setState = (key, value) => {
    localStorage.setItem('hideSmall', value);
    this.setState({ [key]: value });
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ pagination, filters, sorter });
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  mergeUserAsset = () => {};
  onChange = checkedValues => {
    const { checkedValues: _checkedValues } = this.state;
    const nextCheckedValues = _.xor(_checkedValues, checkedValues);
    this.props.actions.updateUserConfig(
      { legalTender: nextCheckedValues[0] },
      () => {}
    );
    this.setState({ checkedValues: nextCheckedValues });
  };
  goActive = async () => {
    _czc.push(['_trackEvent', '我的资产-绑定EOS账户', '点击']);
    const { pks = [], allPks = [], eosConfig, userUniqKey } = this.props;
    if (pks.length >= 10000) {
      //2018.12.30 俊晶 鹏鹏哥 等讨论后决定放开限制
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
      this.setState({ localPubkeyGenerating: true });
      const localKeys = await loadKeyDecryptData();
      //未激活的每次进入这里都会签名  调用bindPk
      const pk = await chainModal({
        userUniqKey,
        pks: allPks || [],
        eos: eosConfig,
        localKeys,
        userId: sessionStorage.getItem('userId'),
      });
      this.props.actions.loadPk();
      this.setState({ localPubkeyGenerating: false });
      this.urlJump('/usercenter/pkAddress/bind?from=asset')();
    }
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      intl: { formatMessage },
      currencyList = [],
      currencyListObj = {},
      store,
      legaldigital = '',
      legalTender = '',
      convertMap = {},
      convertMap_digital = {},
      app,
      pks = [],
    } = this.props;
    const { userConfig = {} } = app;
    const {
      phoneVerify,
      googleVerify,
      googleVerifyBound,
      emailVerify,
      email,
      idCardStatus,
      reason,
      name,
      idCard,
      portraitUrl,
    } = userConfig;
    const {
      hideSmall,
      pagination: _pagination,
      sorter = {},
      filterSymbol,
      checkedValues,
      actionType,
      actionStatus,
      actionAcount,
      localPubkeyGenerating,
    } = this.state;
    const statusEosAccount = ST.getEosAccountStatus(this.props, {
      actionType,
      actionStatus,
      actionAcount,
      pks,
    });
    const isAssetReady =
      U.isNotEmpty(this.props, ['store.assetList', 'store.wal']) &&
      _.get(this.props, 'app.userData.withdrawNeedVerify') !== undefined;
    let tmpAsstes = _.get(store, 'assetList.content', []);
    let assetList = U.mergeArray(tmpAsstes, currencyList, ['currencyId', 'id']);
    let totalAsset = _.get(store, 'totalAsset', {});
    const wal = _.get(store, 'wal', {});
    let walAsset = Object.assign({}, wal, currencyListObj.WAL);
    if (filterSymbol) {
      assetList = assetList.filter(({ shortName }) =>
        shortName.toUpperCase().includes(filterSymbol.toUpperCase())
      );
    }
    let pagination = { ..._pagination, total: assetList.length };
    let start = (pagination.current - 1) * pagination.pageSize;
    assetList = assetList.slice(start, start + pagination.pageSize);

    const filterWal = assetList.filter(({ shortName }) => shortName !== 'WAL');
    const listWal = assetList.filter(({ shortName }) => shortName === 'WAL');
    const topWalList = _.concat(listWal, filterWal).filter(
      ({ visible }) => visible
    );
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const inputStyle = { width: 420, height: 40 };
    const text = (
      <span className="title_tip">
        <M id="asset.titp" values={{ data: unitMap[legalTender] + '1' }} />
      </span>
    );
    const mineConfig = _.get(this.props, 'eosConfig.result.mineConfig');
    const walCardProps = {
      ...walAsset,
      unitMap,
      legalTender,
      totalAsset,
      convertMap,
      convertMap_digital,
      legaldigital,
      app,
      history,
      urlJump: this.urlJump,
      actions: this.props.actions,
      formatMessage,
      mineConfig,
    };
    const searchIcon = <Icon type="search" style={{ color: '#99acb6' }} />;
    const options = [
      { label: <M id="user.RMB" />, value: 'RMB' },
      { label: <M id="user.doll" />, value: 'DOLLAR' },
    ];

    const tabList = _.get(store, 'assetList.content');
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}
        backgroundShadow="hidden"
      >
        {(!_.isEmpty(userConfig) && (
          <UserConfigWrap>
            <UserConfig>
              <LeftItems>
                <div className="user-logo">
                  {(statusEosAccount.cur === 'NOTBIND' && (
                    <img src={portraitUrl || defaultUserImg} />
                  )) || <img src={portraitUrl || loginUserImg} />}
                </div>
                <div>
                  <UserItem>
                    <span className="item-key user-name">
                      <M id="user.eosAccount" />
                    </span>
                    <span className="item-value">
                      {(['FAILURE', 'NOTBIND'].includes(statusEosAccount.cur) &&
                        statusEosAccount.msg) ||
                        (idCardStatus === null && (
                          <span
                            className="url-style no-line"
                            onClick={() => {
                              this.urlJump('/usercenter/auth?type=1&sytep=1')();
                            }}
                          >
                            <M id="user.goAuthGetReward" />
                            <Icon type="right" />
                          </span>
                        )) ||
                        ''}
                    </span>
                  </UserItem>
                  <UserItem className="flex-between">
                    {(['FAILURE', 'NOTBIND'].includes(statusEosAccount.cur) && (
                      <span
                        className="url-style no-line"
                        onClick={this.goActive}
                      >
                        {(localPubkeyGenerating && <Loading inverse />) || null}
                        <M id="user.goBind" />
                        <Icon type="right" />
                      </span>
                    )) ||
                      statusEosAccount.msg}
                  </UserItem>
                </div>
              </LeftItems>
              <RightItems>
                <UserItem>
                  <span className="item-key">
                    <M id="user.fbdw" />
                  </span>
                  <span>
                    <CheckboxGroup
                      options={options}
                      value={checkedValues}
                      defaultValue={checkedValues}
                      onChange={this.onChange}
                    />
                  </span>
                </UserItem>
                <UserItem className="flex-end">
                  {/* <span>
                    <a onClick={this.urlJump('/usercenter/resetPass')}>
                      <M id="user.change" />
                    </a>
                  </span> */}
                </UserItem>
              </RightItems>
            </UserConfig>
          </UserConfigWrap>
        )) ||
          null}
        {(!isAssetReady && (
          <div className="spin-center">
            <Spin size="large" spinning={true} />
          </div>
        )) ||
          null}
        {(isAssetReady && (
          <AssetContainer key="AssetContainer">
            <AssetWrap>
              <AssetTotal>
                <span className="user-asset">
                  <M id="asset.total" />：
                  <span>
                    {U.symbolNumber(
                      totalAsset.amount,
                      _.get(currencyListObj, `${legaldigital}.precision`, 2)
                    )}{' '}
                    {totalAsset.shortName}
                  </span>
                </span>
                <span className="user-asset-convert">
                  ≈{unitMap[legalTender]}
                  {
                    <FormattedNumber
                      value={
                        totalAsset.amount *
                          convertMap_digital[legaldigital] *
                          convertMap['EOS'] || 0
                      }
                    />
                  }
                </span>
              </AssetTotal>
              <span
                className="url-style no-line"
                onClick={() => {
                  preCondition(
                    'depoWithList',
                    app,
                    history,
                    { superProps: this.props, actions: this.props.actions },
                    this.urlJump('/assetAction/depowith')
                  )();
                }}
              >
                <M id="asset.detail" />
              </span>
            </AssetWrap>
            {(!_.isEmpty(wal) && <WalCard {...walCardProps} />) || null}
            <AssetSearch>
              <div className="switch">
                {/* <Search
              placeholder={formatMessage({ id: 'warning.coinIput' })}
              onChange={e => {
                this._setState('filterSymbol', e.target.value);
              }}
              onSearch={this._setState.bind(null, 'filterSymbol')}
              style={{ width: 150 }}
            /> */}
                <InputWithClear
                  prefix={searchIcon}
                  placeholder={formatMessage({ id: 'warning.coinIput' })}
                  onChange={e => {
                    this._setState('filterSymbol', e.target.value);
                  }}
                  style={{ width: 150, marginRight: 50 }}
                  value={filterSymbol}
                  resetField={e => {
                    this._setState('filterSymbol', '');
                  }}
                />
                <div className="switch-right">
                  <Switch
                    className="switch-margin"
                    checked={hideSmall} ///hideSmall includeZero
                    onSwitch={checked => {
                      this._setState.bind(null, 'hideSmall')(checked);
                      this.getUserAssets(this.props, {
                        ...this.state,
                        hideSmall: checked,
                      });
                    }}
                    label={<M id="asset.hide" />}
                  />
                  <Tooltip placement="top" className="title_tip" title={text}>
                    <i className="iconfont icon-ArtboardCopy7" />
                  </Tooltip>
                </div>
              </div>
            </AssetSearch>
            <AssetTable>
              <Table
                columns={getColumns(this, sorter)}
                dataSource={topWalList}
                onChange={this.handleTableChange}
                pagination={{ ...pagination, hideOnSinglePage: true }}
                sorter={sorter}
                urlJump={this.urlJump}
              />
            </AssetTable>
          </AssetContainer>
        )) ||
          null}
      </LayoutLR>
    );
  }
}

Asset.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return { ...state.get('pages').asset.toJS(), app: state.get('app') };
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, appActions),
    dispatch
  ),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Asset)
);
