import React from 'react';
import M from 'whaleex/components/FormattedMessage'; //step-2
import { Icon } from 'antd';
import Loading from 'whaleex/components/Loading';
import { ResultWrap } from './style.js';
export default class Confirming extends React.Component {
  render() {
    const {
      userActionType,
      actionType,
      actionStatus,
      actionAcount,
      deviceInfo,
    } = this.props;
    return (
      <ResultWrap className="confirming">
        <Loading
          img={_config.cdn_url + '/web-static/imgs/web/system/loading.png'}
        />
        {(userActionType === 'bind' && (
          <M
            id="wallet.binding"
            values={{ account: actionAcount }}
            richFormat
          />
        )) ||
          null}
        {(userActionType === 'active' && (
          <M id="wallet.active" values={{ device: deviceInfo }} richFormat />
        )) ||
          null}
        {(userActionType === 'unbind' && (
          <M id="wallet.unbinding" values={{ device: deviceInfo }} richFormat />
        )) ||
          null}
      </ResultWrap>
    );
  }
}
