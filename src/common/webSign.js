import crypto from 'crypto';
import ecc from 'eosjs-ecc';
import Long from 'long';
import { loadKeyDecryptData, decrypt } from './webCrypKey.js';

math.config({ number: 'BigNumber' });
var pack = new Packer();
export function Packer() {
  this.buf = Buffer.alloc(0);
  this.updateStr = function(str) {
    this.buf = Buffer.concat([this.buf, Buffer.from(str)]);
    return this;
  };
  this.updateInt8 = function(i) {
    var tmp = Buffer.alloc(1);
    tmp.writeInt8(i, 0);
    this.buf = Buffer.concat([this.buf, tmp]);
    return this;
  };
  this.updateInt16 = function(i) {
    var tmp = Buffer.alloc(2);
    tmp.writeInt16LE(i, 0);
    this.buf = Buffer.concat([this.buf, tmp]);
    return this;
  };
  this.updateInt32 = function(i) {
    var tmp = Buffer.alloc(4);
    tmp.writeInt32LE(i, 0);
    this.buf = Buffer.concat([this.buf, tmp]);
    return this;
  };
  this.updateInt64 = function(str) {
    var tmp = Buffer.alloc(8);
    var long = Long.fromString(str, 10);
    this.buf = Buffer.concat([this.buf, Buffer.from(long.toBytesLE())]);
    return this;
  };
  this.finalize = function() {
    return this.buf;
  };
  this.clear = function() {
    this.buf = Buffer.alloc(0);
  };
}
/*
 签名 绑定公钥
 */
export function getSignature(userId, privateKey) {
  if (userId) {
    pack.clear();
    const hashCry = crypto.createHash('sha256');
    var buf = pack.updateInt64(String(userId)).finalize();
    var hash = hashCry.update(buf).digest('hex');
    var sig = ecc.signHash(hash, privateKey);
    return sig;
  }
  return null;
}
/*
签名 下单
 */
export async function signOrder(params, userUniqKey) {
  //privateKey
  const { userEncryptKey } = await loadKeyDecryptData(userUniqKey);
  const privateKey = decrypt(userEncryptKey, userUniqKey);

  const {
    userEosAccount,
    eosAccount,
    id,
    time,
    payContract,
    payToken,
    payAmount,
    expectContract,
    expectToken,
    expectAmount,
    makerFeeRate,
    takerFeeRate,
  } = params;
  pack.clear();
  const hashInstance = crypto.createHash('sha256');
  var buf = pack
    .updateStr(userEosAccount)
    .updateStr(eosAccount.exEosAccount)
    .updateInt64(String(id)) //100 id
    .updateInt32(time)
    .updateStr(payContract) //合约
    .updateStr(payToken) //
    .updateInt64(payAmount) //amount  ===
    .updateStr(expectContract) //currency
    .updateStr(expectToken) //currency
    .updateInt64(expectAmount) //总量 payAmount  ==
    .updateInt16(makerFeeRate) //feeRate
    .updateInt16(takerFeeRate) //
    .finalize();
  let hash = hashInstance.update(buf).digest('hex');
  let signature = ecc.signHash(hash, privateKey);

  // let signature = SignUtil.signDemo()
  return signature;
}
/*
签名 CPU
 */
export async function signStakeFor(params) {
  const {
    eosAccount,
    userAccount,
    targetAccount,
    timestamp,
    userUniqKey,
    str = 'CPU',
  } = params;
  const { userEncryptKey } = await loadKeyDecryptData();

  const privateKey = decrypt(userEncryptKey, userUniqKey);
  pack.clear();
  const hashInstance = crypto.createHash('sha256');
  var buf = pack
    .updateStr(eosAccount)
    .updateStr(userAccount)
    .updateStr(targetAccount)
    .updateInt32(timestamp)
    .updateStr(str)
    .finalize();
  var hash = hashInstance.update(buf).digest('hex');
  return ecc.signHash(hash, privateKey);
}
/*
签名 提币
 */
export async function signWithdraw(
  params,
  currencyObj,
  userEosAccount,
  userUniqKey,
  exEosAccount
) {
  //params, userEosAccount, userUniqKey
  const { currency, withdrawId, quantity, feeQty } = params;
  const { depositAddress, contract, token, decimals } = currencyObj;
  const { userEncryptKey } = await loadKeyDecryptData(userUniqKey);
  const privateKey = decrypt(userEncryptKey, userUniqKey);
  pack.clear();
  const hashInstance = crypto.createHash('sha256');
  var buf = pack
    .updateStr(userEosAccount)
    .updateStr(exEosAccount.exEosAccount)
    .updateInt64(String(withdrawId))
    .updateStr(contract)
    .updateStr(token)
    .updateInt64(multiply(1, quantity, decimals))
    .updateStr(contract)
    .updateStr(token)
    .updateInt64(multiply(1, feeQty, decimals))
    .finalize();
  var hash = hashInstance.update(buf).digest('hex');
  return ecc.signHash(hash, privateKey);
}
function multiply(m, n, decimal) {
  let result = math.eval(`${m} * ${n} * ${Math.pow(10, decimal)}`);
  return String(Math.floor(result));
}
export function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
