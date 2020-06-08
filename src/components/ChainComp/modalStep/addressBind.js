import React from 'react';
import PropTypes from 'prop-types';

import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import QRCode from 'qrcode';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getEOScontract } from 'whaleex/common/actionsChain.js';
import { message } from 'antd';
import { Step } from './style.js';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import './style.less';

export default class AddressBind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.initIt();
  }
  initIt = async () => {
    const { data } = this.props;

    const { userUniqKey, userId } = data;
    let r = await getEOScontract();
    const depositAddress = r.filter(({ shortName }) => shortName === 'EOS')[0]
      .depositAddress;
    const { pubkey } = await loadKeyDecryptData(userUniqKey);
    QRCode.toDataURL(depositAddress, { width: 130 }).then(r => {
      this.setState({ qrcode: r, depositAddress, pubkey });
    });
  };
  onCopy = () => {
    message.success('复制成功！');
    // this.setState({ qrCodeCopyed: true });
    // setTimeout(() => {
    //   this.setState({ qrCodeCopyed: false });
    // }, 1000);
  };
  onOk = () => {
    const { pubkey } = this.state;
    this.props.onOk(pubkey);
  };
  render() {
    const { qrcode, qrCodeCopyed, pubkey, depositAddress } = this.state;
    const {
      data: { step, eos },
      preData,
      userConfig,
    } = this.props;
    const exEosAccount = _.get(this.props, 'data.eos.result');
    const eosAccount = _.get(preData, 'eosAccount.eosAccount');
    const memo =
      (pubkey && `bind:${pubkey}:${exEosAccount.exEosAccountAlias}`) || '';
    return (
      <Step className="AddressBind">
        <div className="content">
          <h1>{(step === 'deviceNew' && '激活当前设备') || '资产账户绑定'}</h1>
          <p>
            使用您常用的EOS钱包往下面的合约地址转账任意金额EOS，转账备注附带下方信息
          </p>
          <div>
            <div className="flex-between">
              <label style={{ color: '#99acb6' }}>转账备注信息</label>{' '}
              <CopyToClipboard
                text={memo}
                className="copy"
                onCopy={this.onCopy}>
                <span>复制备注</span>
              </CopyToClipboard>
            </div>
            <div>
              <p className="inside">{memo}</p>
            </div>
            <p className="user-alert">
              {(step === 'deviceNew' &&
                `只能使用您绑定的EOS资产账户（${eosAccount}）转账`) ||
                '重要提示：只能使用您的私人钱包转账，不可使用交易所地址转账，否则不可找回'}
            </p>
          </div>
          <div>
            <div className="flex-between">
              <label style={{ color: '#99acb6' }}>
                合约地址: <span>{depositAddress}</span>
              </label>
              <CopyToClipboard
                text={depositAddress}
                className="copy"
                onCopy={this.onCopy}>
                <span>复制地址</span>
              </CopyToClipboard>
            </div>
          </div>
          <div>
            <div style={{ margin: '40px' }} className="qrcode-img">
              <img src={qrcode} />
            </div>
          </div>
          <div className="btn-wrap">
            <StyledButton
              className="confirm-btn"
              type="primary"
              onClick={this.onOk}>
              完成
            </StyledButton>
          </div>
          <p className="bottom-guide">
            温馨提示：<br />
            1.资产账户一旦绑定，只能使用该账户进行充币和提币，请谨慎对待;<br />
            2.更换使用设备需要激活新设备，不会影响您在链上的资产;<br />
            3.资产账户一旦绑定不能解绑，请绑定您常用的EOS账户;<br />
            4.资产账户绑定成功后，您的资产会托管在智能合约中，任何人(包括鲸交所)都无法触碰您的资产;
          </p>
        </div>
      </Step>
    );
  }
}

AddressBind.PropTypes = {
  handler: PropTypes.function,
};
