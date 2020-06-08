import signIt from './signIt.js';
export async function signStakeFor(params) {
  const {
    eosAccount,
    userAccount,
    targetAccount,
    timestamp,
    userUniqKey,
    str = 'CPU',
  } = params;
  var buf = [eosAccount, userAccount, targetAccount, timestamp, str];
  buf = buf.join(' | ');

  let signature = await signIt(buf, userUniqKey);
  return `1:${signature}`;
}
