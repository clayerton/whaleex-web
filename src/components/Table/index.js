import React from 'react';
import PropTypes from 'prop-types';

import U from 'whaleex/utils/extends';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import { Table } from 'antd';
import './style.less';

export default class TableCustom extends React.Component {
  shouldComponentUpdate(nextProps) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'dataSource',
        'loading',
        'pagination',
        'sorter',
        'expandedRowKeys',
        'superProps',
      ]
    );
    // 这里不用columns 似乎由函数产生的columns永远都会变化
    if (isChanged || _.isEmpty(nextProps.dataSource)) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    const { callBacks } = this.props;
    if (!_.isEmpty(callBacks)) {
      const tableDom = ReactDOM.findDOMNode(this.table);
      const tableBody = tableDom.querySelector('.ant-table-body');
      tableBody.addEventListener('scroll', () => {
        if (
          tableBody.scrollHeight - Math.round(tableBody.scrollTop) ===
          tableBody.clientHeight
        ) {
          callBacks.nextPage();
        }
      });
    }
  }
  render() {
    const {
      columns,
      dataSource,
      scroll,
      pagination,
      loading,
      onChange,
      expandedRowRender,
      expandedRowKeys = [],
    } = this.props;
    return (
      <Table
        ref={thisTable => (this.table = thisTable)}
        rowKey={row => {
          if (row.uninId !== undefined) {
            return row.uninId;
          }
          return `${uuidv4()}-${row.id}`;
        }}
        scroll={scroll}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
        expandedRowKeys={expandedRowKeys}
        expandedRowRender={expandedRowRender}
      />
    );
  }
}

TableCustom.PropTypes = {};
