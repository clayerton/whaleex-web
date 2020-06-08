import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

import U from 'whaleex/utils/extends';
import { TabTable } from 'whaleex/components';
import tabColumns, { tabsKey } from './tabColumns';
import tabColumnsCPU from './tabColumnsCPU';
import './style.less';

export class TradeHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'tabsData',
        'convertMap',
        'convertMap_digital',
        'superProps',
        'activeTab',
        'activeTab_2',
        'MINEING',
        'isCpuSymbol',
      ]
    );
    //TODO change to really data
    if (isChanged) {
      return true;
    }
    return false;
  }
  render() {
    const style = {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    };
    //this.props  tabsData, publicSymbol, convertMap, cancelDelegate
    const {
      publicSymbol,
      convertMap,
      symbol,
      MINEING,
      source,
      tabsData,
      isCpuSymbol,
    } = this.props;
    const symbolObj =
      (publicSymbol &&
        publicSymbol.reduce((pre, cur, idx) => {
          const { id } = cur;
          pre[`${id}`] = cur;
          return pre;
        }, {})) ||
      {};
    let _tabColumns = (isCpuSymbol && tabColumnsCPU) || tabColumns;
    let _tabsKey = tabsKey;
    let hideTabIndex = [];
    if (MINEING) {
      if (source === '2') {
        hideTabIndex = [2];
      } else {
        hideTabIndex = [0, 1];
      }
    }
    const comProps = Object.assign({}, this.props, {
      tabColumns: _tabColumns,
      tabsKey: _tabsKey,
      symbolObj,
      curSymbol: symbol,
    });
    return (
      <TabTable
        {...comProps}
        source={source}
        hideTabIndex={hideTabIndex}
        MINEING={MINEING}
      />
    );
  }
}

TradeHistory.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(TradeHistory);
