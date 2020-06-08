import { signOrder } from 'whaleex/common/webSign.js';

math.config({ number: 'BigNumber' });
class OrderUtils {
  static async createOrder(
    {
      params,
      symbol,
      eosAccount: account = {},
      exEosAccount,
      currencyListObj,
      expressId,
      userUniqKey,
      timeStamp = Math.floor(Date.now() / 1000),
    },
    no10000
  ) {
    const { name, side, type, quantity, price, feeRate } = params;
    const { baseCurrency: base, quoteCurrency: quote } = symbol;
    const { quoteWalRate, baseWalRate, takerFeeRate, makerFeeRate } = feeRate;
    // let expectToken2WALRatio = !!quoteWalRate ? quoteWalRate : 0;
    // if (side == 'BUY') {
    //   expectToken2WALRatio = !!baseWalRate ? baseWalRate : 0;
    // }
    let order = {
      symbol: name,
      side,
      type,
      quantity,
      price,
      orderId: expressId,
      time: timeStamp,
      takerFeeRate,
      makerFeeRate,
    };
    let payContract,
      payToken,
      payAmount,
      expectContract,
      expectToken,
      expectAmount;
    let Q = currencyListObj[quote],
      B = currencyListObj[base];
    if (type === 'LIMIT' || `${type}` === '76') {
      if (side === 'BUY' || `${side}` === '66') {
        payContract = Q.contract;
        payToken = Q.token;
        payAmount = this.multiply(price, quantity, Q.decimals, true); //有余数up
        expectContract = B.contract;
        expectToken = B.token;
        expectAmount = this.multiply(1, quantity, B.decimals); //down
      } else {
        payContract = B.contract;
        payToken = B.token;
        payAmount = this.multiply(1, quantity, B.decimals, true);
        expectContract = Q.contract;
        expectToken = Q.token;
        expectAmount = this.multiply(price, quantity, Q.decimals);
      }
    } else {
      if (side === 'BUY' || `${side}` === '66') {
        payContract = Q.contract;
        payToken = Q.token;
        payAmount = this.multiply(1, quantity, Q.decimals, true);
        expectContract = B.contract;
        expectToken = B.token;
        expectAmount = '0';
      } else {
        payContract = B.contract;
        payToken = B.token;
        payAmount = this.multiply(1, quantity, B.decimals, true);
        expectContract = Q.contract;
        expectToken = Q.token;
        expectAmount = '0';
      }
    }
    let sign = {
      userEosAccount: account.eosAccount,
      eosAccount: exEosAccount,
      id: String(expressId),
      time: timeStamp,
      payContract: payContract,
      payToken: payToken,
      payAmount: payAmount,
      expectContract: expectContract,
      expectToken: expectToken,
      expectAmount: expectAmount,
      makerFeeRate: no10000
        ? order.makerFeeRate
        : Number(order.makerFeeRate) * 10000,
      takerFeeRate: no10000
        ? order.takerFeeRate
        : Number(order.takerFeeRate) * 10000,
      // tokenToWalRate: String(Number(order.expectToken2WALRatio) * 10000),
    };
    const signature = await signOrder(sign, userUniqKey); //privateKey
    order.signature = signature;
    return order;
  }

  static multiply(m, n, decimal, isPay) {
    let result = math.eval(`${m} * ${n} * ${Math.pow(10, decimal)}`);
    if (isPay) {
      return String(Math.ceil(result));
    }
    return String(result).split('.')[0];
  }
}
export default OrderUtils;
