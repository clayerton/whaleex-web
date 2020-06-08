import M from 'whaleex/components/FormattedMessage';
import { Icon, Tooltip } from 'antd';

const mineData = that => {
  const { formatNumber, store, publicSymbolObj = {} } = that.props;
  return [
    {
      title: <M id="homePage.mineTab1symbol" />,
      dataIndex: 'symbolId',
      render: (v, i) => {
        const { baseCurrency, quoteCurrency } = publicSymbolObj[v] || {};
        return (
          <span className="symbol-style">
            {baseCurrency}
            <span>/{quoteCurrency}</span>
          </span>
        );
      },
    },
    {
      title: <M id="homePage.mineTab1outputYesterday" />,
      dataIndex: 'yesterdayAmount',
      render: (v, i) => {
        return formatNumber(v || 0);
      },
    },
    {
      title: <M id="homePage.mineTab1output" />,
      dataIndex: 'todayAmount',
      render: (v, i) => {
        return formatNumber(v || 0);
      },
    },
    {
      title: <M id="homePage.mineTab1outputAll" />,
      dataIndex: 'accumulateAmount',
      align: 'right',
      render: (v, i, idx) => {
        return formatNumber(v || 0);
      },
    },
  ];
};
const mineHistoryData = that => {
  const { formatNumber } = that.props;
  return [
    {
      title: <M id="homePage.mineTab2time" />,
      dataIndex: 'timestamp',
      render: (v, i) => {
        return <span>{moment(+v).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: <M id="homePage.mineTab2output" />,
      dataIndex: 'amount',
      render: (v, i, idx) => {
        const { feeDetails } = i;
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              !_.isEmpty(feeDetails) && that.onExpand(idx);
            }}
          >
            {formatNumber(v || 0)}{' '}
            {!_.isEmpty(feeDetails) && <Icon type="down" />}
          </span>
        );
      },
    },
    {
      title: <M id="homePage.mineTab2convertInto" />,
      dataIndex: 'fee2EOS',
      render: (v, i) => {
        return formatNumber(v || 0);
      },
    },
    // {
    //   title: <M id="homePage.mineTab2outputList" />,
    //   dataIndex: 'mineTab2outputList',
    //   render: (v, i) => {
    //     return v;
    //   },
    // },
  ];
};
const mineBackData = that => {
  // const { mineBackData } = mineData;
  const list = _.get(that.props, `mineData.mineBackData.list`);
  // const {
  //   buybackOwnAmount,
  //   buybackUseAmount,
  //   noneWalAssetAmount,
  //   repoFundInputAmount,
  //   repoFundTotalAmount,
  //   repoTime,
  //   walAssetAmount,
  // } = list;
  return [
    {
      title: <M id="homePage.mineTab3backDate" />,
      dataIndex: 'repoTime',
      render: (v, i, idx) => {
        return moment(+v).format('YYYY/MM/DD');
      },
    },
    {
      title: <M id="homePage.mineTab3backQuantity" />,
      dataIndex: 'repoFundInputAmount',
    },
    {
      title: <M id="homePage.mineTab3backMount" />,
      dataIndex: 'repoFundTotalAmount',
    },
    {
      title: <M id="homePage.mineTab3WelMount" />,
      dataIndex: 'walAssetAmount',
    },
    {
      title: <M id="homePage.mineTab3NoWel" />,
      dataIndex: 'noneWalAssetAmount',
    },
    {
      title: (
        <div>
          <M id="homePage.mineTab3TodayBack" />
          <Tooltip placement="top" title={<M id="homePage.backText" />}>
            <i
              className="iconfont icon-ArtboardCopy7"
              style={{ cursor: 'pointer', paddingLeft: '5px' }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'buybackUseAmount',
    },
    {
      title: <M id="homePage.mineTab3TodayBackQuality" />,
      align: 'right',
      dataIndex: 'buybackOwnAmount',
      render: (v, i, idx) => {
        const { repoTime } = i;
        return (
          <span
            className="text-no-wrap"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              //TODO 调用一个action  请求数据 （`mineBackData_${idx}`,repoTime(startTime)）
              that.props.getBackMineDetailData({
                startTime: repoTime,
                key: `mineBackData_${idx}`,
              });
              that.onExpand(idx);
            }}
          >
            {v}
            <Icon type="down" />
          </span>
        );
      },
    },
  ];
};
const mineUserData = that => {
  const { formatNumber } = that.props;
  return [
    {
      title: <M id="homePage.mineTab4Date" />,
      dataIndex: 'timestamp',
      render: (v, i) => {
        return <span>{moment(+v).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: <M id="homePage.mineTab4Reward" />,
      dataIndex: 'mineAmount',
      align: 'center',
      render: (v, i, idx) => {
        const { feeDetails } = i;
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              !_.isEmpty(feeDetails) && that.onExpand(idx);
            }}
          >
            {formatNumber(v || 0)}{' '}
            {!_.isEmpty(feeDetails) && <Icon type="down" />}
          </span>
        );
      },
    },
    {
      title: <M id="homePage.mineTab2convertInto" />,
      dataIndex: 'fee2EOS',
      align: 'center',
      render: (v, i) => {
        return v !== undefined ? formatNumber(v) : '--';
      },
    },
    {
      title: <M id="homePage.mineTab4lastDay" />,
      dataIndex: 'balanceTime',
      align: 'right',
      render: (v, i) => {
        const { balanceTime } = i;
        return (
          <span>
            {(!+balanceTime && '--') || moment(+v).format('YYYY/MM/DD')}
          </span>
        );
      },
    },
  ];
};
export const tabKey = formatMessage => ({
  wal: [
    { label: formatMessage({ id: 'homePage.mineData' }), key: 'mineData' },
    {
      label: formatMessage({ id: 'homePage.mineHistoryData' }),
      key: 'mineHistoryData',
    },
    {
      label: formatMessage({ id: 'homePage.mineBackData' }),
      key: 'mineBackData',
    },
  ],
  user: [
    {
      label: formatMessage({ id: 'homePage.mineUserData' }),
      key: 'mineUserData',
    },
  ],
});
export default {
  mineData,
  mineBackData,
  mineUserData,
  mineHistoryData,
};
