import { Select } from 'antd';
import styled from 'styled-components';
import M from 'whaleex/components/FormattedMessage';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const StyledSelect = styled(Select)`
  * {
    border: none !important;
    box-shadow: none !important;
  }
`;
const Option = Select.Option;
export const getColumnsHeader = (that, isCpuSymbol) => [
  {
    key: 'showIdx',
    dataIndex: 'showIdx',
    className: 'show-filter',
    flex: 1.5,
    titleRender: (filter, setFilter) => {
      return (
        <StyledSelect
          defaultValue={filter['showIdx']}
          style={{ width: 100 }}
          onChange={value => setFilter('showIdx', value)}
          className="show-filter-select"
        >
          {filter.showList.map(({ key, label }, idx) => {
            return (
              <Option value={key} key={idx}>
                {label}
              </Option>
            );
          })}
        </StyledSelect>
      );
    },
  },
  {
    key: 'accuracyIdx',
    dataIndex: 'accuracyIdx',
    flex: 2,
    titleRender: (filter, setFilter) => {
      if (isCpuSymbol) {
        let list = filter.accuracyList || [];
        return <div>{list[list.length - 1].label}</div>;
      }
      return (
        <StyledSelect
          defaultValue={filter['accuracyIdx']}
          value={filter['accuracyIdx']}
          style={{ width: 100 }}
          onChange={value => setFilter('accuracyIdx', value)}
        >
          {filter.accuracyList.map(({ key, label }, idx) => {
            return (
              <Option value={key} key={idx}>
                {label}
              </Option>
            );
          })}
        </StyledSelect>
      );
    },
  },
  {
    key: 'more',
    dataIndex: 'more',
    flex: 1.5,
    titleRender: () => {
      return (
        <span
          style={{ paddingRight: '9px' }}
          onClick={() => {
            const { symbol } = that.props;
            const { quoteCurrency, baseCurrency } = symbol;
            that.props.history.push(
              [
                BASE_ROUTE,
                prefix,
                `/trade/orderBook/${baseCurrency}_${quoteCurrency}`,
              ].join('')
            );
          }}
        >
          <M id="orderBook.more" />
        </span>
      );
    },
  },
];
export const getColumns = ({ base, quote, isCpuSymbol }) => {
  return [
    {
      key: 'price',
      dataIndex: 'price',
      title: (!isCpuSymbol && (
        <M id="orderBook.price" values={{ unit: quote }} />
      )) || <M id="trade.cpuInterest" />,
      flex: 2,
      render: (v, i, idx) => {
        const { orderIdx, same } = i;
        let color1 = (+orderIdx < 0 && '#f27762') || '#44cb9c';
        if (isCpuSymbol) {
          return (
            <span style={{ color: color1 }}>
              {(v && `${(v * 100).toFixed(2)}%`) || '--'}
            </span>
          );
        }
        if (same) {
          let color2 =
            (+orderIdx < 0 && 'rgb(242, 119, 98, 0.5)') ||
            'rgba(68, 203, 156, 0.5)';
          return (
            <span style={{ color: color1 }}>
              <span style={{ color: color2 }}>{v.slice(0, -2)}</span>
              {v.slice(-2)}
            </span>
          );
        }
        return <span style={{ color: color1 }}>{v || '--'}</span>;
      },
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: (
        <M
          id="orderBook.quantity"
          values={{ unit: (!isCpuSymbol && base) || 'EOS' }}
        />
      ),
      flex: 2,
      textAlign: 'right',
      render: (v, i, idx) => {
        return <span>{v || '--'}</span>;
      },
    },
    {
      key: 'orderIdx',
      dataIndex: 'orderIdx',
      title: <M id="orderBook.order" />,
      flex: 1,
      textAlign: 'right',
      render: (v, i, idx) => {
        return (
          <span
            style={{ color: '#99ACB6', paddingRight: '10px' }}
            className="text-no-wrap"
          >
            {(v > 0 && (
              <M id="orderBook.buy" values={{ idx: Math.abs(v) }} />
            )) || <M id="orderBook.sell" values={{ idx: Math.abs(v) }} />}
          </span>
        );
      },
    },
    {
      key: 'rate',
      dataIndex: 'rate',
      title: '',
      styleFuc: v => {
        const color = (v > 0 && 'rgb(233,245,238)') || 'rgb(250,227,221)';
        return {
          color: '#ffeeee',
          position: 'absolute',
          right: 0,
          backgroundColor: color,
          width: `${(2 / 3) * Math.abs(v) * 90}%`,
          overflow: 'hidden',
          zIndex: 0,
          height: '100%',
          padding: 0,
        };
      },
      render: (v, i, idx) => {
        return <span />;
      },
    },
  ];
};
