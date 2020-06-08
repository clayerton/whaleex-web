import { M } from 'whaleex/components';
import _ from 'lodash';
import U from 'whaleex/utils/extends';

const scrollX = 750;
const getColumns = that => [
  {
    key: 'timestamp',
    dataIndex: 'timestamp',
    width: 120,
    title: <M id="position.time" />,
    render: (v, i) => {
      return (
        <span className="font1">
          {moment(+v).format('YYYY/MM/DD HH:mm:ss')}
        </span>
      );
    },
  },
  {
    key: 'type',
    dataIndex: 'type',
    width: 120,
    title: <M path="position.type" />,
    render: (v, i) => {
      const { store } = that.props;
      const { fixedType = [] } = store;
      // const map = {
      //   INVITE: <M id="position.INVITE" />,
      //   REBATE: <M id="position.REBATE" />,
      //   REGISTER: <M id="position.REGISTER" />,
      //   MINE: <M id="position.TRADE" />,
      //   RECEIVE: <M id="position.RECEIVE" />,
      //   GROUP: <M id="position.GROUP" />,
      //   ACTIVITY: <M id="reasonMap.activity" />,
      // };
      return (
        <span className="font2">
          {(_.find(fixedType, ['reason', v]) || {}).i18n || '--'}
        </span>
      );
    },
  },
  {
    key: 'amount',
    dataIndex: 'amount',
    width: 70,
    align: 'right',
    title: <M path="position.amount" values={{ data: 'WAL' }} />,
    render: (v, i) => {
      return <span>{v}</span>;
    },
  },
];
export { getColumns, scrollX };
