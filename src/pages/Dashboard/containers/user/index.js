import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import Loading from 'whaleex/components/Loading';
import { preCondition } from 'whaleex/components/preconditions';
import {
  Icon,
  Switch,
  Checkbox,
  message,
  Modal,
  notification,
  Spin,
} from 'antd';
import { getDeviceInfo } from 'whaleex/utils/device.js';
import { LayoutLR, M, Table, CodeModal, DeviceCard } from 'whaleex/components';
import { injectIntl } from 'react-intl';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import U from 'whaleex/utils/extends';
import styled from 'styled-components';
import * as ST from './status.js';
import {
  UserItem,
  LeftItems,
  RightItems,
  UserConfig,
  UserConfigWrap,
  StyledAlert,
  AlertWrap,
  Item,
  StatusMsg,
} from './style/style.js';
import {
  AuthWrap,
  Title,
  AuthItem,
  ItemDetail,
  ItemValue,
  ItemSwitch,
} from './style/authStyle.js';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { chainModal } from 'whaleex/common/actionsChain.js';
import { confirmPhoneToggleFunc, confirmGoogleToggleFunc } from './extends.js';
import { StyledButton } from '../../style.js';
import {
  updateUserConfig,
  confirmPhoneToggle,
  confirmGoogleToggle,
  sendCode,
  getUserConfig,
  getUserPkStatus,
  pkActionStatus,
  loadPk,
  getStakeFor,
} from 'whaleex/common/actions';
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
import { GoUnbindModal, DeveiceLimitModal } from 'whaleex/components/WalModal';

