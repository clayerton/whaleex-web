import ecc from 'eosjs-ecc';

import { loadKeyDecryptData, decrypt } from 'whaleex/common/webCrypKey.js';
/**
 * 解密
 * @param key
 * encrypted:缓存里 的 加密过的私钥
 * @constructor
 */
export default async function signIt(data, userUniqKey) {
  const { userEncryptKey } = await loadKeyDecryptData();
  const privateKey = decrypt(userEncryptKey, userUniqKey);
  let signature = ecc.sign(data, privateKey);
  return signature;
}
