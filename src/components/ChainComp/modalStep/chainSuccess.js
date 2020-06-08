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
import Loading from '../../Loading';
import { getSignature } from 'whaleex/common/webSign.js';
import { bindPk } from 'whaleex/common/actionsChain.js';
import { getDeviceInfo } from 'whaleex/utils/device.js';

import './style.less';

export default class ChainSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // this.generateAccount();
  }
  generateAccount = (loadingKey, callBack) => {
    const { data } = this.props;
    const { userUniqKey, userId } = data;
    this.setState(
      preState => {
        return { ...preState, [loadingKey]: true };
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
        this.setState({ [loadingKey]: false, pubkey });
        callBack && callBack();
      }
    );
  };
  nextStep = loadingKey => {
    this.generateAccount(loadingKey, () => {
      this.props.nextStep();
    });
  };
  onOk = loadingKey => {
    this.generateAccount(loadingKey, () => {
      const { pubkey } = this.state;
      this.props.onOk(pubkey);
    });
  };
  render() {
    const { loading, loading2 } = this.state;
    const { type } = this.props.data;
    return (
      <Step className="ChainSuccess">
        <div className="content">
          <div>{/* <img src={img} /> */}</div>
          <h1>资产账户绑定</h1>
          <p>
            鲸交所是去中心化交易所，不会触碰用户资产，在使用鲸交所交易前需要绑定您的资产账户，资产账户绑定后，你的资产将会存放在您自己的资产账户中，任何人(包括鲸交所)无法触碰您的资产，完成资产账户绑定，需要您使用EOS钱包往合约地址中转账完成绑定。
          </p>
          <div className="btn-wrap">
            <StyledButton
              className="confirm-btn"
              type="primary"
              disabled={loading}
              onClick={this.nextStep.bind(null, 'loading')}>
              {(loading && <Loading />) || null}资产账户绑定
            </StyledButton>
            <StyledButton
              className="confirm-btn no-border"
              onClick={this.onOk.bind(null, 'loading2')}
              disabled={loading2}>
              {(loading2 && <Loading inverse />) || null}下次再说
            </StyledButton>
          </div>
          <p className="bottom-guide">
            为什么要绑定资产账户？<br />
            1.您在鲸交所的资产在一个公开透明的智能合约上，并与您的资产账户绑定，任何人（包括鲸交所）都无法触碰您的资产；<br />
            2.绑定资产账户后，您在合约地址中的资产只能提币您的资产账户中，即使发生黑客攻击等情况，您的资产依然安全；<br />
            3.绑定资产账户会使您的资产与交易所资产分离，即使交易所倒闭，您可以使用您的资产账户私钥将您在合约地址上的资产提出；<br />
            4.绑定资产账户会提高您的资产使用效率，加快您提币的到账速度。
          </p>
        </div>
      </Step>
    );
  }
}

ChainSuccess.PropTypes = {
  handler: PropTypes.function,
};
