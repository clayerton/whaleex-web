import M from 'whaleex/components/FormattedMessage';
import { unitMap, colorMap } from 'whaleex/utils/dollarMap.js';
import { Icon, Tooltip } from 'antd';
import Star from 'whaleex/components/Star';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const canTradeImg =
  _config.cdn_url + '/web-static/imgs/web/trade/mining-ing.png';
const stopTradeImg =
  _config.cdn_url + '/web-static/imgs/web/trade/mining-stop.png';
/**
 * @param  {[type]} data          [本次渲染的数据]
 * @param  {Object} pagination    [本次渲染的分页]
 * @param  {[type]} that          [引用当前页面this对象，用于特定操作调用]
 * @return {[type]}               [返回{tab:{key,title,columns,dataSource,pagination,},loading}]
 */

const wrapFunc = (key, title) => {
  return func.bind(this, key, title);
};
export default wrapFunc;
function func(
  key,
  title,
  data,
  pagination = {
    current: 1,
    pageSize: 5,
    total: 22,
  },
  that,
  Extend
) {
  const startUp = _.get(
    Extend,
    `app.eosConfig.result.mineConfig.startup`,
    false
  );
  const whaleRemain = _.get(Extend, 'app.whaleData.symbolsRemain', {});
  const whaleTime = _.get(
    Extend,
    'app.eosConfig.result.mineConfig.symbolsLimit',
    {}
  );
  return {
    tab: {
      key,
      title,
      columns: [
        {
          key: 'subscribe',
          dataIndex: 'id',
          title: (
            <span>
              <Star color={'transparent'} />
            </span>
          ),
          width: 30,
          render: (v, i) => {
            const { subscription = [] } = Extend;
            let check = false,
              clickAction = () => {
                that.props.toggleSubscription(v, true);
              };
            if (subscription.includes(`${v}`)) {
              check = true;
              clickAction = () => {
                that.props.toggleSubscription(v, false);
              };
            }
            //交易对收藏
            return (
              <span className="starTd">
                <Star check={check} onClick={clickAction} />
              </span>
            );
          },
        },
        {
          key: 'symbolId',
          dataIndex: 'symbolId',
          width: 200,
          title: <M id="symbolSwitch.symbol" />,
          render: (v, i) => {
            const { currencyListObj } = Extend;
            const { baseCurrencyId, quoteCurrencyId } = i;
            const symbolName = [
              _.get(currencyListObj, `${baseCurrencyId}.shortName`),
              _.get(currencyListObj, `${quoteCurrencyId}.shortName`),
            ];
            const symbolByName = symbolName[0] + symbolName[1];
            const symbolCanTrade = whaleRemain[symbolByName];
            const symbolCanTradeTime = whaleTime[symbolByName];
            const { startTime, endTime } = symbolCanTradeTime || {};
            const { hourRemainAmount, dayRemainAmount } = symbolCanTrade || {};
            let nowTime = +new Date();
            const toolTipContent = (
              <div className="toolTipContent" style={{ fontSize: 12 }}>
                <div>
                  <M id="trade.hourRemainAmount" />
                  {hourRemainAmount || 0} WAL
                </div>
                <div>
                  <M id="trade.dayRemainAmount" />
                  {dayRemainAmount || 0} WAL
                </div>
              </div>
            );

            return (
              <span
                className="symbolTd"
                onClick={() => {
                  _czc.push(['_trackEvent', '选择交易对', '点击']);
                  const path = [
                    BASE_ROUTE,
                    prefix,
                    `/trade/${symbolName.join('_')}`,
                  ].join('');
                  that.props.history.push(path);
                  that.props.handleVisibleChange(false);
                }}
              >
                <span className="symbolName" id="choose_currency">
                  <span>{symbolName[0]}</span>/<span>{symbolName[1]}</span>
                  <span>
                    {(symbolCanTrade && (
                      <Tooltip placement="right" title={toolTipContent}>
                        {(startUp === true &&
                          hourRemainAmount !== '0' &&
                          startTime < nowTime &&
                          endTime > nowTime && <img src={canTradeImg} />) || (
                          <img src={stopTradeImg} />
                        )}
                      </Tooltip>
                    )) ||
                      null}
                  </span>
                </span>
              </span>
            );
          },
        },
        {
          key: 'lastPrice',
          dataIndex: 'lastPrice',
          width: 200,
          title: <M id="symbolSwitch.interestOrPrice" />,
          render: (v, i) => {
            const {
              legalTender,
              convertMap,
              convertMap_digital,
              currencyListObj,
            } = Extend;
            const {
              baseCurrencyId,
              quoteCurrencyId,
              priceChangePercent,
              partition,
              duration,
            } = i;
            const symbolName = [
              _.get(currencyListObj, `${baseCurrencyId}.shortName`),
              _.get(currencyListObj, `${quoteCurrencyId}.shortName`),
            ];
            let colorKey =
              (priceChangePercent > 0 && 'upper') ||
              ((priceChangePercent < 0 && 'lower') || 'lower');
            if (partition === 'CPU') {
              return (
                <div
                  className="lastPriceTd"
                  onClick={() => {
                    _czc.push(['_trackEvent', '选择交易对', '点击']);
                    const path = [
                      BASE_ROUTE,
                      prefix,
                      `/trade/${symbolName.join('_')}`,
                    ].join('');
                    that.props.history.push(path);
                    that.props.handleVisibleChange(false);
                  }}
                >
                  <span style={{ color: colorMap[colorKey] }}>
                    {U.getPercentFormat(v)}
                  </span>
                  <span>
                    ≈
                    {(v && (((365 * 24) / duration) * 100 * v).toFixed(2)) ||
                      '--'}
                    % (<M id="orderInput.yearPercent" />)
                  </span>
                </div>
              );
            }
            return (
              <div
                className="lastPriceTd"
                onClick={() => {
                  _czc.push(['_trackEvent', '选择交易对', '点击']);
                  const path = [
                    BASE_ROUTE,
                    prefix,
                    `/trade/${symbolName.join('_')}`,
                  ].join('');
                  that.props.history.push(path);
                  that.props.handleVisibleChange(false);
                }}
              >
                <span style={{ color: colorMap[colorKey] }}>{v}</span>
                <span>
                  ≈{unitMap[legalTender]}
                  {U.formatLegalTender(
                    v * convertMap_digital[quoteCurrencyId] * convertMap['EOS']
                  )}
                </span>
              </div>
            );
          },
        },
        {
          key: 'priceChangePercent',
          dataIndex: 'priceChangePercent',
          title: <M id="symbolSwitch.percent" />,
          align: 'right',
          render: (v, i) => {
            const { priceChangePercent } = i;
            const { currencyListObj } = Extend;
            const { baseCurrencyId, quoteCurrencyId } = i;
            const symbolName = [
              _.get(currencyListObj, `${baseCurrencyId}.shortName`),
              _.get(currencyListObj, `${quoteCurrencyId}.shortName`),
            ];
            let colorKey =
              (priceChangePercent > 0 && 'upper') ||
              ((priceChangePercent < 0 && 'lower') || 'lower');
            return (
              <span
                className="percentTd"
                style={{ color: colorMap[colorKey] }}
                onClick={() => {
                  _czc.push(['_trackEvent', '选择交易对', '点击']);
                  const path = [
                    BASE_ROUTE,
                    prefix,
                    `/trade/${symbolName.join('_')}`,
                  ].join('');
                  that.props.history.push(path);
                  that.props.handleVisibleChange(false);
                }}
              >
                {priceChangePercent > 0 && '+'}
                {(v * 100 || 0).toFixed(2)}%
              </span>
            );
          },
        },
      ],
      dataSource: data,
      pagination,
      scrollX: 400,
      scrollY: 335,
    },
    loading: false,
  };
}
