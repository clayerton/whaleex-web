import ecc from 'eosjs-ecc';
import {
  encryptDataSaveKey,
  loadKeyDecryptData,
  deleteStoreByKey,
  decrypt,
} from 'whaleex/common/webCrypKey.js';
import { getSignature } from 'whaleex/common/webSign.js';
import { bindPk } from 'whaleex/common/actionsChain.js';

import { getDeviceInfo } from 'whaleex/utils/device.js';

export const silentModal = async data => {
  const { userUniqKey, userId } = data;
  const { userEncryptKey, pubkey: pubkeyLocal } = await loadKeyDecryptData();
  let privateKey,
    pubkey,
    deviceInfo = getDeviceInfo();
  if (!!pubkeyLocal) {
    //存在本地 pk
    try {
      const privateKeyLocal = decrypt(userEncryptKey, userUniqKey);
      //TODO 解密可能失败，此时需要重新生成keys，
      //TODO 应该出现用户重置uniqkey，此时远端的pks也都应该清除
      privateKey = privateKeyLocal;
      pubkey = pubkeyLocal;
    } catch (e) {
      const privateWif = await ecc.randomKey();
      const pubkeyWif = ecc.privateToPublic(privateWif);
      privateKey = privateWif;
      pubkey = pubkeyWif;
      //保存生成的秘钥对
      encryptDataSaveKey({
        userUniqKey,
        pubkey,
        privateKey,
        userId,
      });
    }
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
      userId,
    });
  }
  // 签名 并 尝试绑定
  const signature = getSignature(userId, privateKey);
  const bindR = await bindPk({
    pk: pubkey,
    signature,
    deviceInfo,
  });
  return { bindR, pubkey };
};
