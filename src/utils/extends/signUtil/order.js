import signIt from './signIt.js';
import bigInt from 'big-integer';
math.config({ number: 'BigNumber' });
export async function requestSignature(orderMemo, userUniqKey, whatfor = '') {
  let signature = await signIt(orderMemo, userUniqKey, whatfor);
  return signature;
}
function getRandomRange(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Rand * Range;
  return num;
}
export async function signCancelOrder(orderId, userUniqKey) {
  let signature = await requestSignature(orderId, userUniqKey, 'Cancel Order');
  return `${signature}`;
}
export function getExpressId() {
  //orderId格式:  0-65535左移32位+32位timestamp
  let timestamp = parseInt(Date.now() / 1000);
  let randomSeed = Math.round(getRandomRange(0, 65535));
  U.logIt([
    'submitDelegate-error-id-1',
    JSON.stringify({ randomSeed }),
    '---end---',
  ]);
  let id = bigInt(timestamp)
    .shiftLeft(16)
    .plus(randomSeed)
    .toString();
  U.logIt(['submitDelegate-error-id-2', JSON.stringify({ id }), '---end---']);
  U.logIt([
    'submitDelegate-error-signOrder-11',
    JSON.stringify({ timestamp, randomSeed, id }),
    '---end---',
  ]);
  return id;
}
export async function createOrder(
  orderMemo,
  mergeSymbol,
  sideMode,
  priceMode,
  price,
  quantity,
  expressId,
  orderTime,
  feeRate,
  userUniqKey
) {
  const { name: symbolName } = mergeSymbol;
  const { takerFeeRate, makerFeeRate } = feeRate;

  let signature = await requestSignature(orderMemo, userUniqKey, 'Sign Order');
  let order = {
    symbol: symbolName,
    side: sideMode,
    type: priceMode,
    price,
    quantity,
    orderId: expressId,
    time: orderTime,
    takerFeeRate,
    makerFeeRate,
    signature: `1:${signature}`,
  };
  return order;
}
export function createOrderMemo(
  userEosAccount,
  exEosAccount,
  mergeSymbol,
  sideMode,
  priceMode,
  price,
  quantity,
  feeRate,
  expressId,
  orderTime,
  currentStakeForAccount
) {
  //user | buy_or_sell | market_or_limit | base_contract |
  // base_token | base_amount | quote_contract | quote_token |
  //  quote_amount | maker_fee | taker_fee | exchange |
  //   orderId | orderTime | stakeFor
  //pay_amount, want_amount, orderId: 从第1个字符开始, 每12个字符, 插入一个空格
  let { B, Q, partition } = mergeSymbol;
  const { takerFeeRate, makerFeeRate } = feeRate;
  let baseContract = B.contract,
    baseToken = B.token,
    baseAmount = multiply(1, quantity, B.decimals, sideMode !== 'BUY'),
    quoteContract = Q.contract,
    quoteToken = Q.token,
    quoteAmount = multiply(price, quantity, Q.decimals, sideMode === 'BUY');
  if (priceMode === 'MARKET' && sideMode === 'BUY') {
    baseAmount = 0;
    quoteAmount = multiply(1, quantity, Q.decimals, sideMode === 'BUY');
  }
  let ordermemo = [
    userEosAccount,
    sideMode.toLowerCase(),
    priceMode.toLowerCase(),
    baseContract,
    baseToken,
    splitBySpace(baseAmount + ''),
    quoteContract,
    quoteToken,
    splitBySpace(quoteAmount + ''),
    Number(makerFeeRate) * 10000,
    Number(takerFeeRate) * 10000,
    exEosAccount,
    splitBySpace(expressId + ''),
    orderTime,
  ];
  if (sideMode === 'BUY' && partition === 'CPU' && currentStakeForAccount) {
    ordermemo = ordermemo.concat(currentStakeForAccount);
  } else {
    ordermemo = ordermemo.concat('');
  }
  return ordermemo.join(' | ');
}
export function mergeSymbol(currencyListObj, symbol) {
  const { baseCurrency, quoteCurrency } = symbol;
  return {
    ...symbol,
    B: currencyListObj[baseCurrency],
    Q: currencyListObj[quoteCurrency],
  };
}
function splitBySpace(value) {
  const chars = value.toString().split('');
  const re = [];
  while (chars.length > 0) {
    re.push(chars.splice(0, 12));
  }
  return re.map(x => x.join('')).join(' ');
}
function multiply(m, n, decimal, isPay) {
  let result = math.eval(`${m} * ${n} * ${Math.pow(10, decimal)}`);
  if (isPay) {
    return String(Math.ceil(result));
  }
  return String(result).split('.')[0];
}
