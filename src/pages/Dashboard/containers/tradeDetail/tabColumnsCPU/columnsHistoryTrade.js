import { M } from 'whaleex/components';
import { Button } from 'antd';
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
          width: 120,
          title: <M id="orderHistory.orderTime" />,
          render: (v, i) => {
            return <span>{moment(+v).format('YY/MM/DD HH:mm:ss')}</span>;
          },
        },
        {
          key: 'symbolId',
          dataIndex: 'symbolId',
          width: 90,
          title: <M id="orderHistory.symbol" />,
          render: (v, i) => {
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
          render: (v, i) => {
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
              <span style={{ color: status[v].color }}>{status[v].label}</span>
            );
          },
        },
        {
          key: 'price',
          dataIndex: 'price',
          width: 100,
          title: <M id="orderHistory.execRate" />,
          render: (v, i) => {
            return (
              <div className="order-table-cell">
                <span className="text-no-wrap">
                  {(`${i.type}` === '77' && <M id="orderHistory.bestExec" />) ||
                    U.getPercentFormat(v)}
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
          title: <M id="orderHistory.dealQty" />,
          render: (v, i) => {
            const { symbol = {} } = Extend;
            let spanV = v;
            if (symbol.id) {
              const { lotSize } = symbol;
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
          title: <M id="orderHistory.execPay" />,
          render: (v, i) => {
            const {
              convertMap = {},
              convertMap_digital = {},
              legalTender,
            } = Extend;
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
          width: 100,
          title: <M id="orderHistory.feeQty" />,
          render: (v, i) => {
            const { legalTender } = Extend;
            return (
              <div className="order-table-cell">
                <span>{v}</span>
                <span className="text-no-wrap">EOS</span>
              </div>
            );
          },
        },
        {
          key: 'operation',
          dataIndex: 'operation',
          width: 80,
          title: <M id="orderHistory.operation" className="text-no-wrap" />,
          render: (v, i) => {
            return (
              <Button
                className="operation-btn"
                onClick={that.props.urlJump(
                  `/stepPage/${(`${i.side}` === '66' && 'cpuBuy') ||
                    'cpuSell'}/${i.execId}`
                )}
                size="small"
              >
                <M id="orderHistory.chainStatus" />
              </Button>
            );
          },
        },
      ],
      dataSource: data,
      pagination,
      scrollX: 750,
      scrollY: 600,
    },
    loading: Extend.tabLoading,
  };
};
