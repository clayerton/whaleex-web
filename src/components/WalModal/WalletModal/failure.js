import React from 'react';
import M from 'whaleex/components/FormattedMessage'; //step-2
import { Icon } from 'antd';
import { ResultWrap } from './style.js';
export default class Success extends React.Component {
  render() {
    const {
      userActionType,
      actionType,
      actionStatus,
      deviceInfo,
      actionAcount,
    } = this.props;
    return (
      <ResultWrap className="failure">
        <i className="iconfont icon-kyc_icon_failure" />
        {(userActionType === 'bind' && (
          <M id="wallet.bindingF" values={{ account: actionAcount }} />
        )) ||
          null}
        {(userActionType === 'active' && (
          <M id="wallet.activeF" values={{ device: deviceInfo }} />
        )) ||
          null}
        {(userActionType === 'unbind' && (
          <M id="wallet.unbindingF" values={{ device: deviceInfo }} />
        )) ||
          null}
      </ResultWrap>
    );
  }
}
