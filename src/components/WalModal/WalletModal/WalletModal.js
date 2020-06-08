import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import QRCode from 'qrcode';
import { Icon, Tooltip } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from '../style.js';
import { MainWrap, LogoList } from './style.js';
import { pkActionStatus } from 'whaleex/common/actions.js';
import Confirming from './confirming.js';
import Success from './success.js';
import U from 'whaleex/utils/extends';
import Failure from './failure.js';
import * as ST from 'whaleex/pages/Dashboard/containers/user/status.js';

let timer = undefined;
let timer2 = undefined;
export default class WalletModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { remainTime: 1, chainStatus: undefined };
  }
  componentDidMount() {
    this.generateQrcode();
  }
  componentWillUnmount() {
    clearTimeout(timer);
    clearTimeout(timer2);
  }
  generateQrcode = () => {
    const { data = {} } = this.props;
    const targetTime = +new Date() + 5 * 60 * 1000;
    const {
      actionType,
      eosAccount,
      depositAddress,
      amount,
      currency,
      memo,
      desc,
    } = data;
    let params = {
      protocol: 'SimpleWallet',
      version: '1.0',
      dappName: 'WhaleEX',
      dappIcon: _config.static_url + '/imgs/logo2.png',
      action: 'transfer',
      from: eosAccount,
      to: depositAddress,
      amount,
      dappData: memo,
      // contract: 'theeosbutton',
      // symbol: 'EBT',
      contract: 'eosio.token',
      symbol: 'EOS',
      precision: '4',
      desc,
      expired: targetTime,
    };
    if (!params.from) {
      delete params.from;
    }
    QRCode.toDataURL(JSON.stringify(params), {
      width: 250,
    }).then(r => {
      this.setState({ qrcode: r, targetTime, remainTime: 1 });
      this.loop();
      this.overTimeLoop();
    });
  };
  overTimeLoop = () => {
    clearTimeout(timer2);
    const { targetTime, remainTime } = this.state;
    let _remainTime = Math.max(targetTime - Date.now(), 0);
    if (remainTime > 0) {
      this.setState({ remainTime: _remainTime });
    }
    timer2 = setTimeout(this.overTimeLoop, 1000);
  };
  loop = () => {
    clearTimeout(timer);
    const { data = {} } = this.props;
    const { memo } = data;
    pkActionStatus(memo.split(':')[1], r => {
      //0 bind 1UNBIND
      //pending_confirm success failure
      const {
        pkStatus: actionType,
        executing: actionStatus,
        eosAccount: actionAcount,
      } = r;

      let { cur: _chainStatus } = ST.getLocalPkStatus({
        actionType,
        actionStatus,
        actionAcount,
      });
      const { chainStatus } = this.state;
      console.log('wallet bind', chainStatus, _chainStatus);
      if (
        (chainStatus &&
          chainStatus !== 'ACTIVED' &&
          _chainStatus === 'ACTIVED') ||
        (chainStatus === 'UNBINDING' && _chainStatus === 'STORED')
      ) {
        _chainStatus = 'SUCCESS';
        setTimeout(() => {
          this.props.onCancel();
          this.props.urlJump('/user/setting')();
        }, 2000);
      }
      this.setState({
        actionType,
        actionStatus,
        chainStatus: _chainStatus,
        actionAcount,
      });
    })();
    timer = setTimeout(this.loop, 5000);
  };
  render() {
    const { onCancel, onOk, data = {} } = this.props;
    const { actionType: userActionType, deviceInfo, wallets } = data;
    const walletList = wallets.map(i => {
      const { content, downloadUrl, icon, id, name } = i;
      return {
        name,
        logo: icon,
        tip: content,
        download: downloadUrl,
      };
    });
    let {
      qrcode,
      actionType,
      actionStatus,
      remainTime,
      chainStatus,
      actionAcount,
    } = this.state;
    const lan = U.getUserLan(); //step-4 取当前语言
    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="WalletModal">
          <Icon type="close" onClick={onCancel} className="close-btn" />
          <div className="content">
            {(!chainStatus ||
              ['STORED', 'ACTIVED', 'UNBIND'].includes(chainStatus)) && (
              <h2>
                <M id="wallet.title" />
              </h2>
            )}
            {['BINDING', 'UNBINDING'].includes(chainStatus) && (
              <Confirming
                userActionType={userActionType}
                actionType={actionType}
                actionStatus={actionStatus}
                actionAcount={actionAcount}
                deviceInfo={deviceInfo}
              />
            )}
            {['SUCCESS'].includes(chainStatus) && (
              <Success
                userActionType={userActionType}
                actionType={actionType}
                actionStatus={actionStatus}
                actionAcount={actionAcount}
                deviceInfo={deviceInfo}
              />
            )}
            {chainStatus === 'FAILURE' && (
              <Failure
                userActionType={userActionType}
                actionType={actionType}
                actionStatus={actionStatus}
                actionAcount={actionAcount}
                deviceInfo={deviceInfo}
              />
            )}
            {(!chainStatus ||
              ['STORED', 'ACTIVED', 'UNBIND'].includes(chainStatus)) && (
              <MainWrap className="padding">
                <div className="qrcode-wrap">
                  {(remainTime <= 0 && (
                    <div
                      className="overtime-wrap"
                      onClick={this.generateQrcode}
                    >
                      <Icon type="sync" />
                      <M id="wallet.overtime" richFormat />
                    </div>
                  )) ||
                    null}
                  <img src={qrcode} width={180} />
                </div>
                <LogoList>
                  {walletList.map(({ name, logo, tip, download }, idx) => {
                    const tipText = (
                      <div style={{ padding: '10px 20px 0' }}>
                        <p>
                          <M id="wallet.version" values={{ version: tip }} />
                        </p>
                        <p>
                          <a href={download} target="_blank">
                            <M id="wallet.download" values={{ wallet: name }} />
                          </a>
                        </p>
                      </div>
                    );
                    return (
                      <div className="wallet-logo" key={idx}>
                        <Tooltip placement="bottom" title={tipText}>
                          <img src={logo} />
                        </Tooltip>
                      </div>
                    );
                  })}
                </LogoList>
                <div className="sub-text">
                  {(userActionType === 'unbind' && (
                    <M id="wallet.walletListUnbind" richFormat />
                  )) || <M id="wallet.walletList" richFormat />}
                </div>
              </MainWrap>
            )}
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
