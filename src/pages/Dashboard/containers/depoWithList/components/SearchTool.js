import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Tabs, Select } from 'antd';
import { Wrap } from './style.js';
import { M } from 'whaleex/components';
import U from 'whaleex/utils/extends';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const defaultState = {
  assetType: 'liquidAsset', //可用区 持仓区
  reasons: '', //类型
  currency: '', //币种
  needOrder: 'false', //checked
  pagination: {
    current: 1,
    pageSize: 10,
  },
};
export default class SearchTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultState,
      assetType: U.getSearch('assetType') || 'liquidAsset', //可用区 持仓区
      reasons: U.getSearch('reasons') || '', //类型
      currency: U.getSearch('currency') || '', //币种
      needOrder: 'false', //checked
      pagination: {
        current: 1,
        pageSize: 10,
      },
    };
  }
  componentDidMount() {
    const { that } = this.props;

    that.searchFilter(this.state);
  }
  // _setState = (key, value) => {
  //   this.setState(preState => {
  //     _.set(preState, key, value);
  //     return preState;
  //   });
  // };
  searchFilter = (param, resetIt) => {
    const { that } = this.props;
    const needOrder = _.get(that, 'state.searchParams.needOrder', {});
    // {key:'addBindUserMin',value:323}
    this.setState(preState => {
      let { key, value } = param;
      let _state = { ...preState, [key]: value, needOrder: needOrder };
      //resetIt 清空
      if (resetIt) {
        _state = { ...defaultState, [key]: value };
      }
      that.searchFilter(_state);
      return _state;
    });
  };
  render() {
    const { formatMessage, that } = this.props;
    const { currencyList, store } = that.props;
    const { selectType = {} } = store;

    const { assetType, reasons, currency } = this.state;
    const curSelectList = _.get(store, `selectType.${assetType}`, []);
    const T = this.state;
    const typeOptions = curSelectList.reduce((pre, cur) => {
      const { reason, i18n } = cur;
      pre.push({ key: reason, label: i18n });
      return pre;
    }, []);
    const options = currencyList
      .filter(({ visible }) => visible)
      .map((i, idx) => {
        const { shortName, id, icon } = i;
        return (
          <Option value={shortName} key={idx} className="dropdownOption">
            <div className="withdraw-dropdownOption">
              <img
                className="logo"
                src={icon}
                style={{
                  width: '18px',
                  margin: '0 10px',
                }}
              />
              {shortName}
            </div>
          </Option>
        );
      });
    const SelectSearch = (
      <div className="depowithList-extends">
        <Select
          dropdownClassName={'selectDropdown'}
          defaultValue={reasons}
          value={reasons}
          style={{ width: 150, lineHeight: 35 }}
          onChange={e => {
            this.searchFilter({ key: 'reasons', value: e });
          }}
        >
          <Option value="" className="dropdownOption">
            <div className="withdraw-dropdownOption">
              <M id="depoWithList.allReason" />
            </div>
          </Option>
          {typeOptions.map(({ key, label }, idx) => {
            return (
              <Option value={key} key={key} className="dropdownOption">
                <div className="withdraw-dropdownOption">{label}</div>
              </Option>
            );
          })}
        </Select>
        <Select
          dropdownClassName={'selectDropdown'}
          showSearch
          defaultValue={currency}
          value={currency}
          style={{ width: 150, lineHeight: 35 }}
          optionFilterProp="children"
          onChange={e => {
            this.searchFilter({ key: 'currency', value: e });
          }}
          filterOption={(input, option) => {
            return (
              option.props.children.props.children[1]
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
        >
          <Option value="" className="dropdownOption">
            <div
              className="withdraw-dropdownOption"
              style={{ paddingLeft: 35 }}
            >
              <M id="depoWithList.allCoin" />
            </div>
          </Option>
          {options}
        </Select>
      </div>
    );
    return (
      <Tabs
        defaultActiveKey={assetType}
        className="with-baseline"
        tabBarExtraContent={SelectSearch}
        onChange={e => {
          this.searchFilter({ key: 'assetType', value: e }, true);
        }}
      >
        <TabPane
          tab={formatMessage({ id: 'depoWithList.liquidAsset' })}
          key="liquidAsset"
        />
        <TabPane
          tab={formatMessage({ id: 'depoWithList.fixedAsset' })}
          key="fixedAsset"
        />
      </Tabs>
    );
  }
}
