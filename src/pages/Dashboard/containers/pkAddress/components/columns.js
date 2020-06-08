import { M } from 'whaleex/components';



const scrollX = 750;
const scrollY = 'none';
const getColumns = () => [
  {
    key: 'timestamp',
    dataIndex: 'timestamp',
    width: 70,
    title: <M id="pkAddress.qqsj" />,
    render: (v, i) => {
      return <span>{moment(+v).format('YYYY/MM/DD HH:mm:ss')}</span>;
    },
  },
  {
    key: 'eosAccount',
    dataIndex: 'eosAccount',
    width: 70,
    title: <M id="pkAddress.eosAcc" />,
    render: (v, i) => {
      return <span>{v || '--'}</span>;
    },
  },
  {
    key: 'deviceTag',
    dataIndex: 'deviceTag',
    width: 70,
    title: <M id="pkAddress.czx" />,
    render: (v, i) => {
      return <span>{v || '--'}</span>;
    },
  },
  {
    key: 'type',
    dataIndex: 'type',
    width: 70,
    title: <M id="pkAddress.type" />,
    render: (v, i) => {
      const map = {
        BIND: <M id="pkAddress.bind" />,
        UNBIND: <M id="pkAddress.popbind" />,
      };
      return <span>{map[v] || '--'}</span>;
    },
  },
  {
    key: 'status',
    dataIndex: 'status',
    width: 40,
    title: <M id="pkAddress.status" />,
    render: (v, i) => {
      const map = {
        SUCCESS: <M id="pkAddress.success" />,
        FAILURE: <M id="pkAddress.fail" />,
        PENDING_CONFIRM: <M id="pkAddress.sureing" />,
      };
      const color = {
        SUCCESS: '#2a4452',
        FAILURE: '#f27762',
        PENDING_CONFIRM: '#44cb9c',
      };
      const typeMap = {
        BIND: <M id="pkAddress.binding" />,
        UNBIND: <M id="pkAddress.popbinding" />,
      };
      const prefix = (v === 'PENDING_CONFIRM' && typeMap[i.type]) || '';
      return (
        <span style={{ color: color[v] }}>
          {prefix}
          {map[v]}
        </span>
      );
    },
  },
];
export { getColumns, scrollX, scrollY };
