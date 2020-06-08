import React from 'react';
import PropTypes from 'prop-types';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import ecc from 'eosjs-ecc';
import { Step } from './style.js';
import {
  encryptDataSaveKey,
  loadKeyDecryptData,
  deleteStoreByKey,
  decrypt,
} from 'whaleex/common/webCrypKey.js';
import { getSignature } from 'whaleex/common/webSign.js';
import { bindPk } from 'whaleex/common/actionsChain.js';
import { getDeviceInfo } from 'whaleex/utils/device.js';
import './style.less';

export default class RegisterNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  generateAccount = () => {
    const { data } = this.props;
    const { userUniqKey, userId } = data;
    this.setState(
      preState => {
        return { ...preState, loading: true };
      },
      async () => {
        const {
          userEncryptKey,
          pubkey: pubkeyLocal,
        } = await loadKeyDecryptData(userUniqKey);
        let privateKey,
          pubkey,
          deviceInfo = getDeviceInfo();
        if (!!pubkeyLocal) {
          //存在本地 pk
          const privateKeyLocal = decrypt(userEncryptKey, userUniqKey);
          privateKey = privateKeyLocal;
          pubkey = pubkeyLocal;
        } else {
          const privateWif = await ecc.randomKey();
          const pubkeyWif = ecc.privateToPublic(privateWif);
          privateKey = privateWif;
          pubkey = pubkeyWif;
          //保存生成的秘钥对
          encryptDataSaveKey({
            userUniqKey,
            pubkey,
            privateKey,
          });
        }
        // 签名 并 尝试绑定
        const signature = getSignature(userId, privateKey);
        const bindR = await bindPk({
          pk: pubkey,
          signature,
          deviceInfo,
        });
        if (bindR) {
          this.props.nextStep();
        }
        this.setState({ loading: false });
      }
    );
  };
  render() {
    const { loading } = this.state;
    return (
      <Step className="RegisterNew">
        <div className="content" style={{ textAlign: 'left' }}>
          <h1>托管账户设置</h1>
          <p>
            为了您的资产安全，您在使用鲸交所前需要完成链托管设置，链托管可以保证您的资产不被任何人（包括鲸交所）触碰。关于资产托管您需要知道以下几点：
          </p>
          <p>
            1.平台会为您生成唯一的托管账户，将和您以后绑定的钱包地址一一对应；
          </p>
          <p>
            2.托管账户是一个公开透明的智能合约地址，而非个人或公司的钱包地址，任何人都无法触碰您的资产；
          </p>
          <p>
            3.您可以随时验证智能合约的逻辑，以及在区块链上查看您的资产情况，来保证链托管逻辑的透明可信任
          </p>
          <p>
            4.一旦您绑定地址，生成托管账户后，您只能从该地址向托管账户充值，您的资产也只能提现到该地址中
          </p>
          <p>
            5.万一鲸交所倒闭了，您可以使用您绑定的钱包账户的私钥将您在合约地址上的资产提出
          </p>
          <StyledButton
            className="confirm-btn"
            type="primary"
            onClick={this.generateAccount}>
            {(loading && '生成中') || '生成托管账户'}
          </StyledButton>
        </div>
      </Step>
    );
  }
}

RegisterNew.PropTypes = {
  handler: PropTypes.function,
};
