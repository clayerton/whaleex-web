import { M } from 'whaleex/components';
import React from 'react';
import PropTypes from 'prop-types';

import { Icon, message, Tooltip, Modal } from 'antd';
import QRCode from 'qrcode';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { getDeviceInfo } from 'whaleex/utils/device.js';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { DeepBreadcrumb } from 'whaleex/components';
import { Step, Item, CopySuccess } from './style.js';
import WalletModal from 'whaleex/components/WalModal/WalletModal/WalletModal.js';
import { injectIntl } from 'react-intl';
import { loadScatter } from 'whaleex/components/WalScatter';
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
class AddressUnbind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const eosAccount = _.get(this.props, 'eosAccount.eosAccount');
    const {
      pubKey,
      intl: { formatMessage },
    } = this.props;
    const exEosAccount = _.get(this.props, 'eosConfig.result');
    const memo =
      (pubKey && `unbind:${pubKey}:${exEosAccount.exEosAccountAlias}`) || '';
    const depositAddress = this.props.currencyListObj.EOS.depositAddress;
    loadScatter(
      {
        withConfirm: true,
        eosAccount,
        depositAddress,
        memo,
        actionType: 'UNBIND',
        formatMessage,
      },
      () => {
        this.setState({ scatterShow: true });
      }
    );
    this.initPage();
  }
  initPage = async () => {
    const depositAddress = this.props.currencyListObj.EOS.depositAddress;
    QRCode.toDataURL(depositAddress).then(r => {
      this.setState({ qrcode: r, depositAddress });
    });
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  onCopy = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    message.success(formatMessage({ id: 'pkAddress.copysuccess' }));
  };
  splitStr = (address = '') => {
    return (
      <span>
        <span className="font2-1">{address.slice(0, 7)}</span>
        {address.slice(7)}
      </span>
    );
  };
  tooltipVisible = visible => {
    this.setState({ visible });
    setTimeout(() => {
      this.setState({ workaround: Date.now() });
    }, 10);
  };
  goWalletAction = ({
    actionType,
    eosAccount,
    depositAddress,
    amount,
    currency,
    memo,
    pubKey,
    desc,
    deviceInfo,
  }) => {
    const confirmModal = confirm({
      content: (
        <WalletModal
          onCancel={noMoreLoginError => {
            confirmModal.destroy();
          }}
          onOk={noMoreLoginError => {
            _czc.push(['_trackEvent', '使用手机钱包扫码（弹窗）', '点击']);
            confirmModal.destroy();
            // history.push([BASE_ROUTE, prefix, '/login'].join(''));
          }}
          urlJump={this.urlJump}
          data={{
            actionType,
            eosAccount,
            depositAddress,
            amount,
            currency,
            memo,
            pubKey,
            desc,
            deviceInfo,
            wallets: _.get(this.props, 'store.wallets', []),
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
      intl: { formatMessage },
      store,
    } = this.props;
    const allpks = store.pks.concat(store.pksNotActive);
    const { qrcode, depositAddress, scatterShow } = this.state;
    const { nextData, pubKey, pks } = this.props;
    const userPk = _.get(this.props, 'match.params.pk');
    // const userPk = _.get(nextData, 'pk');
    const exEosAccount = _.get(this.props, 'eosConfig.result');
    const pubkeyWrap =
      (userPk && `unbind:${userPk}:${exEosAccount.exEosAccountAlias}`) || '';
    const eosAccount = _.get(this.props, 'eosAccount.eosAccount');

    const myDevice = _.find(allpks, { pk: userPk });
    const { deviceInfo } = myDevice || {};
    const myDeviceInfo = deviceInfo || getDeviceInfo();
    return (
      <div>
        <DeepBreadcrumb
          arr={[<M id="pkAddress.user" />, <M id="pkAddress.unActive" />]}
          actions={[this.props.urlJump.bind(null, '/user/setting')]}
          extend={
            <span
              onClick={this.props.nextStep.bind(
                null,
                { pageFrom: 'history' },
                1
              )}>
              <M id="pkAddress.zchistory" />
            </span>
          }
        />
        <Step className="AddressUnbind">
          <Item>
            <label />
            <p className="prompt">
              {(eosAccount && (
                <M
                  id="pkAddress.topalert2"
                  values={{ eosAccount, deviceInfo: myDeviceInfo }}
                />
              )) || <M id="pkAddress.zyts2" />}
            </p>
          </Item>
          <Item>
            <label>
              <M id="deposit.out" />
            </label>
            <div className="item-grey">{eosAccount}</div>
          </Item>
          <Item>
            <label>
              <M id="deposit.enter" />
            </label>
            <div className="item-grey">
              <span className="font2">{this.splitStr(depositAddress)}</span>
              <CopyToClipboard
                text={depositAddress}
                className="copy font3"
                onCopy={this.onCopy}>
                <span className="font3">
                  <M id="deposit.copyadress" />
                </span>
              </CopyToClipboard>
              {/* <Tooltip
                placement="top"
                overlayClassName="deposit-tooltip"
                visible={this.state.visible}
                onVisibleChange={this.tooltipVisible}
                title={
                  <div>
                    <img src={qrcode} width="100px" />
                  </div>
                }>
                <span className="font4">
                  {formatMessage({ id: 'deposit.code' })}
                </span>
              </Tooltip> */}
            </div>
          </Item>
          <Item>
            <label>
              <M id="deposit.amount" />
            </label>
            <div className="item-grey">
              0.0001EOS
              <span className=" gery">
                （<M id="deposit.amountTips" />）
              </span>
            </div>
          </Item>
          <Item>
            <label>
              <M id="deposit.remarks" />
            </label>
            <div className="item-grey">
              <span className="inside">{pubkeyWrap}</span>
              <CopyToClipboard
                text={pubkeyWrap}
                className="copy font2"
                onCopy={this.onCopy}>
                <span className="font3">
                  <M id="deposit.copyadress" />
                </span>
              </CopyToClipboard>
            </div>
          </Item>
          <Item
            style={{
              marginBottom: 0,
            }}>
            <label />
            <p className="text-align-right">
              <span
                className="url-style"
                onClick={() => {
                  _czc.push([
                    '_trackEvent',
                    'EOS账户绑定-使用手机钱包扫码',
                    '点击',
                  ]);
                  this.goWalletAction({
                    actionType: 'unbind',
                    eosAccount,
                    depositAddress,
                    amount: '0.0001',
                    currency: 'EOS',
                    memo: pubkeyWrap,
                    pubKey,
                    deviceInfo: myDeviceInfo,
                    desc: formatMessage({ id: 'wallet.goUnbind' }),
                  });
                }}>
                <M id="wallet.goUnbind" />
                <Icon type="right" />
              </span>
            </p>
          </Item>
          <Item
            style={{
              marginTop: 0,
            }}>
            <label />
            {(scatterShow && (
              <p className="text-align-right">
                <span
                  className="url-style"
                  onClick={() => {
                    _czc.push([
                      '_trackEvent',
                      'EOS账户绑定-使用Scatter账号进行解绑设置',
                      '点击',
                    ]);
                    loadScatter({
                      withConfirm: false,
                      eosAccount,
                      depositAddress,
                      memo: pubkeyWrap,
                      actionType: 'UNBIND',
                      formatMessage,
                    });
                  }}>
                  <M id="scatter.goUnbind" /> <Icon type="right" />
                </span>
              </p>
            )) ||
              null}
          </Item>
          <Item>
            <label />
            <div>
              <div className="message">
                <M id="deposit.tips" />
                <br />
                <M id="pkAddress.unbindtext1" />
              </div>
            </div>
          </Item>
        </Step>
      </div>
    );
  }
}

AddressUnbind.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(AddressUnbind);
