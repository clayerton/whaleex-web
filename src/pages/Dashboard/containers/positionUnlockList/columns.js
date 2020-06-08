import { M } from 'whaleex/components';

import U from 'whaleex/utils/extends';

const scrollX = 750;
const getColumns = (that, sorter = {}) => [
  {
    key: 'timestamp',
    dataIndex: 'timestamp',
    width: 70,
    title: <M id="position.columntime" />,
    render: (v, i) => {
      return <span>{moment(+v).format('YYYY/MM/DD HH:mm')}</span>;
    },
  },
  {
    key: 'amount',
    dataIndex: 'amount',
    width: 120,
    align: 'right',
    title: <M path="position.columnprice" values={{ data: 'WAL' }} />,
    render: (v, i) => {
      return <span>{v}</span>;
    },
  },
];
export { getColumns, scrollX };
