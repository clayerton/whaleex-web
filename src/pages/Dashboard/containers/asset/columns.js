import { M, Coin } from 'whaleex/components';
import { Tooltip } from 'antd';
import U from 'whaleex/utils/extends';
import { preCondition } from 'whaleex/components/preconditions';
const text1 = (
  <span className="title_tip">
    <M id="asset.text1" />
  </span>
);
const text4 = that => {
  const { eosConfig } = that.props;
  const { mineReleasePercent, releasePercent } = eosConfig.result.mineConfig;
  return (
    <span className="title_tip">
      <M
        id="position.tipsList"
        values={{
          percent1: U.percentNumber(mineReleasePercent).join(''),
          percent2: U.percentNumber(releasePercent).join(''),
        }}
        richFormat
      />
    </span>
  );
};

const scrollX = 750;
const getColumns = (that, sorter = {}) => [
  {
    key: 'shortName',
    dataIndex: 'shortName',
    width: 150,
    title: <M id="asset.coin" />,
    sorter: (a, b) => {
      return (
        a.shortName
          .slice(0, 1)
          .toUpperCase()
          .charCodeAt() -
        b.shortName
          .slice(0, 1)
          .toUpperCase()
          .charCodeAt()
      );
    },
    sortOrder: sorter.columnKey === 'shortName' && sorter.order,
    render: (v, i) => {
      const { icon } = i;
      return (
        <span className="asset-table-shortName">
          <Coin icon={icon} />
          <span>{v}</span>
        </span>
      );
    },
  },
  {
    key: 'totalAmount',
    dataIndex: 'totalAmount',
    width: 120,
    title: <M id="asset.totalAmount" />,
    render: (v, i) => {
      const { privatePlacement } = i;
      return (
        <span className="asset-table-total">
          {v}
          {(i.shortName === 'WAL' && privatePlacement > 0 && (
            <Tooltip
              placement="top"
              title={
                <M id="position.private" values={{ num: privatePlacement }} />
              }
            >
              <i
                className="iconfont icon-account_simu_M"
                style={{
                  color: '#ffb600',
                  position: 'relative',
                  top: '-2px',
                }}
              />
            </Tooltip>
          )) ||
            null}
        </span>
      );
    },
  },
  {
    key: 'availableAmount',
    dataIndex: 'availableAmount',
    width: 120,
    title: <M id="asset.available" />,
    render: (v, i) => {
      return <span className="asset-table-total">{v}</span>;
    },
  },
  {
    key: 'stakeAmount',
    dataIndex: 'stakeAmount',
    width: 120,
    title: <M id="position.lock" />,
    render: (v, i) => {
      return <span className="asset-table-total">{v}</span>;
    },
  },
  {
    key: 'fixedAmount',
    dataIndex: 'fixedAmount',
    width: 120,
    title: (
      <span>
        <M id="asset.fixedAmount" />{' '}
        <Tooltip placement="top" className="title_tip" title={text4(that)}>
          <i className="iconfont icon-ArtboardCopy7" />
        </Tooltip>
      </span>
    ),
    render: (v, i) => {
      const { shortName } = i;
      const linkActive = v > 0;
      return (
        <span
          style={{ width: '100%', display: 'inline-block' }}
          className="asset-table-frozen"
          onClick={
            linkActive &&
            that.urlJump(
              '/assetAction/depowith?assetType=fixedAsset&currency=' + shortName
            )
          }
        >
          <span
            style={
              linkActive
                ? {
                    cursor: 'pointer',
                    color: '#87adc3',
                    width: '100%',
                    display: 'inline-block',
                  }
                : {}
            }
          >
            {v || '0'}
          </span>
        </span>
      );
    },
  },
  {
    key: 'frozenAmount',
    dataIndex: 'frozenAmount',
    width: 120,
    title: (
      <span>
        <M id="asset.frozen" />
        <Tooltip placement="top" className="title_tip" title={text1}>
          <i className="iconfont icon-ArtboardCopy7" />
        </Tooltip>
      </span>
    ),
    render: (v, i) => {
      const { id } = i;
      const { currencyListObj } = that.props;
      return (
        <span className="asset-table-frozen">
          {U.symbolNumber(v, currencyListObj[id].precision)}
        </span>
      );
    },
  },
  {
    key: 'convert_digital',
    dataIndex: 'convert_digital',
    width: 120,
    title: <M id="asset.value" values={{ digital: that.props.legaldigital }} />,
    sorter: (a, b) => {
      return (a.convert_digital || 0) - (b.convert_digital || 0);
    },
    sortOrder: sorter.columnKey === 'convert_digital' && sorter.order,
    render: (v, i) => {
      const { convert_digital = 0 } = i;
      const { legaldigital, currencyListObj } = that.props;
      return (
        <span className="asset-table-convert_digital">
          {U.symbolNumber(
            convert_digital,
            _.get(currencyListObj, `${legaldigital}.precision`)
          )}
        </span>
      );
    },
  },
  {
    key: 'operation',
    dataIndex: 'operation',
    width: 100,
    title: <M id="asset.operation" />,
    align: 'right',
    render: (v, i) => {
      const { history, app, publicSymbol = [] } = that.props;
      const { depositEnable, withdrawEnable, status, shortName } = i;
      const curSymbol =
        publicSymbol.filter(({ baseCurrency, quoteCurrency }) => {
          return baseCurrency === shortName || quoteCurrency === shortName;
        })[0] || {};
      const { enable, baseCurrency, quoteCurrency } = curSymbol;
      if (i.shortName.includes('CPU')) {
        return (
          <div className="asset-table-operation">
            <span
              className="text-no-wrap"
              onClick={() => {
                that.urlJump(`/user/tradeDetail?partition=CPU`)();
              }}
            >
              <M id="cpuRent.more" />
            </span>
          </div>
        );
      }
      if (status !== 'ON') {
        return (
          <span className="asset-table-operation down">
            <M id="asset.down" />
          </span>
        );
      }
      return (
        <div className="asset-table-operation">
          {depositEnable && (
            <span
              id="deposit"
              className="text-no-wrap"
              onClick={() => {
                _czc.push([
                  '_trackEvent',
                  '我的资产-充币',
                  '点击',
                  i.shortName,
                ]);
                preCondition(
                  'deposit',
                  app,
                  history,
                  { superProps: that.props, actions: that.props.actions },
                  that.urlJump(`/assetAction/deposit/${i.shortName}`)
                )();
              }}
            >
              <M id="asset.deposit" />
            </span>
          )}
          {withdrawEnable && (
            <span
              id="withdraw"
              className="text-no-wrap"
              onClick={() => {
                _czc.push([
                  '_trackEvent',
                  '我的资产-提币',
                  '点击',
                  i.shortName,
                ]);
                preCondition(
                  'withdraw',
                  app,
                  history,
                  { superProps: that.props, actions: that.props.actions },
                  that.urlJump(`/assetAction/withdraw/${i.shortName}`)
                )();
              }}
            >
              <M id="asset.withdraw" />
            </span>
          )}
          <span
            className="text-no-wrap"
            onClick={() => {
              enable &&
                that.urlJump(`/trade/${baseCurrency}_${quoteCurrency}`)();
            }}
            style={{ color: (enable && '#87adc3') || '#dcdcdc' }}
          >
            <M id="asset.trade" />
          </span>
        </div>
      );
    },
  },
];
export { getColumns, scrollX };
