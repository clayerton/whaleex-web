import M from 'whaleex/components/FormattedMessage';
import { Button, Modal } from 'antd';
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
/**
 * @param  {[type]} data          [本次渲染的数据]
 * @param  {Object} pagination    [本次渲染的分页]
 * @param  {[type]} that          [引用当前页面this对象，用于特定操作调用]
 * @return {[type]}               [返回{tab:{key,title,columns,dataSource,pagination,},loading}]
 */
export default (
  data,
  pagination = {
    current: 1,
    pageSize: 5,
    total: 10,
  },
  that,
  Extend
) => {
  return {
    tab: {
      key: 'openOrder',
      title: <M id="orderHistory.openOrder" />,
      columns: [
        {
          key: 'createTime',
          dataIndex: 'createTime',
          width: 130,
          title: <M id="orderHistory.time" />,
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
                          '/user/tradeDetail?tab=0&symbolId=' +
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
          width: 95,
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
          width: 55,
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
              '66': {
                label: <M id="orderHistory.buyRent" />,
                color: '#44cb9c',
              },
              '83': {
                label: <M id="orderHistory.sellRent" />,
                color: '#f27762',
              },
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
          title: <M id="orderHistory.rate" />,
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
                    U.getPercentFormat(v)}
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
          width: 90,
          title: <M id="orderHistory.quantity" />,
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
          key: 'price_origQty',
          dataIndex: 'price_origQty',
          width: 100,
          title: <M id="orderHistory.orderVolumeInterest" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const {
              symbolObj,
              convertMap,
              convertMap_digital,
              legalTender,
            } = Extend;
            const { quoteCurrency } = symbolObj[i.symbolId] || {};
            return (
              <div className="order-table-cell">
                <span>{(i.price * i.origQty || 0).toFixed(2)}</span>
                {/* <span className="text-no-wrap">{quoteCurrency}</span> */}
              </div>
            );
          },
        },
        {
          key: 'execQty',
          dataIndex: 'execQty',
          width: 120,
          title: <M id="orderHistory.execVolume" />,
          render: (v, i, idx) => {
            if (idx === 100) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
            const {
              symbolObj,
              convertMap,
              convertMap_digital,
              legalTender,
            } = Extend;
            const { quoteCurrency, baseCurrency } = symbolObj[i.symbolId] || {};
            return (
              <div className="order-table-cell">
                <span>{v || 0}</span>
                {/* <span>{(v * convertMap_digital[quoteCurrency]*convertMap['EOS'] || 0).toFixed(2)}</span> */}
                {/* <span className="text-no-wrap">{baseCurrency}</span> */}
              </div>
            );
          },
        },
        {
          key: 'operation',
          dataIndex: 'operation',
          width: 65,
          title: <M id="orderHistory.operation" className="text-no-wrap" />,
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
              <Button
                className="operation-btn"
                onClick={() => {
                  const { origQty, execQty, side } = i;
                  const { symbolObj } = Extend;
                  const { baseCurrency, quoteCurrency } =
                    symbolObj[i.symbolId] || {};
                  const {
                    intl: { formatMessage },
                  } = Extend;
                  const map = {
                    '66': quoteCurrency, //buy
                    '83': baseCurrency, //sell
                  };
                  if (+execQty > 0) {
                    confirm({
                      title: null,
                      content: formatMessage(
                        { id: 'tradeDetail.just' },
                        { coin: map[side] }
                      ),
                      onOk() {
                        that.props.cancelDelegate({ orderId: i.orderId });
                      },
                      onCancel() {},
                      className: 'cancel-confirm',
                    });
                  } else {
                    that.props.cancelDelegate({ orderId: i.orderId });
                  }
                }}
                size="small"
              >
                <M id="orderHistory.opCancel" />
              </Button>
            );
          },
        },
      ],
      dataSource: data,
      pagination: false,
      scrollX: 750,
    },
    loading: false,
  };
};
