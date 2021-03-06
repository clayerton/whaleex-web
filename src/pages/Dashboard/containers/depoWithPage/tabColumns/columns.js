import M from 'whaleex/components/FormattedMessage';
import { Coin } from 'whaleex/components';
import { formatTime } from 'whaleex/utils/date';

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
      key: 'tabWithdraw',
      title: <M id="asset.tabWithdraw" />,
      columns: [
        {
          key: 'timestamp',
          dataIndex: 'timestamp',
          width: 120,
          title: <M id="asset.timestamp" />,
          render: (v, i) => {
            const { timestamp, createTime } = i;
            return (
              <span className="depoWithList-table-createTimestamp">
                {formatTime(timestamp || createTime, '0/0/0 0:0:0')}
              </span>
            );
          },
        },
        {
          key: 'currency',
          dataIndex: 'currency',
          width: 80,
          title: <M id="asset.currency" />,
          render: (v, i) => {
            const { currencyListObj } = Extend;
            const { currencySelect } = that.state;
            const { currencyId } = i;
            return (
              <span className="depoWithList-table-currency">
                {(!_.isEmpty(currencyListObj) && (
                  <Coin icon={(currencyListObj[currencySelect] || {}).icon} />
                )) || <span />}
                <span>{currencySelect}</span>
              </span>
            );
          },
        },
        {
          key: 'reason',
          dataIndex: 'reason',
          width: 80,
          title: <M id="asset.reason" />,
          render: (v, i) => {
            const reasonMap = {
              DEPOSIT: <M id="reasonMap.deposit" />,
              AIRDROP: <M id="reasonMap.airdrop" />,
              WITHDRAW: <M id="reasonMap.withdraw" />,
              MINE: <M id="reasonMap.mine" />,
              REBATE: <M id="reasonMap.rebate" />,
              INVITE: <M id="reasonMap.invite" />,
              REGISTER: <M id="reasonMap.register" />,
              GROUP: <M id="reasonMap.group" />,
              RECEIVE: <M id="reasonMap.receive" />,
              ACTIVITY: <M id="reasonMap.activity" />,
            };
            let color = (v === 'DEPOSIT' && '#f27762') || '#44cb9c';
            return (
              <span className="depoWithList-table-reason" style={{ color }}>
                {reasonMap[v]}
              </span>
            );
          },
        },
        {
          key: 'amount',
          dataIndex: 'amount',
          width: 120,
          title: <M id="asset.quantity" />,
          render: (v, i) => {
            return (
              <span className="depoWithList-table-quantity">
                {v || i.totalChange}
              </span>
            );
          },
        },
        {
          key: 'status',
          dataIndex: 'status',
          width: 100,
          title: <M id="asset.status" />,
          render: (v, i) => {
            const { actionId, depositId, withdrawId } = i;
            let api = '';
            const { currencySelect } = that.state;
            if (withdrawId) {
              api = `/stepPage/withdraw_${currencySelect}/${withdrawId}`;
            } else if (depositId) {
              api = `/stepPage/deposit_${currencySelect}/${depositId}`;
            }
            //SYNC_SUCCESS
            const status = {
              SYNC_SUCCESS: { label: <M id="depoWithList.success" /> },
              SYNC_START: { label: <M id="depoWithList.doing" /> },
              SUCCESS: { label: <M id="depoWithList.doing" /> },
              START: { label: <M id="depoWithList.doing" /> }, //不需要 脏数据
              INITIAL: { label: <M id="depoWithList.doing" /> },
              WAITING: { label: <M id="depoWithList.doing" /> },
              PENDING_CONFIRM: { label: <M id="depoWithList.doing" /> },
              CONFIRMED: { label: <M id="depoWithList.doing" /> },
              BALANCE_WAITING: { label: <M id="depoWithList.doing" /> },
              BALANCE_PENDING_CONFIRM: {
                label: <M id="depoWithList.doing" />,
              },
              FAILURE: { label: <M id="depoWithList.fail" /> },
            };

            return (
              <span
                className={v + ' depoWithList-table-status'}
                onClick={() => {
                  !!v && that.urlJump(api)();
                }}
              >
                {(!!v && status[v] && status[v].label) || (
                  <M id="depoWithList.not" />
                )}
              </span>
            );
          },
        },
      ],
      dataSource: data,
      pagination,
      scrollX: 750,
      scrollY: 'none',
    },
    loading: false,
  };
};
