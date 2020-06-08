import { Table, Spin, Button } from 'antd';
import { M } from 'whaleex/components';

import { formatTime } from 'whaleex/utils/date';
math.config({ number: 'BigNumber' });
export const tableExpand = (that, isCpuSymbol) => {
  // that 是上下文
  // const {
  //   tradeDetail: {
  //     store: {
  //       execOrder: { exec },
  //     },
  //   },
  // } = that.props;
  const exec = _.get(that.props, 'tradeDetail.store.execOrder.exec', {});
  const expandFunc = record => {
    const records = _.get(
      that,
      `props.tradeDetail.store.delegatesById.${record.orderId}`,
      []
    );
    if (_.isEmpty(records)) {
      return (
        <div className="spin-center height-auto">
          <div className="spin-center height-auto">
            <Spin size="large" spinning={true} />
          </div>
        </div>
      );
    }
    const columns = [
      {
        title: <M id="tradeDetail.cjsj" />,
        dataIndex: 'timestamp',
        key: 'date',
        width: 180,
      },
      {
        title: (isCpuSymbol && <M id="tradeDetail.rate" />) || (
          <M id="tradeDetail.jg" />
        ),
        dataIndex: 'price',
        key: 'price',
        width: 120,
        render: (v, i) => {
          if (isCpuSymbol) {
            return <span>{U.getPercentFormatWithPlus(v)}</span>;
          }
          return <span>{v}</span>;
        },
      },
      {
        title: <M id="tradeDetail.sl" />,
        dataIndex: 'amount',
        key: 'state',
        width: 110,
      },
      {
        title: (isCpuSymbol && <M id="orderHistory.execPay" />) || (
          <M id="tradeDetail.cje" />
        ),
        dataIndex: 'all',
        key: 'all',
        width: 100,
      },
      {
        title: <M id="tradeDetail.sxf" />,
        dataIndex: 'fee',
        key: 'operation',
        width: 140,
      },
      {
        title: <M id="orderHistory.status" />,
        dataIndex: 'chainStatus',
        key: 'chainStatus',
        render: (v, i) => {
          const partation = i.baseCurrencyName.includes('CPU') ? true : false;
          return (
            <Button
              className="operation-btn"
              onClick={() => {
                if (partation) {
                  that.urlJump(
                    `/stepPage/${(`${i.side}` === '66' && 'cpuBuy') ||
                      'cpuSell'}/${exec}`
                  )();
                } else {
                  that.urlJump(`/stepPage/eos/${exec}`)();
                }
              }}
              size="small"
            >
              <M id="orderHistory.chainStatus" />
            </Button>
          );
        },
      },
    ];

    const data = [];
    records.forEach((v, i) => {
      let record = {
        ...v,
        key: i,
        timestamp: formatTime(v.timestamp, '0/0/0 0:0:0'),
        price: v.price,
        amount: v.quantity,
        all: math.eval(`${v.quantity} * ${v.price}`) + '',
        fee: `${v.feeQty} ${v.feeCurrency}`,
      };
      data.push(record);
    });
    return (
      <div className="components-table-demo-nested ant-table-row">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="ant-table-row"
        />
      </div>
    );
  };
  return expandFunc;
};
