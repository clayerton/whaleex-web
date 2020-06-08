import { M } from 'whaleex/components';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, message, Spin, Tooltip, Modal } from 'antd';
import QRCode from 'qrcode';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { Step, Wrap, Item, CopySuccess } from './style.js';
import U from 'whaleex/utils/extends';
import { getDeviceInfo } from 'whaleex/utils/device.js';
import { DeepBreadcrumb } from 'whaleex/components';
import { loadScatter } from 'whaleex/components/WalScatter';
import WalletModal from 'whaleex/components/WalModal/WalletModal/WalletModal.js';
import { injectIntl } from 'react-intl';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const confirm = Modal.confirm;

class AddressBind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const {
      intl: { formatMessage },
    } = this.props;
    const eosAccount = _.get(this.props, 'eosAccount.eosAccount');
    const { pubKey, pks } = this.props;
    if (pks.length >= 10000) {
      message.error(formatMessage({ id: 'components.deviceTop' }, { data: 5 }));
      this.urlJump('/user')();
      return;
    }
    const exEosAccount = _.get(this.props, 'eosConfig.result');
    const memo =
      (pubKey && `bind:${pubKey}:${exEosAccount.exEosAccountAlias}`) || '';
    const depositAddress = this.props.currencyListObj.EOS.depositAddress;
    loadScatter(
      {
        withConfirm: true,
        eosAccount,
        depositAddress,
        memo,
        actionType: (eosAccount && 'ACTIVE') || 'BIND',
        formatMessage,
      },
      () => {
        this.setState({ scatterShow: true });
      }
    );
    this.initPage();
  }
  initPage = async () => {
    const { pubKey } = this.props;
    const depositAddress = this.props.currencyListObj.EOS.depositAddress;
    QRCode.toDataURL(depositAddress).then(r => {
      this.setState({ qrcode: r, pubKey, depositAddress });
    });
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
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
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
      pageStatus,
      store,
    } = this.props;
    //合并pks
    const allpks = store.pks.concat(store.pksNotActive);
    const { qrcode, pubKey, depositAddress, scatterShow } = this.state;
    const exEosAccount = _.get(this.props, 'eosConfig.result');
    const pubKeyWrap =
      (pubKey && `bind:${pubKey}:${exEosAccount.exEosAccountAlias}`) || '';
    const eosAccount = _.get(this.props, 'eosAccount.eosAccount');
    //来自于哪个页面 有一个路由的特殊处理
    const pageFrom = U.getSearch('from');
    let pathArr = [
      (pageFrom === 'asset' && <M id="asset.myAsset" />) || (
        <M id="pkAddress.user" />
      ),
      (eosAccount && <M id="pkAddress.goActive" />) || (
        <M id="pkAddress.goBindAccount" />
      ),
    ];
    let actionArr = [
      this.props.urlJump.bind(
        null,
        (pageFrom === 'asset' && '/user') || '/user/setting'
      ),
    ];
    const userPk = _.get(this.props, 'match.params.pk');
    const isBindPage = eosAccount && pageStatus === 'BIND';
    if (userPk && pageStatus === 'BIND') {
      pathArr = [
        <M id="pkAddress.user" />,
        <M id="route.pkAddressNotActive" />,
        <M id="pkAddress.goActive" />,
      ];
      actionArr = [
        this.props.urlJump.bind(null, '/user/setting'),
        this.props.urlJump.bind(null, '/usercenter/pkAddressNotActive'),
      ];
    }
    if (!pubKey) {
      return (
        <div>
          <DeepBreadcrumb arr={pathArr} actions={actionArr} />
          <div className="spin-center height-auto">
            <Spin size="large" spinning={true} />
          </div>
        </div>
      );
    }
    const myDevice = _.find(allpks, { pk: pubKey });
    const { deviceInfo } = myDevice || {};
    const myDeviceInfo = deviceInfo || getDeviceInfo();
    return (
      <div>
        <DeepBreadcrumb arr={pathArr} actions={actionArr} />
        <Step className="AddressBind">
          <div>
            <Item>
              <label />
              <p className="prompt">
                {(eosAccount && (
                  <M
                    id="pkAddress.topalert"
                    values={{ eosAccount, deviceInfo: myDeviceInfo }}
                  />
                )) || <M id="pkAddress.zyts" values={{ min: '3' }} />}
              </p>
            </Item>
            {(isBindPage && (
              <Item>
                <label>
                  <M id="deposit.out" />
                </label>
                <div className="item-grey">{eosAccount}</div>
              </Item>
            )) ||
              null}
            <Item>
              <label>
                <M id="deposit.enter" />
              </label>
              <div className="item-grey">
                <span className="font2">{this.splitStr(depositAddress)}</span>
                <CopyToClipboard
                  text={depositAddress}
                  className="copy font3"
                  onCopy={() => {
                    _czc.push([
                      '_trackEvent',
                      'EOS账户绑定-复制收款账户',
                      '点击',
                    ]);
                    this.onCopy();
                  }}
                >
                  <span className="font3" id="eos_bind_copy_deposit_contract">
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
                <span className="inside">{pubKeyWrap}</span>
                <CopyToClipboard
                  text={pubKeyWrap}
                  className="copy font2"
                  onCopy={() => {
                    _czc.push(['_trackEvent', 'EOS账户绑定-复制备注', '点击']);
                    this.onCopy();
                  }}
                >
                  <span className="font3" id="eos_bind_copy_memo">
                    <M id="deposit.copyadress" />
                  </span>
                </CopyToClipboard>
              </div>
            </Item>
            <Item
              style={{
                marginBottom: 0,
              }}
            >
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
                      actionType: (eosAccount && 'active') || 'bind',
                      eosAccount,
                      depositAddress,
                      amount: '0.0001',
                      currency: 'EOS',
                      memo: pubKeyWrap,
                      pubKey,
                      deviceInfo: myDeviceInfo,
                      desc:
                        (eosAccount &&
                          formatMessage({ id: 'wallet.goActive' })) ||
                        formatMessage({ id: 'wallet.goBind' }),
                    });
                  }}
                >
                  {(eosAccount && <M id="wallet.goActive" />) || (
                    <M id="wallet.goBind" />
                  )}
                  <Icon type="right" />
                </span>
              </p>
            </Item>
            <Item
              style={{
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <label />
              {(scatterShow && (
                <p className="text-align-right">
                  <span
                    className="url-style"
                    onClick={() => {
                      _czc.push([
                        '_trackEvent',
                        'EOS账户绑定-使用Scatter账号进行绑定设置',
                        '点击',
                      ]);
                      loadScatter({
                        withConfirm: false,
                        eosAccount,
                        depositAddress,
                        memo: pubKeyWrap,
                        formatMessage,
                        actionType: (eosAccount && 'ACTIVE') || 'BIND',
                      });
                    }}
                  >
                    {(eosAccount && <M id="scatter.goActive" />) || (
                      <M id="scatter.goBind" />
                    )}
                    <Icon type="right" />
                  </span>
                </p>
              )) ||
                null}
            </Item>
            <Item
              style={{
                marginTop: 0,
              }}
              className="alertItem"
            >
              <label />
              <p className="text-align-right">
                <a
                  href="https://support.whaleex.com/hc/zh-cn/articles/360015445412-%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9AEOS%E8%B4%A6%E6%88%B7-"
                  target="_blank"
                >
                  <span
                    className="url-style"
                    onClick={() => {
                      _czc.push(['_trackEvent', '如何绑定EOS账户', '点击']);
                    }}
                  >
                    <M id="wallet.howBind" />
                  </span>
                </a>
              </p>
            </Item>
            {(isBindPage && (
              <Item>
                <label />
                <div>
                  <div className="message">
                    <M id="deposit.tips" />
                    <br />
                    <M id="pkAddress.textList" richFormat />
                  </div>
                </div>
              </Item>
            )) || (
              <Item>
                <label />
                <div style={{ width: '100%' }}>
                  <div className="message">
                    <M id="deposit.tips" />
                    <br />
                    <M id="pkAddress.bindtextList" richFormat />
                  </div>
                </div>
              </Item>
            )}
          </div>
        </Step>
      </div>
    );
  }
}

AddressBind.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(AddressBind);
