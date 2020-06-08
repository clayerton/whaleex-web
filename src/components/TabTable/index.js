import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Modal, Button } from 'antd';

import { Table, M, Switch } from 'whaleex/components';
import styled from 'styled-components';
const TabPane = Tabs.TabPane;

import './style.less';
export default class TabTable extends React.Component {
  constructor(props) {
    super(props);
    const { source } = props;
    let curKey = `activeTab${(source && `_${source}`) || ''}`;
    this.state = {
      [curKey]: this.getSearch('tab') || props[curKey],
      checked: true,
      curKey,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { source } = this.props;
    const { curKey } = this.state;
    let _activeTab = nextProps[curKey];
    if (_activeTab !== undefined) {
      this.setState({
        [curKey]: _activeTab,
      });
    }
  }
  getSearch = key => {
    const {
      location: { search = '' },
    } = window;
    const keyValue =
      search
        .slice(1)
        .split('&')
        .filter(i => i.includes(`${key}=`))[0] || '';
    const splits = keyValue.split('=');
    return splits[1] || '';
  };
  tabChange = key => {
    const { curKey } = this.state;
    const { changeActiveTab, source } = this.props;
    if (changeActiveTab) {
      changeActiveTab(key, source);
    } else {
      this.setState({ [curKey]: key });
    }
  };
  handleTableChange = tabKey => (pagination, filters, sorter) => {
    const { current } = pagination;
    this.props.handleTableChange &&
      this.props.handleTableChange(tabKey, pagination);
  };
  onCheckChange = checked => {
    this.setState({ checked });
  };
  render() {
    const {
      tabColumns,
      tabsKey,
      tabsData,
      tabsExpand = {},
      tabsExpandedRowKeys = {},
      hideExtra,
      ExtraContent,
      superProps,
      callBacks = {},
      hideTabIndex = [],
      MINEING,
    } = this.props;
    const { curKey, checked } = this.state;
    const activeTab = this.state[curKey];
    const that = this;
    const tabsComp = tabColumns.map((func, idx) => {
      const tabKey = tabsKey[idx];
      let path = `tabsData.${tabKey}.content`;
      let paginationPath = `tabsPagination.${tabKey}`;
      const { tab, loading } = func(
        _.get(this.props, path, []),
        _.get(this.props, paginationPath, false),
        that,
        this.props //extend 数据
      );
      let {
        key,
        title,
        columns,
        dataSource,
        pagination,
        scrollX,
        scrollY,
        className,
      } = tab;
      if (MINEING && tabKey === 'tabHistoryTrade') {
        //TODO 需要优化 脏代码
        scrollY = 'calc(55vh - 125px)';
      }
      if (hideTabIndex.includes(idx)) {
        return null;
      }
      return (
        <TabPane tab={title} key={`${idx}`} className={`${className || ''}`}>
          <Table
            scroll={{ x: scrollX, y: scrollY || 'calc(45vh - 183px)' }}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange(tabKey)}
            expandedRowRender={tabsExpand[tabKey] || null}
            expandedRowKeys={tabsExpandedRowKeys[tabKey]}
            superProps={superProps}
            callBacks={callBacks[tabKey]}
          />
        </TabPane>
      );
    });
    const tabBarExtraContent = (
      <Switch
        checked={checked}
        onSwitch={this.onCheckChange}
        className="extra-switch"
      />
    );
    const tabTable = (
      <Tabs
        onChange={this.tabChange}
        className="with-baseline"
        tabBarExtraContent={
          !hideExtra && ((ExtraContent && ExtraContent) || tabBarExtraContent)
        }
        activeKey={`${activeTab}`}
      >
        {tabsComp}
      </Tabs>
    );
    return <div className="tab-table">{tabTable}</div>;
  }
}

TabTable.PropTypes = {
  handler: PropTypes.function,
};
