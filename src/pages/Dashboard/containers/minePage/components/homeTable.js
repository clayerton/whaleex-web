import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Table, Input, Icon, Spin } from 'antd';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import M from 'whaleex/components/FormattedMessage';
import U from 'whaleex/utils/extends';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';

import {
  StyledCarousel,
  WalSlide,
  BannerText,
  TabsWrap,
  StyledTabs,
  StyledTable,
  EmptyBox,
  BackDown,
  BackRule,
} from './style.js';
import columns, { tabKey } from './columns.js';
const tabBarStyle = {
  color: '#123',
};
const TabPane = Tabs.TabPane;
export default class HomeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'wal',
      activeTabChild: {
        wal: 'mineData',
        user: 'mineUserData',
      },
      expandedRowKeys: [],
      Pag: {
        mineData: {
          current: 1,
          pageSize: 50,
        },
        mineHistoryData: {
          current: 1,
          pageSize: 50,
        },
        mineBackData: {
          current: 1,
          pageSize: 50,
        },
        mineUserData: {
          current: 1,
          pageSize: 50,
        },
      },
    };
  }
  componentDidMount() {
    this.getmineData();
    this._onScrollEvent = this._onScrollEvent.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    // let activeKey=activeTabChild[activeTab]
    // 获得的pagination this.setState((preState)=>{ _.set(preState,`Pag.${activeKey}`,return preState)   })
  }
  onChange = key => {
    const { activeTab, activeTabChild } = this.state;
    const _activeTabChild = Object.assign({}, activeTabChild, {
      [activeTab]: key,
    });
    this.setState({
      activeTabChild: _activeTabChild,
      expandedRowKeys: [],
    });
    this.getmineData({ activeTab, activeTabChild: _activeTabChild });
  };
  activeTabFunc = key => () => {
    const { activeTabChild } = this.state;
    this.setState({ activeTab: key, expandedRowKeys: [] });
    this.getmineData({ activeTab: key, activeTabChild });
  };
  getmineData = state => {
    // Get current activeTab
    const { activeTab, activeTabChild, Pag } = Object.assign(
      {},
      this.state,
      state
    );
    const { convertMap_digital } = this.props;

    const activeKey = activeTabChild[activeTab];
    //TODO 未登录不要请求userData
    if (!sessionStorage.getItem('user') && activeKey === 'mineUserData') {
      return;
    }
    this.props.getmineData(activeKey, Pag[activeKey], convertMap_digital);
  };
  handleTableChange = pagination => {
    const { activeTab, activeTabChild, expandedRowKeys, Pag } = this.state;
    const activeKey = activeTabChild[activeTab];
    let _Pag = { ...Pag, [activeKey]: pagination };
    this.setState({
      expandedRowKeys: [],
    });
    this.getmineData({ Pag: _Pag });
  };
  onExpand = key => {
    const { expandedRowKeys = [] } = this.state;
    const _keys = _.xor(expandedRowKeys, [key]);
    this.setState({ expandedRowKeys: _keys });
  };

  //回购列表下拉加载
  _onScrollEvent(idx, repoTime) {
    const { mineBackData } = this.props;
    const lastData = _.get(mineBackData, `mineBackData_${idx}.content`);
    const pageNumber = _.get(mineBackData, `mineBackData_${idx}.pageNumber`);
    if (
      parseInt(this._container.scrollTop) +
        parseInt(his._container.clientHeight) ===
        parseInt(his._container.scrollHeight) ||
      parseInt(his._container.scrollTop) +
        parseInt(his._container.clientHeight + 100) ===
        parseInt(his._container.scrollHeight)
    ) {
      ///todo: do something
      this.props.getBackMineDetailData({
        page: pageNumber + 1,
        key: `mineBackData_${idx}`,
        startTime: repoTime,
        lastData: lastData,
      });
    }
  }

  render() {
    let {
      formatMessage,
      formatNumber,
      mineData = {},
      publicSymbolObj,
      store,
      mineConfig,
    } = this.props;
    const { feeAsRepoFundPercent } = mineConfig;
    const { activeTab, activeTabChild, expandedRowKeys } = this.state;
    const activeKey = activeTabChild[activeTab];
    const pagination = _.get(mineData[activeKey], 'pagination', {});
    let dataSource = mineData[activeKey] || {};
    // <div className="spin-center">
    //   <Spin size="large" spinning={true} />
    // </div>
    const expandedRowRender = (i, idx) => {
      const { repoTime } = i;
      const itemDetail = {
        mineHistoryData: 'feeDetails',
        mineBackData: 'repoDetails',
        mineUserData: 'feeDetails',
      };
      if (activeKey === 'mineBackData') {
        const list = _.get(
          this.props,
          `mineBackData.mineBackData_${idx}.content`,
          []
        );
        const curExpandIsLoading = _.get(
          this.props,
          `tableLoading.mineBackData_${idx}`,
          false
        );
        return (
          <BackDown>
            <div className="header">
              <span />
              <span>
                <M id="homePage.tradeDate" />
              </span>
              <span>
                <M id="homePage.tradeCp" />
              </span>
              <span>
                <M id="homePage.tradePrice" />
              </span>
              <span>
                <M id="homePage.backWelQty" />
              </span>
            </div>
            <Spin spinning={curExpandIsLoading}>
              <div
                className="body"
                ref={c => (this._container = c)}
                onScrollCapture={() => this._onScrollEvent(idx, repoTime)}
              >
                {(list.length === 0 && (
                  <p>
                    <M id="warning.noData" />
                  </p>
                )) ||
                  list.map((i, idx) => {
                    return (
                      <div key={idx} className="header">
                        <span />
                        <span>
                          {moment(+i.timestamp).format('YYYY/MM/DD HH:mm:ss')}
                        </span>
                        <span>
                          {i.baseCurrencyName}/{i.quoteCurrencyName}
                        </span>
                        <span>{i.price}</span>
                        <span>{i.quantity}</span>
                      </div>
                    );
                  })}
              </div>
            </Spin>
          </BackDown>
        );
      }
      const thisDetail = itemDetail[activeKey];
      const data = _.get(dataSource, 'list', [])[idx];
      const myDetail = data[thisDetail];
      if (_.isEmpty(myDetail)) {
        return null;
      }
      return (
        <div className="row-table">
          <div className="title">
            <M id="asset.coin" />
            {(activeKey === 'mineBackData' && <M id="deposit.amount" />) || (
              <M id="homePage.mineTab2outputList" />
            )}
          </div>
          <div className="item">
            {Object.keys(myDetail).map((i, idx) => {
              return (
                <div className="inline" key={idx}>
                  <span>{i}</span>
                  <span>
                    {myDetail[i]} {i}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };
    let EmptyComp = (
      <EmptyBox>
        <div>
          <i className="iconfont icon-head_nodata_XL" />
        </div>
        <div>{formatMessage({ id: 'homePage.noData' })}</div>
      </EmptyBox>
    );
    if (activeKey === 'mineBackData') {
      EmptyComp = (
        <EmptyBox>
          <div>
            <i className="iconfont icon-head_nodata_XL" />
          </div>
          <div>
            {formatMessage(
              { id: 'homePage.tooltip3' },
              {
                percent: U.percentNumber(feeAsRepoFundPercent).join(''),
              }
            )}
          </div>
        </EmptyBox>
      );
    } else if (
      !sessionStorage.getItem('user') &&
      activeKey === 'mineUserData'
    ) {
      EmptyComp = (
        <EmptyBox>
          <div>
            <M
              id="homePage.noDataLogin"
              values={{
                login: (
                  <a
                    onClick={() => {
                      this.props.urlJump('/login');
                    }}
                  >
                    {formatMessage({ id: 'common.login' })}
                  </a>
                ),
              }}
            />
          </div>
        </EmptyBox>
      );
    }
    return (
      <TabsWrap>
        <div className="btn-wrap">
          <span
            className={`tabs-btn ${(activeTab === 'wal' && 'active') || ''}`}
            onClick={this.activeTabFunc('wal')}
          >
            {formatMessage({ id: 'homePage.mineTab1' })}
          </span>
          <span
            className={`tabs-btn ${(activeTab === 'user' && 'active') || ''}`}
            onClick={this.activeTabFunc('user')}
          >
            {formatMessage({ id: 'homePage.mineTab2' })}
          </span>
        </div>
        <StyledTabs
          activeKey={activeKey}
          className="with-baseline"
          onChange={this.onChange}
          animated={false}
          tabBarStyle={tabBarStyle}
        >
          {tabKey(formatMessage)[activeTab].map((i, idx) => {
            const { label, key } = i;
            return (
              <TabPane tab={label} key={key}>
                <Spin
                  size="large"
                  spinning={
                    (sessionStorage.getItem('user') ||
                      activeKey !== 'mineUserData') &&
                    dataSource.list === undefined
                  }
                >
                  <StyledTable
                    columns={columns[key](this)}
                    dataSource={
                      ((sessionStorage.getItem('user') ||
                        activeKey !== 'mineUserData') &&
                        dataSource.list) ||
                      []
                    }
                    pagination={{
                      ...pagination,
                      size: 'small',
                      hideOnSinglePage: true,
                    }}
                    expandedRowKeys={expandedRowKeys}
                    expandedRowRender={expandedRowRender}
                    locale={{
                      emptyText: EmptyComp,
                    }}
                    onChange={this.handleTableChange}
                  />
                </Spin>
              </TabPane>
            );
          })}
        </StyledTabs>
        {(activeKey === 'mineBackData' && (
          <BackRule>
            <h5>
              <M id="homePage.backTitle" />
            </h5>
            <p>
              <M id="homePage.backRuleContent" richFormat />
            </p>
            <a
              href="https://support.whaleex.com/hc/zh-cn/articles/360021016791-%E5%85%B3%E4%BA%8EWhaleEx%E9%B2%B8%E4%BA%A4%E6%89%80%E6%AD%A3%E5%BC%8F%E5%BC%80%E5%90%AF%E5%9B%9E%E8%B4%AD%E7%9A%84%E5%85%AC%E5%91%8A"
              target="_black"
            >
              <M id="homePage.backLink" />
              <Icon type="right" />
            </a>
          </BackRule>
        )) ||
          null}
      </TabsWrap>
    );
  }
}

HomeTable.PropTypes = {
  handler: PropTypes.function,
};
