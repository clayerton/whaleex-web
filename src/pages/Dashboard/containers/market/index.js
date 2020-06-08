import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import { Tabs, Table, Input, Icon, Spin, message } from 'antd';
import { injectIntl } from 'react-intl';
import { LayoutCT, M, Switch } from 'whaleex/components';
import Star from 'whaleex/components/Star';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import U from 'whaleex/utils/extends';
import * as allActions from '../homePage/actions';
import * as allSubActions from 'whaleex/common/actionsSubscribe.js';
import './style.less';
import {
  TabsWrap,
  StyledTable,
  StyledTitle,
  StyledMarket,
  Arrow,
} from './style.js';
import { columnsFunc, columnsSubFunc } from './columns';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const tabBarStyle = {
  color: '#123',
};
export class Market extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterSymbol: undefined,
      activeTab: U.getSearch('tab') || '1',
      subscription: props.subscription || [],
      sorter: {
        baseCurrency: false,
        lastPrice: false,
        priceChangePercent: false,
        high: false,
        low: false,
        baseVolume: false,
        quoteVolume: false,
      },
    };
  }
  componentDidMount() {
    this.props.actions.getCurrentList();
    this.props.actions.getPartition();
    this.getConvert(this.props);
  }
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.legalTender !== this.props.legalTender) {
      this.getConvert(nextProps);
    }
    if (nextProps.subscription !== this.props.subscription) {
      this.setState({ subscription: nextProps.subscription });
    }
  }
  getConvert = props => {
    const { legalTender } = props || this.props;
    let defaultLegalTender = 'USD';
    if (U.getUserLan() === 'zh') {
      defaultLegalTender = 'CNY';
    }
    this.props.actions.convertMap(legalTender || defaultLegalTender);
  };
  componentWillUnmount() {
    clearTimeout(window.getCurrentListTimer);
  }

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
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  onChangeTab = key => {
    this.setState({ activeTab: key });
    this.urlJump(`/market?tab=${key}`)();
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
    let {
      history,
      match,
      store,
      intl: { formatMessage },
    } = this.props;
    let {
      publicSymbol = [],
      publicSymbolObj = {},
      symbolPartition = [],
      convertMap = {},
      convertMap_digital = {},
      legalTender,
    } = store;
    //didmount 开始轮询 unmount 结束轮询
    //header 要统一加上 行情入口不要遗漏。。。。包括home项目
    let { sorter, activeTab, subscription = [] } = this.state; //排序不要中间状态
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
        this.urlJump,
        this.toggleSubscription
      );
    };
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
        //prefix={searchIcon}
        placeholder={formatMessage({ id: 'homePage.place_searchCoin' })}
        onSearch={value => console.log(value)}
        style={{ width: 166 }}
        onChange={e => {
          this.setState({
            filterSymbol: e.target.value,
          });
        }}
        //enterButton={formatMessage({ id: 'homePage.search' })}
        enterButton={false}
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
      <LayoutCT
        history={history}
        match={match}
        backgroundShadow="hidden"
        noBreadcrumb
      >
        <StyledMarket>
          <div className="market">
            <TabsWrap>
              <Tabs
                activeKey={activeTab}
                defaultActiveKey="0"
                className="with-baseline"
                onChange={this.onChangeTab}
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
                      <Table
                        columns={getColumns(_partition)}
                        dataSource={publicSymbolTab}
                        pagination={{
                          pageSize: 10000,
                          size: 'small',
                          hideOnSinglePage: true,
                        }}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </TabsWrap>
          </div>
        </StyledMarket>
      </LayoutCT>
    );
  }
}

Market.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').homePage.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...allActions, ...allSubActions }, dispatch),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Market)
);
