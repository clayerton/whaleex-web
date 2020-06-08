import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Table, Input, Icon, Spin } from 'antd';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import { M } from 'whaleex/components';
import U from 'whaleex/utils/extends';
import Star from 'whaleex/components/Star';
import {
  StyledCarousel,
  WalSlide,
  BannerText,
  TabsWrap,
  StyledTabs,
  StyledTable,
  StyledTitle,
  Arrow,
} from './style.js';
import { columnsFunc, columnsSubFunc } from './columns';
const tabBarStyle = {
  color: '#123',
};
const Search = Input.Search;
const TabPane = Tabs.TabPane;
export default class HomeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterSymbol: undefined,
      sorter: {
        baseCurrency: false,
        lastPrice: false,
        priceChangePercent: false,
        high: false,
        low: false,
        baseVolume: false,
        quoteVolume: false,
      },
      activeTab: '1',
      subscription: props.subscription || [],
    };
  }
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.subscription !== this.props.subscription) {
      this.setState({ subscription: nextProps.subscription });
    }
  }
  onChange = key => {
    this.setState({ activeTab: key });
  };
  changeSorter = key => () => {
    let sorter = this.state.sorter[key];
    if (!sorter || sorter === 'descend') {
      sorter = 'ascend';
    } else {
      sorter = 'descend';
    }
    this.setState({
      sorter: {
        baseCurrency: false,
        lastPrice: false,
        priceChangePercent: false,
        high: false,
        low: false,
        baseVolume: false,
        quoteVolume: false,
        [key]: sorter,
      },
    });
  };
  toggleSubscription = (symbolId, subscribe) => {
    const { subscription = [] } = this.state;
    if (subscribe) {
      this.props.actions.addSubscription({ symbolId });
    } else {
      this.props.actions.delSubscription({ symbolId });
    }
    this.setState({ subscription: _.xor(subscription, [`${symbolId}`]) });
  };
  render() {
    let { sorter, activeTab, subscription = [] } = this.state; //排序不要中间状态
    let {
      publicQuotable,
      publicSymbol = [],
      currencyList,
      formatMessage,
      legalTender,
      convertMap = {},
      convertMap_digital = {},
      urlJump,
      symbolPartition = [],
      publicSymbolObj = {},
    } = this.props;
    const isCpuPage =
      _.get(this.props, `symbolPartition[${activeTab}].partition`) === 'CPU';
    //暂时无数据
    if (_.isEmpty(convertMap)) {
      return <div />;
    }
    const { filterSymbol } = this.state;
    let datasource = [];
    let getColumns = partition => {
      let isCpuPage = partition === 'CPU';
      let tmpFunc = columnsFunc;
      if (partition === 'subscription') {
        tmpFunc = columnsSubFunc;
      }
      return tmpFunc(
        isCpuPage,
        sorter,
        {
          legalTender,
          convertMap_digital,
          convertMap,
          subscription,
        },
        this.changeSorter,
        urlJump,
        this.toggleSubscription
      );
    };
    // lists.forEach((v, i) => {
    //   const { baseCurrency, quoteCurrency } = v;
    //   let tableLine = {
    //     key: i,
    //     coin: `${baseCurrency}/${quoteCurrency}`,
    //     price: v.lastPrice,
    //     float: v.priceChangePercent,
    //     max: v.high || 0,
    //     min: v.low || 0,
    //     success: v.quoteVolume,
    //   };
    //   datasource.push(tableLine);
    // });
    // sorter 排序
    let _sorter = _.pickBy(sorter, item => !!item);
    if (_sorter['baseCurrency']) {
      let arrSorter =
        (_sorter['baseCurrency'].includes('desc') && 'desc') || 'asc';
      publicSymbol = _.orderBy(publicSymbol, ['baseCurrency'], [arrSorter]);
    } else {
      publicSymbol = _.sortBy(
        publicSymbol,
        Object.keys(_sorter).map(key => {
          return function(o) {
            if (_sorter[key].includes('desc')) {
              return Number(o[key]);
            } else {
              return -Number(o[key]);
            }
          };
        })
      );
    }
    const searchIcon = <Icon type="search" style={{ color: '#99acb6' }} />;
    const SearchComp = (
      <Search
        prefix={searchIcon}
        placeholder={formatMessage({ id: 'homePage.place_searchCoin' })}
        onSearch={value => console.log(value)}
        style={{ width: 260, marginTop: 10, marginRight: 32 }}
        onChange={e => {
          this.setState({
            filterSymbol: e.target.value,
          });
        }}
        enterButton={formatMessage({ id: 'homePage.search' })}
        value={filterSymbol}
      />
    );
    const tabs = symbolPartition.filter(({ partition }) => {
      const r = _.find(publicSymbol, ['partition', partition]);
      return !!r;
    });
    tabs.unshift({
      name: (
        <div>
          <Star check />
          <M id="symbolSwitch.userSub" />
        </div>
      ),
      partition: 'subscription',
    });
    return (
      <TabsWrap>
        {/* <h2>
          <span>
            <M id="homePage.jy" />
          </span>
        </h2> */}
        {(publicSymbol.length < 0 && (
          <StyledTable
            columns={getColumns()}
            dataSource={publicSymbol}
            pagination={{
              pageSize: 5,
              size: 'small',
              hideOnSinglePage: true,
            }}
          />
        )) || (
          <StyledTabs
            activeKey={activeTab}
            defaultActiveKey="0"
            className="with-baseline"
            onChange={this.onChange}
            animated={false}
            tabBarStyle={tabBarStyle}
            tabBarExtraContent={SearchComp}
          >
            {tabs.map((i, idx) => {
              const { name, partition: _partition, shortName, id } = i;
              let publicSymbolTab = [];
              if (_partition === 'subscription') {
                if (_.isEmpty(_sorter)) {
                  publicSymbolTab = subscription.map(i => {
                    return publicSymbolObj[i];
                  });
                } else {
                  publicSymbolTab = publicSymbol.filter(({ id }) =>
                    subscription.includes(`${id}`)
                  );
                }
              } else {
                publicSymbolTab = publicSymbol.filter(
                  ({ partition }) => partition === _partition
                );
              }
              if (filterSymbol) {
                publicSymbolTab = publicSymbolTab.filter(v =>
                  v.name.toUpperCase().includes(filterSymbol.toUpperCase())
                );
              }
              return (
                <TabPane tab={name} key={idx}>
                  <StyledTable
                    columns={getColumns(_partition)}
                    dataSource={publicSymbolTab}
                    pagination={{
                      pageSize: 15,
                      size: 'small',
                      hideOnSinglePage: true,
                    }}
                  />
                </TabPane>
              );
            })}
          </StyledTabs>
        )}
      </TabsWrap>
    );
  }
}

HomeTable.PropTypes = {
  handler: PropTypes.function,
};
