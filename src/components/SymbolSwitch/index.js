import React from 'react';
import PropTypes from 'prop-types';
import U from 'whaleex/utils/extends';
import Cookies from 'js-cookie';
import { Popover, Icon, Input, Tooltip, message } from 'antd';
import { TabTable, M, Table } from 'whaleex/components';
import Star from 'whaleex/components/Star';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import wrapColumnFunc from './columns.js';
import wrapColumnCPUFunc from './columnsCPU.js';
import wrapColumnSubFunc from './columnsSub.js';
import './style.less';
const canTradeImg =
  _config.cdn_url + '/web-static/imgs/web/trade/mining-ing.png';
const stopTradeImg =
  _config.cdn_url + '/web-static/imgs/web/trade/mining-stop.png';
const StyledWrap = styled.div`
  background: #fff;
  width: 550px;
  .ant-tabs-extra-content {
    width: 115px;
  }
`;
const StyledDropTitle = styled.div`
  cursor: pointer;
  white-space: nowrap;
  img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }
`;
const StyledCover = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
`;
const StyledIcon = styled(Icon)`
  font-size: 10px;
  position: relative;
  top: -2px;
  margin-left: 5px;
`;
const Search = Input.Search;
class SymbolSwitch extends React.Component {
  constructor(props) {
    super(props);
    // .map(i => {
    //   const { baseCurrencyId, quoteCurrencyId } = i;
    //   const baseCurrency = currencyListObj[baseCurrencyId];
    //   const quoteCurrency = currencyListObj[quoteCurrencyId];
    //   return Object.assign(i, {
    //     baseCurrency,
    //     quoteCurrency,
    //     name: baseCurrency + quoteCurrency,
    //   });
    // })
    const defaultActiveTab = Cookies.get('trade-activeTab');
    this.state = {
      visible: false,
      activeTab: defaultActiveTab === undefined ? 1 : defaultActiveTab,
      subscription: props.subscription || [],
      timer: undefined,
    };
  }
  componentDidMount() {
    //该组件即使时隐藏状态 也是被加载了的  所以以下这句算是偷偷执行的
    // sessionStorage.getItem('userId') && this.props.actions.getSubscription();
    // 每次进入该组件 取一次全部的行情数据
    // 后续每次"打开交易对选择界面"  再轮询全部的行情数据。并在退出后停止轮询
    this.props.actions.getAllSymbolMarket();
  }
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.subscription !== this.props.subscription) {
      this.setState({ subscription: nextProps.subscription });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      [
        'quotable',
        'symbolMarket',
        // 'subscription',
        'symbol',
        'app.whaleData',
        'app.eosConfig.result.mineConfig.startup',
      ]
    );
    const isStateChanged = U.isObjDiff(
      [nextState, this.state],
      ['visible', 'activeTab', 'subscription', 'filterKey']
    );
    if (isStateChanged && nextState.visible) {
      //轮询
      const loop = () => {
        clearTimeout(this.timer);
        this.props.actions.getAllSymbolMarket();
        this.timer = setTimeout(() => {
          !_config.stop_request_roll && loop();
        }, 5000);
      };
      loop();
    } else if (isStateChanged) {
      clearTimeout(this.timer);
    }
    if (isChanged || isStateChanged) {
      return true;
    }
    return false;
  }
  handleTabsClick = () => {
    this.setState({ visible: true });
  };
  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  changeActiveTab = key => {
    Cookies.set('trade-activeTab', key);
    this.setState({ activeTab: key });
  };
  toggleSubscription = (symbolId, subscribe) => {
    // if (!sessionStorage.getItem('user')) {
    //   const {
    //     intl: { formatMessage },
    //   } = this.props;
    //   message.warning(formatMessage({ id: 'components.needLogin' }));
    //   return;
    // }
    const { subscription = [] } = this.state;
    if (subscribe) {
      this.props.actions.addSubscription({ symbolId });
    } else {
      this.props.actions.delSubscription({ symbolId });
    }
    this.setState({ subscription: _.xor(subscription, [`${symbolId}`]) });
  };
  setFilter = filterKey => {
    this.setState({ filterKey });
  };
  filter = data => {
    const { currencyListObj } = this.props;
    const { filterKey } = this.state;
    if (!!filterKey) {
      return data.filter(({ baseCurrencyId, quoteCurrencyId }) => {
        return [
          currencyListObj[baseCurrencyId].shortName,
          currencyListObj[quoteCurrencyId].shortName,
        ]
          .join('')
          .toUpperCase()
          .includes(filterKey.toUpperCase());
      });
    }
    return data;
  };
  render() {
    const {
      quotable,
      symbolMarket,
      symbol,
      intl: { formatMessage },
      history,
      app,
      symbolPartition,
    } = this.props;
    const { subscription = [] } = this.state;
    const { baseCurrency, quoteCurrency } = symbol || {};
    const { activeTab, visible } = this.state;
    const symbolsRemain = _.get(
      app,
      `whaleData.symbolsRemain.${baseCurrency}${quoteCurrency}`,
      {}
    );
    const symbolsRemainTime = _.get(
      app,
      `eosConfig.result.mineConfig.symbolsLimit.${baseCurrency}${quoteCurrency}`,
      false
    );
    const startUp = _.get(app, `eosConfig.result.mineConfig.startup`, false);
    const { startTime, endTime } = symbolsRemainTime;
    let nowTime = +new Date();
    const { hourRemainAmount, dayRemainAmount } = symbolsRemain || {};
    const toolTipContent = (
      <div className="toolTipContent" style={{ fontSize: 12 }}>
        <div>
          <M id="trade.hourRemainAmount" />
          {hourRemainAmount || 0} WAL
        </div>
        <div>
          <M id="trade.dayRemainAmount" />
          {dayRemainAmount || 0} WAL
        </div>
      </div>
    );
    if (_.isEmpty(symbolPartition)) {
      return <div />;
    }
    let tabsComp = null;
    if (symbolMarket.length < 1) {
      let { tab } = wrapColumnFunc('key', 'shortName')(
        {},
        {},
        {
          props: {
            history,
            handleVisibleChange: this.handleVisibleChange,
          },
        },
        this.props
      );
      const _columns = tab.columns;
      tabsComp = (
        <StyledWrap className="symbol-switch">
          <Table
            dataSource={symbolMarket}
            columns={_columns}
            pagination={false}
            superProps={{ whaleData: _.get(app, `whaleData`, {}) }}
          />
        </StyledWrap>
      );
    } else {
      const tabsKey = [],
        tabsName = [],
        tabColumns = [];
      const tabsData = symbolPartition
        .filter(({ partition }) => {
          const r = _.find(symbolMarket, ['partition', partition]);
          return !!r;
        })
        .reduce((pre, { id, partition, name }) => {
          const key = `tab${partition}`;
          if (partition === 'CPU') {
            tabColumns.push(wrapColumnCPUFunc(key, name));
          } else {
            tabColumns.push(wrapColumnFunc(key, name));
          }
          tabsKey.push(key);
          let tabData = this.filter(symbolMarket).filter(
            ({ partition: _partition }) => `${partition}` === `${_partition}`
          );
          return Object.assign({}, pre, {
            [key]: {
              content: tabData.map(i => {
                return Object.assign({}, i, { subscription });
              }),
            },
          });
        }, {});
      tabColumns.unshift(
        wrapColumnSubFunc(
          'subscription',
          <div>
            <Star check />
            <M id="symbolSwitch.userSub" />
          </div>
        )
      );
      tabsKey.unshift('subscription');
      Object.assign(tabsData, {
        subscription: {
          content: this.filter(symbolMarket).filter(({ id }) =>
            subscription.includes(`${id}`)
          ),
        },
      });
      const tabsProps = Object.assign({}, this.props, {
        ...this.state, //主要是为了 subscription 覆盖，让关注点击反应更加迅速
        tabsData,
        tabColumns,
        tabsKey,
        activeTab, //控制组件显示的tab
        changeActiveTab: this.changeActiveTab,
        toggleSubscription: this.toggleSubscription,
        handleVisibleChange: this.handleVisibleChange,
        hideExtra: false, //隐藏extra区域
        superProps: {
          whaleData: _.get(app, `whaleData`, {}),
        },
        ExtraContent: (
          <Search
            placeholder={formatMessage({ id: 'warning.coinIput' })}
            onChange={e => {
              this.setFilter(e.target.value);
            }}
            onSearch={this.setFilter}
          />
        ),
      });
      // quotable,symbolMarket,subscription,currencyList,
      tabsComp = (
        <StyledWrap className="symbol-switch">
          {/* <Search
          placeholder={formatMessage({ id: 'warning.coinIput' })}
          onChange={e => {
          this.setFilter(e.target.value);
        }}
        onSearch={this.setFilter}
      /> */}
          <TabTable {...tabsProps} />
        </StyledWrap>
      );
    }
    return (
      <Popover
        placement="bottomLeft"
        overlayClassName="symbol-switch-pop"
        content={tabsComp}
        trigger={'click'}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <div>
          {visible && <StyledCover />}
          <StyledDropTitle>
            {baseCurrency} / {quoteCurrency}
            {(!_.isEmpty(symbolsRemain) && (
              <Tooltip placement="bottom" title={toolTipContent}>
                {(startUp === true &&
                  +hourRemainAmount !== 0 &&
                  startTime < nowTime &&
                  endTime > nowTime && <img src={canTradeImg} />) || (
                  <img src={stopTradeImg} />
                )}
              </Tooltip>
            )) ||
              null}
            <StyledIcon type="caret-down" />
          </StyledDropTitle>
        </div>
      </Popover>
    );
  }
}

SymbolSwitch.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(SymbolSwitch);
