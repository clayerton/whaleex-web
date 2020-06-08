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
    current: 2,
    pageSize: 5,
    total: 16,
  },
  that,
  Extend
) => {
  return {
    tab: {
      key: 'historyOrder',
      title: <M id="orderHistory.historyOrder" />,
      columns: [
        {
          key: 'createTime',
          dataIndex: 'createTime',
          width: 130,
          title: <M id="orderHistory.orderTime" />,
          render: (v, i, idx) => {
            if (idx === 100) {
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
                          '/user/tradeDetail?tab=1&symbolId=' +
                            (i.symbolId || '0'),
                        ].join('')
                      );
                    }}
                  >
                    <M id="orderHistory.more" />
                  </a>
                ),
                props: {
                  colSpan: 8,
                },
              };
            }
            return (
              <span className="text-no-wrap">
                {moment(+v).format('YY/MM/DD HH:mm:ss')}
              </span>
            );
          },
        },
        {
          key: 'symbolId',
          dataIndex: 'symbolId',
          width: 90,
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
            const { baseCurrency, quoteCurrency } = symbolObj[i.symbolId] || {};
            return (
              <span className="symbol-style">
                {baseCurrency}
                <span>/{quoteCurrency}</span>
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
          key: 'type',
          dataIndex: 'type',
          width: 70,
          title: <M id="orderHistory.orderType" className="text-no-wrap" />,
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
              '76': { label: <M id="orderHistory.limit" /> },
              '77': { label: <M id="orderHistory.market" /> },
            };
            return <span>{(status[v] || {}).label}</span>;
          },
        },
        {
          key: 'price',
          dataIndex: 'price',
          width: 120,
          title: <M id="orderHistory.price" />,
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
            const { quoteCurrency } = symbolObj[i.symbolId] || {};
            return (
              <div className="order-table-cell">
                <span className="text-no-wrap">
                  {(`${i.type}` === '77' && <M id="orderHistory.bestExec" />) ||
                    v}
                </span>
                {/* <span className="text-no-wrap">
                  {`${i.type}` === '77' ? '' : quoteCurrency}
                </span> */}
              </div>
            );
          },
        },
        {
          key: 'origQty',
          dataIndex: 'origQty',
          width: 110,
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
            const { symbolObj } = Extend;
            const { baseCurrency, lotSize = '123' } =
              symbolObj[i.symbolId] || {};
            return (
              <div className="order-table-cell">
                <span>{(+v).toFixed(lotSize.length - 2)}</span>
                {/* <span className="text-no-wrap">{baseCurrency}</span> */}
              </div>
            );
          },
        },
        {
          key: 'execAvgPrice',
          dataIndex: 'execAvgPrice',
          width: 120,
          title: <M id="orderHistory.execAvgPrice" />,
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
            const { quoteCurrency } = symbolObj[i.symbolId] || {};
            return (
              <div className="order-table-cell">
                <span>
                  {(`${i.type}` === '77' && <M id="orderHistory.bestExec" />) ||
                    v}
                </span>
                {/* <span className="text-no-wrap">
                  {`${i.type}` === '77' ? '' : quoteCurrency}
                </span> */}
              </div>
            );
          },
        },
        {
          key: 'status',
          dataIndex: 'status',
          width: 65,
          title: <M id="orderHistory.status" />,
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
              '83': { label: <M id="orderHistory.done" /> },
              '67': { label: <M id="orderHistory.ordering" /> },
              '88': { label: <M id="orderHistory.cancel" /> },
              '80': { label: <M id="orderHistory.cancel" /> },
            };
            if (v === '88' && i.origQty !== i.execQty && i.execQty !== '0') {
              return (
                <span>
                  <M id="orderHistory.ecancel" />
                </span>
              );
            } else {
              return <span>{(status[v] || {}).label}</span>;
            }
          },
        },
        // {
        //   key: 'operation',
        //   dataIndex: 'operation',
        //   width: 70,
        //   title: '操作',
        //   render: (v, i,idx) => {
        //     return (
        //       <span
        //         onClick={() => {
        //         }}
        //       >
        //         详情
        //       </span>
        //     );
        //   },
        // },
      ],
      dataSource: data,
      pagination: false,
      scrollX: 810,
    },
    loading: false,
  };
};