const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let timer = undefined;
let timerPkStatus = undefined;
const userAuthMap = {
  AUDITING: (
    <StatusMsg className="not-active">
      <Icon type="exclamation-circle" />
      <M id="user.authing" />
    </StatusMsg>
  ),
  DEFAULT: (
    <StatusMsg className="not-active">
      <Icon type="exclamation-circle" />
      <M id="user.notAuth" />
    </StatusMsg>
  ),
  AUDITFAILED: (
    <StatusMsg className="not-active">
      <Icon type="exclamation-circle" />
      <M id="user.authFail" />
    </StatusMsg>
  ),
};
const userAuthResult = {
  DEFAULT: <M id="user.goAuth" />,
  AUDITFAILED: <M id="user.reAuth" />,
};
export class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      checkedValues: [],
    };
  }
  componentDidMount() {
    if (this.props.userConfig) {
      this.props.loadPk();
      this.props.getUserConfig();
      this.loop();
      this.loopPkActionStatus(this.props);
      this.initPage(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const isChanged = U.isObjDiff([nextProps, this.props], ['userConfig']);
    if (isChanged) {
      if (!_.isEmpty(nextProps.userConfig)) {
        this.loop(nextProps);
        this.loopPkActionStatus(nextProps);
      }
      this.initPage(nextProps);
    }
  }
  componentWillUnmount() {
    clearTimeout(timer);
    clearTimeout(timerPkStatus);
  }
  initPage = props => {
    const {
      userConfig: { legalTender, walPayEnable },
    } = props;

    this.setState({ checkedValues: [legalTender], checked: walPayEnable });
  };
  loopPkActionStatus = props => {
    clearTimeout(timerPkStatus);
    const { userUniqKey } = props;
    this.props.pkActionStatus(undefined, r => {
      // BIND STORED UNBIND
      // true false
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
  loop = props => {
    clearTimeout(timer);
    const { userConfig = {}, pks = [], allPks = [], pubKey, userPkStatus } =
      props || this.props;
    const { actionType, actionStatus, actionAcount } = this.state;
    const { idCardStatus } = userConfig;
    this.props.getStakeFor();
    //pubkey-delay
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
    const needAuth = ['UNBIND', 'AUDITING'].includes(idCardStatus);
    if (loopAskPkStatus || needAuth) {
      needAuth && this.props.getUserConfig(); //身份审核
      loopAskPkStatus && this.props.getUserPkStatus(pubKey); //pk status？
      timer = setTimeout(() => {
        !_config.stop_request_roll && this.loop();
      }, 5000);
    }
  };
  onChange = checkedValues => {
    const { checkedValues: _checkedValues } = this.state;
    const nextCheckedValues = _.xor(_checkedValues, checkedValues);
    this.props.updateUserConfig(
      { legalTender: nextCheckedValues[0] },
      () => {}
    );
    this.setState({ checkedValues: nextCheckedValues });
  };
  onSwitchChange = checked => {
    this.setState({ checked });
    this.props.updateUserConfig({ walPayEnable: checked }, () => {});
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  confirmPhoneToggle = enable => () => {
    confirmPhoneToggleFunc(enable, this.props);
  };
  confirmGoogleToggle = enable => () => {
    confirmGoogleToggleFunc(enable, this.props);
  };
  goActive = async (pk, suffix = '') => {
    const { pks = [], allPks = [], eosConfig, userUniqKey } = this.props;
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
      this.setState({ [`localPubkeyGenerating${suffix}`]: true });
      const localKeys = await loadKeyDecryptData();
      //未激活的每次进入这里都会签名  调用bindPk
      const pk = await chainModal({
        userUniqKey,
        pks: allPks || [],
        eos: eosConfig,
        localKeys,
        userId: sessionStorage.getItem('userId'),
      });
      this.props.loadPk();
      this.setState({ [`localPubkeyGenerating${suffix}`]: false });
      this.urlJump('/usercenter/pkAddress/bind')();
    }
  };

  //解绑弹窗
  goUnbind = pk => {
    const { pubKey } = this.props;
    if (pubKey === pk) {
      const confirmModal = confirm({
        content: (
          <GoUnbindModal
            onCancel={() => {
              confirmModal.destroy();
            }}
            onOk={() => {
              this.urlJump('/usercenter/pkAddress/unbind/' + pk)();
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
      this.urlJump('/usercenter/pkAddress/unbind/' + pk)();
    }
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      userConfig = {},
      eosAccount,
      userPkStatus,
      pks = [],
      allPks = [],
      pubKey,
      currentStakeFor,
    } = this.props;
    const {
      actionType,
      actionStatus,
      actionAcount,
      localPubkeyGenerating,
      localPubkeyGeneratingcard,
    } = this.state;
    const pksFilter = allPks.filter(({ pk }) => pk === pubKey);
    const pksOthers = pks.filter(({ pk }) => pk !== pubKey);
    // 本机是否被激活
    const statusEosAccount = ST.getEosAccountStatus(this.props, {
      actionType,
      actionStatus,
      actionAcount,
      pks,
    });

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
    const { checkedValues, checked } = this.state;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const options = [
      { label: <M id="user.RMB" />, value: 'RMB' },
      { label: <M id="user.doll" />, value: 'DOLLAR' },
    ];
    // console.log(actionType, actionStatus, localPkStatus.cur);
    let {
      phoneVerify,
      googleVerify,
      googleVerifyBound,
      emailVerify,
      email,
      idCardStatus,
      reason,
      name,
      idCard,
    } = userConfig;
    idCard = idCard || '';
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}
        backgroundShadow="hidden"
      >
        {((_.isEmpty(userConfig) || eosAccount === undefined) && (
          <div className="spin-center">
            <div className="spin-center height-auto">
              <Spin size="large" spinning={true} />
            </div>
          </div>
        )) ||
          null}
        {(!_.isEmpty(userConfig) && eosAccount !== undefined && (
          <AuthWrap>
            <Title>
              <span style={{ lineHeight: '32px' }}>
                <M id="user.change" />
              </span>
              <div className="right">
                <StyledButton
                  type="primary"
                  onClick={this.urlJump('/usercenter/resetPass')}
                >
                  <M id="user.goChange" />
                </StyledButton>
              </div>
            </Title>
            <Title>
              <span>
                <M id="user.sec" />
              </span>
              <span>{/* <M id="user.sug" /> */}</span>
            </Title>
            <AuthItem>
              <ItemDetail>
                <div className="icon">
                  <i className="iconfont icon-shenfenrenzheng1" />
                </div>
                <ItemValue>
                  <div>
                    <span className="key">
                      <M id="user.userAuth" />
                    </span>
                    {userAuthMap[idCardStatus || 'DEFAULT']}
                  </div>
                  <div>
                    {(idCardStatus === 'AUDITFAILED' && (
                      <span style={{ color: '#f27762' }}>
                        {_.uniq(reason).join(', ')}
                      </span>
                    )) || <M id="user.forSafe" />}
                  </div>
                </ItemValue>
              </ItemDetail>
              <ItemSwitch>
                {(idCardStatus !== 'AUDITING' &&
                  ((idCardStatus === 'AUDITSUCCESS' && (
                    <div className="audit-result">
                      <div>
                        <M id="user.idCard" />:{' '}
                        {idCard.slice(0, 2) +
                          (function() {
                            return _.fill(
                              Array(
                                idCard.length - 4 > 0 ? idCard.length - 4 : 2
                              ),
                              '*'
                            ).join('');
                          })() +
                          idCard.slice(-2)}
                      </div>
                      <div>
                        <M id="user.name" />: {name}
                      </div>
                    </div>
                  )) || (
                    <StyledButton
                      id="kyc"
                      type="primary"
                      onClick={() => {
                        _czc.push(['_trackEvent', '身份认证-去认证', '点击']);
                        this.urlJump('/usercenter/auth?type=1&sytep=1')();
                      }}
                    >
                      {userAuthResult[idCardStatus || 'DEFAULT']}
                    </StyledButton>
                  ))) ||
                  null}
              </ItemSwitch>
            </AuthItem>
            <AuthItem>
              <ItemDetail>
                <div className="icon">
                  <i className="iconfont icon-icon_setting_cpu_web" />
                </div>
                <ItemValue>
                  <div>
                    <span className="key">
                      <M id="cpuRent.stakeFor" />
                    </span>
                  </div>
                  <div>
                    <M id="cpuRent.stakeForDetail" />
                  </div>
                </ItemValue>
              </ItemDetail>
              <ItemSwitch>
                {(currentStakeFor && (
                  <span
                    className="cpu-set-item"
                    onClick={() => {
                      preCondition(
                        'cpuSet',
                        this.props,
                        history,
                        { superProps: this.props, actions: this.props.actions },
                        this.urlJump('/stakeFor')
                      )();
                    }}
                  >
                    <M
                      id="orderInput.currentStakeFor"
                      values={{ account: currentStakeFor }}
                    />{' '}
                    <Icon type="right" />
                  </span>
                )) || (
                    <StyledButton
                      id="cpuSet"
                      type="primary"
                      onClick={() => {
                        preCondition(
                          'cpuSet',
                          this.props.app,
                          history,
                          {
                            superProps: this.props,
                            actions: this.props.actions,
                          },
                          this.urlJump('/stakeFor')
                        )();
                      }}
                    >
                      <M id="user.goChange" />
                    </StyledButton>
                  ) ||
                  null}
              </ItemSwitch>
            </AuthItem>
            <AuthItem>
              <ItemDetail>
                <div className="icon">
                  <i className="iconfont icon-mycenter_shebeiguanl" />
                </div>
                <ItemValue>
                  <div>
                    <span className="key">
                      <M id="user.device" />
                    </span>
                    {localPkStatus.msg}
                  </div>
                  <div>
                    <M id="user.forSafe" />
                  </div>
                </ItemValue>
              </ItemDetail>
              <ItemSwitch>
                {(['STORED', 'UNBIND'].includes(localPkStatus.cur) && (
                  <StyledButton
                    disabled={localPubkeyGenerating}
                    type="primary"
                    onClick={this.goActive}
                  >
                    {(localPubkeyGenerating && <Loading />) || null}
                    <M id="user.goActive" />
                  </StyledButton>
                )) || (
                  <span
                    className="url-style"
                    onClick={this.urlJump('/usercenter/pkAddress/history')}
                  >
                    <M id="pkAddress.zchistory" />
                  </span>
                )}
              </ItemSwitch>
            </AuthItem>
            {(statusEosAccount.cur === 'BINDED' && (
              <AuthItem className="inside">
                <Item>
                  <span className="userTips">
                    <M id="pkAddress.userTips" />
                  </span>
                </Item>
                <Item>
                  <div className="section-title">
                    <M id="pkAddress.localDevice" />
                  </div>
                  <div>
                    {(pksFilter.length > 0 &&
                      ['UNBINDING', 'ACTIVED'].includes(localPkStatus.cur) &&
                      pksFilter.map((i, idx) => {
                        const { deviceInfo, pk, status, createdTime } = i;
                        return (
                          <DeviceCard
                            key={idx}
                            tag={{
                              label: <M id="pkAddress.this" />,
                            }}
                            info={{
                              deviceInfo,
                              createdTime,
                              pk,
                            }}
                            superContext={this}
                          />
                        );
                      })) || (
                      <DeviceCard
                        tag={{
                          label: <M id="pkAddress.notActive" />,
                          color: '#f27762',
                        }}
                        info={{
                          deviceInfo: getDeviceInfo(),
                          loginTime: +new Date(),
                          pk: pubKey,
                        }}
                        superContext={this}
                        isGoUnbind={false}
                      />
                    )}
                  </div>
                </Item>
                <Item>
                  <div className="section-title">
                    {(!_.isEmpty(pksOthers) && <M id="pkAddress.active" />) ||
                      null}
                    <span
                      className="url-style"
                      onClick={this.urlJump('/usercenter/pkAddressNotActive')}
                    >
                      <M id="pkAddress.notActiveDevice" />
                    </span>
                  </div>
                  {(!_.isEmpty(pksOthers) && (
                    <div>
                      {pksOthers.map((i, idx) => {
                        const { deviceInfo, pk, status, createdTime } = i;
                        return (
                          <DeviceCard
                            key={idx}
                            info={{
                              deviceInfo,
                              createdTime,
                              pk,
                            }}
                            superContext={this}
                          />
                        );
                      })}
                    </div>
                  )) ||
                    null}
                </Item>
              </AuthItem>
            )) ||
              null}
            <div />
          </AuthWrap>
        )) ||
          null}
      </LayoutLR>
    );
  }
}

User.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return { ...state.get('app'), app: state.get('app') };
}

export const mapDispatchToProps = {
  updateUserConfig,
  confirmPhoneToggle,
  confirmGoogleToggle,
  sendCode,
  getUserConfig,
  pkActionStatus,
  getUserPkStatus,
  loadPk,
  getStakeFor,
};

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(User)
);
