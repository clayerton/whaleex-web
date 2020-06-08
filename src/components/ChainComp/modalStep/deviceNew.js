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
import { bindPk, getUserEosAccount } from 'whaleex/common/actionsChain.js';
import { getDeviceInfo } from 'whaleex/utils/device.js';
import Loading from '../../Loading';

import './style.less';

export default class DeviceNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        this.setState({ loading: false, pubkey });
        callBack && callBack({ bindR, pubkey });
      }
    );
  };
  goNextStep = async ({ bindR }) => {
    const eosAccount = await getUserEosAccount();
    if (bindR) {
      this.props.nextStep({ eosAccount });
    }
  };
  onOk = ({ pubkey }) => {
    this.props.onOk(pubkey);
  };
  render() {
    const { loading, loading2 } = this.state;
    return (
      <Step className="DeviceNew">
        <div className="content">
          <div>{/* <img src={img} /> */}</div>
          <h1>激活设备提示</h1>
          <p>
            您当前使用的设备尚未完成激活，为了您的账户安全，需要使用您绑定的EOS资产账户向合约地址中转账任意金额EOS来激活当前设备，您转账的EOS会存放在您的资产账户中。
          </p>
          <p className="user-alert">
            重要提示：只能使用您已经绑定的EOS资产账户转账
          </p>
          <div className="btn-wrap">
            <StyledButton
              className="confirm-btn"
              type="primary"
              disabled={loading}
              onClick={() => {
                this.generateAccount('loading', this.goNextStep);
              }}>
              {(loading && <Loading />) || null}激活当前设备
            </StyledButton>
            <StyledButton
              className="confirm-btn no-border"
              disabled={loading2}
              onClick={() => {
                this.generateAccount('loading2', this.onOk);
              }}>
              {(loading2 && <Loading inverse />) || null}下次再说
            </StyledButton>
          </div>
        </div>
      </Step>
    );
  }
}

DeviceNew.PropTypes = {
  handler: PropTypes.function,
};
