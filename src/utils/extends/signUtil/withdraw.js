import signIt from './signIt.js';
export async function signWithdraw(
  params,
  currencyObj,
  userEosAccount,
  exEosAccount,
  userUniqKey
) {
  const { currency, withdrawId, quantity, feeQty } = params;
  const { depositAddress, contract, token, decimals } = currencyObj;
  var buf = [
    contract,
    token,
    multiply(1, quantity, decimals),
    userEosAccount,
    exEosAccount,
    splitBySpace(withdrawId + ''),
    contract,
    token,
    multiply(1, feeQty, decimals),
  ];
  buf = buf.join(' | ');
  let signature = await signIt(buf, userUniqKey);
  return `1:${signature}`;
}
function multiply(m, n, decimal) {
  let result = math.eval(`${m} * ${n} * ${Math.pow(10, decimal)}`);
  return String(Math.floor(result));
}
function splitBySpace(value) {
  const chars = value.toString().split('');
  const re = [];
  while (chars.length > 0) {
    re.push(chars.splice(0, 12));
  }
  return re.map(x => x.join('')).join(' ');
}
