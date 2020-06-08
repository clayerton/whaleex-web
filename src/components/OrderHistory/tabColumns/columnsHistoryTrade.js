import M from 'whaleex/components/FormattedMessage';
/**
 * @param  {[type]} data          [本次渲染的数据]
 * @param  {Object} pagination    [本次渲染的分页]
 * @param  {[type]} that          [引用当前页面this对象，用于特定操作调用]
 * @return {[type]}               [返回{tab:{key,title,columns,dataSource,pagination,},loading}]
 */
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export default (
  data,
  pagination = {
    current: 1,
    pageSize: 5,
    total: 22,
  },
  that,
  Extend
) => {
  return {
    tab: {
      key: 'historyTrade',
      title: <M id="orderHistory.historyTrade" />,
      columns: [
        {
          key: 'timestamp',
          dataIndex: 'timestamp',
          width: 130,
          title: <M id="orderHistory.orderTime" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              const { symbol } = Extend;
              return {
                children: (
                  <a
                    style={{
                      textAlign: 'center',
                      display: 'inline-block',
                      width: '100%',
                    }}
                    onClick={() => {
                      window.walHistory.push(
                        [
                          BASE_ROUTE,
                          prefix,
                          '/user/tradeDetail?tab=2&symbolId=' + symbol.id || 0,
                        ].join('')
                      );
                    }}
                  >
                    <M id="orderHistory.more" />
                  </a>
                ),
                props: {
                  colSpan: 7,
                },
              };
            }
            return <span>{moment(+v).format('YY/MM/DD HH:mm:ss')}</span>;
          },
        },
        {
          key: 'symbolId',
          dataIndex: 'symbolId',
          width: 110,
          title: <M id="orderHistory.symbol" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const { symbolObj } = Extend;
            const { baseCurrencyName, quoteCurrencyName } = i;
            return (
              <span className="symbol-style">
                {baseCurrencyName}
                <span>/{quoteCurrencyName}</span>
              </span>
            );
          },
        },
        {
          key: 'side',
          dataIndex: 'side',
          width: 60,
          title: <M id="orderHistory.side" className="text-no-wrap" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const status = {
              '66': { label: <M id="orderHistory.buy" />, color: '#44cb9c' },
              '83': { label: <M id="orderHistory.sell" />, color: '#f27762' },
            };
            return (
              <span style={{ color: (status[v] || {}).color }}>
                {(status[v] || {}).label}
              </span>
            );
          },
        },
        {
          key: 'price',
          dataIndex: 'price',
          width: 100,
          title: <M id="orderHistory.execPrice" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            return (
              <div className="order-table-cell">
                <span className="text-no-wrap">
                  {(`${i.type}` === '77' && <M id="orderHistory.bestExec" />) ||
                    v}
                </span>
                {/* <span className="text-no-wrap">
                  {`${i.type}` === '77' ? '' : i.quoteCurrencyName}
                </span> */}
              </div>
            );
          },
        },
        {
          key: 'quantity',
          dataIndex: 'quantity',
          width: 100,
          title: <M id="orderHistory.origQty" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const { symbol = {} } = Extend;
            let spanV = v;
            if (symbol.id) {
              const { lotSize = '123' } = symbol;
              spanV = (+v).toFixed(lotSize.length - 2);
            }
            return (
              <div className="order-table-cell">
                <span>{spanV}</span>
                {/* <span className="text-no-wrap">{i.baseCurrencyName}</span> */}
              </div>
            );
          },
        },
        {
          key: 'volume',
          dataIndex: 'volume',
          width: 100,
          title: <M id="tradeDetail.cje" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const { convertMap, convertMap_digital, legalTender } = Extend;
            return (
              <div className="order-table-cell">
                <span>{v}</span>
                {/* <span className="text-no-wrap">{i.quoteCurrencyName}</span> */}
              </div>
            );
          },
        },
        {
          key: 'feeQty',
          dataIndex: 'feeQty',
          width: 130,
          title: <M id="orderHistory.feeQty" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const { legalTender } = Extend;
            return (
              <div className="order-table-cell">
                <span>{v}</span>
                <span className="text-no-wrap">{i.feeCurrency}</span>
              </div>
            );
          },
        },
      ],
      dataSource: data,
      pagination: false,
      scrollX: 600,
    },
    loading: false,
  };
};
