import M from 'whaleex/components/FormattedMessage';
export const getColumns = (config = {}, isCpuSymbol) => {
  const { base, quote, lotSize } = config;
  return [
    {
      key: 'timestamp',
      dataIndex: 'timestamp',
      title: <M id="tradeHistory.time" />,
      flex: 1.5,
      render: (v, i, idx) => {
        return <span>{moment(+v).format('HH:mm:ss')}</span>;
      },
    },
    {
      key: 'bidAsk',
      dataIndex: 'bidAsk',
      title: <M id="tradeHistory.way" />,
      flex: 1,
      render: (v, i, idx) => {
        let color1 = (v === 'B' && '#f27762') || '#44cb9c';
        if (isCpuSymbol) {
          return (
            <span style={{ color: color1 }}>
              {v === 'B' ? (
                <M id="orderHistory.sellRent" />
              ) : (
                <M id="orderHistory.buyRent" />
              )}
            </span>
          );
        }
        return (
          <span style={{ color: color1 }}>
            {v === 'B' ? (
              <M id="orderHistory.sell" />
            ) : (
              <M id="orderHistory.buy" />
            )}
          </span>
        );
      },
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: (isCpuSymbol && <M id="orderHistory.rate" />) || (
        <M id="tradeHistory.price" values={{ unit: quote || '' }} />
      ),
      flex: 2,
      render: (v, i, idx) => {
        const { price, same } = i;
        //let color1 = (+price < 0 && '#f27762') || '#44cb9c';
        if (isCpuSymbol) {
          return <span>{U.getPercentFormat(Math.abs(v))}</span>;
        }
        return <span>{Math.abs(v)}</span>;
      },
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: (
        <M
          id="tradeHistory.quantity"
          values={{ unit: (isCpuSymbol && 'EOS') || base || '' }}
        />
      ),
      flex: 3,
      textAlign: 'right',
      render: (v, i, idx) => {
        return <span>{(+v).toFixed(lotSize.length - 2)}</span>;
      },
    },
  ];
};
