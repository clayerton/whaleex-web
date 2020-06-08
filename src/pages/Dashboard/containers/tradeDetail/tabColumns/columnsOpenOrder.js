import M from 'whaleex/components/FormattedMessage';
import { Button, Modal } from 'antd';
const confirm = Modal.confirm;
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
          key: 'side',
          dataIndex: 'side',
          width: 70,
          title: (
            <span style={{ paddingLeft: '10px' }}>
              <M id="orderHistory.side" className="text-no-wrap" />
            </span>
          ),
          render: (v, i) => {
            const status = {
              '66': { label: <M id="orderHistory.buy" />, color: '#44cb9c' },
              '83': { label: <M id="orderHistory.sell" />, color: '#f27762' },
            };
            return (
              <span style={{ color: status[v].color, paddingLeft: '10px' }}>
                {status[v].label}
              </span>
            );
          },
        },
        {
          key: 'createTime',
          dataIndex: 'createTime',
          width: 80,
          title: <M id="orderHistory.time" />,
          render: (v, i) => {
            return <span>{moment(+v).format('HH:mm:ss')}</span>;
          },
        },
        {
          key: 'symbolId',
          dataIndex: 'symbolId',
          width: 100,
          title: <M id="orderHistory.symbol" />,
          render: (v, i) => {
            const { symbolObj } = Extend;
            const { baseCurrency, quoteCurrency } = symbolObj[i.symbolId];
            return (
              <span className="symbol-style">
                {baseCurrency}
                <span>/{quoteCurrency}</span>
              </span>
            );
          },
        },
        {
          key: 'price',
          dataIndex: 'price',
          width: 120,
          title: <M id="orderHistory.price2" />,
          render: (v, i) => {
            const { symbolObj } = Extend;
            const { quoteCurrency } = symbolObj[i.symbolId];
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
          width: 100,
          title: <M id="orderHistory.quantity" />,
          render: (v, i) => {
            const { symbolObj } = Extend;
            const { baseCurrency, lotSize } = symbolObj[i.symbolId];
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
          width: 120,
          title: <M id="orderHistory.orderVolume" />,
          render: (v, i) => {
            const { symbolObj, legalTender } = Extend;
            const { quoteCurrency } = symbolObj[i.symbolId];
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
          render: (v, i) => {
            const { symbolObj, legalTender } = Extend;
            const { quoteCurrency, baseCurrency } = symbolObj[i.symbolId];
            return (
              <div className="order-table-cell">
                <span>{v || 0}</span>
                {/* <span className="text-no-wrap">{baseCurrency}</span> */}
              </div>
            );
          },
        },
        {
          key: 'operation',
          dataIndex: 'operation',
          width: 70,
          title: <M id="orderHistory.operation" className="text-no-wrap" />,
          render: (v, i) => {
            return (
              <Button
                className="operation-btn"
                onClick={() => {
                  const { origQty, execQty, side } = i;
                  const { symbolObj } = Extend;
                  const { baseCurrency, quoteCurrency } = symbolObj[i.symbolId];
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
      pagination,
      scrollX: 790,
      scrollY: 600,
    },
    loading: Extend.tabLoading,
  };
};
