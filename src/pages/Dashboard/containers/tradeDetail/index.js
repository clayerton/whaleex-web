import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { notification, Icon } from 'antd';
import {
  LayoutLR,
  M,
  Switch,
  TabTable,
  SymbolSearch,
} from 'whaleex/components';
import { tableExpand } from './tabColumns/tabHistoryOrderExpand.js';
import Styled from 'styled-components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import U from 'whaleex/utils/extends';
import tabColumns, { tabsKey } from './tabColumns';
import tabColumnsCPU from './tabColumnsCPU';
import './style.less';

import * as allActions from './actions';
const ExtraDiv = Styled.div`
  display: flex;
`;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const timer = {};
export class TradeDetail extends React.Component {
  constructor(props) {
    super(props);
    const { publicSymbol } = props;
    this.state = {
      checked: false,
      activeTab: U.getSearch('tab') || 0,
      paginationPage: {},
      tabLoadings: {},
    };
  }
  componentDidMount() {
    this.props.actions.refreshProps();
    clearTimeout(timer.getAllDelegateT);
  }
  componentWillReceiveProps(nextProps) {
    const { publicSymbol } = nextProps;
    const { symbolId, paginationPage } = this.state;
    if (!_.isEmpty(publicSymbol) && !symbolId) {
      let symbolId = 'all';
      if (U.getSearch('symbolId')) {
        symbolId = U.getSearch('symbolId');
      }
      if (U.getSearch('partition')) {
        symbolId = (
          publicSymbol.filter(
            ({ partition }) => partition === U.getSearch('partition')
          )[0] || {}
        ).id;
      }
      this.setState({
        symbolId,
        tabLoading: true,
      });

      this.getAllDelegate({ id: symbolId }, paginationPage, undefined, true);
    }
  }
  componentWillUnmount() {
    clearTimeout(timer.getAllDelegateT);
  }
  getAllDelegate = (
    symbol,
    paginationPage = {},
    activeTabProps,
    isChangeSymbol
  ) => {
    clearTimeout(timer.getAllDelegateT);
    const { activeTab } = this.state;
    const {
      tradeDetail: { store },
    } = this.props;
    let tabsData = {
      tabOpenOrder: _.get(store, 'delegate', {}),
      tabHistoryOrder: _.get(store, 'delegatehistory', {}),
      tabHistoryTrade: _.get(store, 'delegateexecHistory', []),
    };
    if (isChangeSymbol) {
      tabsData = {
        tabOpenOrder: {},
        tabHistoryOrder: {},
        tabHistoryTrade: {},
      };
    }
    this.props.actions.getAllDelegate(
      symbol,
      paginationPage,
      () => {
        this.setState({ tabLoading: false });
      },
      activeTabProps || activeTab,
      tabsData
    );
    const loop = () => {
      timer.getAllDelegateT = setTimeout(() => {
        this.props.actions.getFirstPageDelegate(
          symbol,
          activeTabProps || activeTab,
          tabsData
        );
        !_config.stop_request_roll && loop();
      }, 5000);
    };
    loop();
  };
  cancelDelegate = order => {
    const {
      cancelDelegateFuncDisable,
      symbolId,
      paginationPage = {},
    } = this.state;
    if (!cancelDelegateFuncDisable) {
      this.setState({ cancelDelegateFuncDisable: true });
      const {
        intl: { formatMessage },
        pubKey,
        userUniqKey,
      } = this.props;
      this.props.actions.cancelOrder(
        Object.assign({}, order, {
          publicKey: pubKey,
          userUniqKey,
        }),
        r => {
          setTimeout(() => {
            this.setState({ cancelDelegateFuncDisable: false });
          }, 1000);
          const { returnCode, message } = r;
          if (returnCode === '0') {
            this.getAllDelegate(
              symbolId === undefined || symbolId === 'all'
                ? undefined
                : { id: symbolId },
              paginationPage,
              undefined,
              true
            );
            this.messageAlert({
              status: 'SUCCESS',
              msg: formatMessage({ id: 'trade.orderCancel' }),
            });
          } else {
            this.messageAlert({
              status: 'FAIL',
              msg: message,
            });
          }
        }
      );
    }
  };
  messageAlert = delegateResult => {
    const {
      intl: { formatMessage },
    } = this.props;
    const { status, msg } = delegateResult;
    notification.open({
      message: <span>{formatMessage({ id: 'trade.orderNotice' })}</span>,
      description: msg,
      icon: (status === 'SUCCESS' && (
        <Icon type="check-circle" style={{ color: 'rgb(87, 212, 170)' }} />
      )) || (
        <Icon
          type="exclamation-circle"
          style={{ color: 'rgb(217, 242, 94)' }}
        />
      ),
    });
  };
  onChangeSymbol = symbolId => {
    const { paginationPage = {}, activeTab } = this.state;
    this.urlJump(`/user/tradeDetail?tab=${activeTab}&symbolId=${symbolId}`)();
    if (symbolId === 'all') {
      this.getAllDelegate(
        undefined,
        paginationPage,
        undefined,
        'isChangeSymbol'
      );
    } else {
      this.getAllDelegate(
        { id: symbolId },
        paginationPage,
        undefined,
        'isChangeSymbol'
      );
    }
    this.props.actions.clearData();
    this.setState({
      expandedRowKeys: [],
      tabLoading: true,
      symbolId,
      paginationPage: { ...paginationPage, [tabsKey[activeTab]]: 0 },
    });
  };
  changeActiveTab = key => {
    const { symbolId, paginationPage = {} } = this.state;
    this.urlJump(`/user/tradeDetail?tab=${key}&symbolId=${symbolId}`)();
    this.setState({
      activeTab: key,
      tabLoading: true,
    });
    this.getAllDelegate(
      symbolId === undefined || symbolId === 'all'
        ? undefined
        : { id: symbolId },
      paginationPage,
      key
    );
  };
  onExpand = (key, orderId) => {
    const {
      tradeDetail: { store },
    } = this.props;
    const { expandedRowID = [] } = this.state;
    // const _keys = _.xor(expandedRowKeys, [key]);
    const _orderId = _.xor(expandedRowID, [orderId]);
    this.setState({ expandedRowID: _orderId });
    if (!Object.keys(_.get(store, 'delegatesById', {})).includes(orderId)) {
      this.props.actions.getDelegateById(
        orderId,
        _.get(store, 'delegatesById')
      );
    }
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  nextPage = tabKey => () => {
    this.setState(preState => {
      let { paginationPage = {}, symbolId } = preState;
      let prePage = paginationPage[tabKey] || 0;
      paginationPage = { ...paginationPage, [tabKey]: prePage + 1 };
      preState.paginationPage = paginationPage;
      this.getAllDelegate(
        symbolId === undefined || symbolId === 'all'
          ? undefined
          : { id: symbolId },
        paginationPage
      );
      return preState;
    });
  };
  render() {
    //TODO 分页和日期选择
    const {
      history,
      match,
      baseRoute,
      prefix,
      convertMap,
      tradeDetail: { store },
      publicSymbol,
      publicSymbolObj = {},
      publicQuotable,
      symbolPartition,
    } = this.props;
    const {
      symbolId,
      tabLoading,
      expandedRowID = [],
      activeTab,
      paginationPage,
    } = this.state;
    const curSymbol = (publicSymbol || []).filter(
      ({ id }) => `${id}` === `${symbolId}`
    )[0];
    const isCpuSymbol = _.get(curSymbol, 'partition') === 'CPU';
    const pageArr = ['number', 'size', 'totalElements'];
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    // <Switch checked={this.state.checked} onSwitch={this.onSwitch} />
    const ExtraContent = (
      <ExtraDiv>
        <SymbolSearch
          quotable={publicQuotable}
          symbols={publicSymbol}
          publicSymbolObj={publicSymbolObj}
          symbolId={symbolId}
          symbolPartition={symbolPartition}
          onChangeSymbol={this.onChangeSymbol}
        />
      </ExtraDiv>
    );
    const comProps = Object.assign({}, this.props, {
      tabsData: {
        tabOpenOrder: _.get(store, 'delegate', {}),
        tabHistoryOrder: _.get(store, 'delegatehistory', {}),
        tabHistoryTrade: _.get(store, 'delegateexecHistory', []),
      },
      tabsPagination: {
        tabOpenOrder: false,
        tabHistoryOrder: false,
        tabHistoryTrade: false,
      },
      tabsExpand: {
        tabHistoryOrder: tableExpand(this, isCpuSymbol),
      },
      tabsExpandedRowKeys: {
        tabHistoryOrder: expandedRowID
          .map(orderId => {
            const {
              tradeDetail: { store },
            } = this.props;
            const arrObj = _.get(store, 'delegatehistory', {}).content || [];
            return _.findIndex(arrObj, ['orderId', orderId]);
          })
          .filter(i => i >= 0),
      },
      tabColumns: (isCpuSymbol && tabColumnsCPU) || tabColumns,
      tabsKey,
      symbolObj: publicSymbolObj,
      curSymbol: curSymbol,
      cancelDelegate: this.cancelDelegate,
      ExtraContent,
      changeActiveTab: this.changeActiveTab,
      activeTab,
      onExpand: this.onExpand,
      urlJump: this.urlJump,
      superProps: _.get(store, 'delegatesByIdTime'),
      tabLoading: tabLoading,
      callBacks: {
        tabOpenOrder: { nextPage: this.nextPage('tabOpenOrder') },
        tabHistoryOrder: { nextPage: this.nextPage('tabHistoryOrder') },
        tabHistoryTrade: { nextPage: this.nextPage('tabHistoryTrade') },
      },
    });
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/tradeDetail"
        history={history}
        match={match}
        className="tradeDetail-layout"
      >
        {(!_.isEmpty(publicSymbolObj) && !_.isEmpty(convertMap) && symbolId && (
          <TabTable {...comProps} />
        )) ||
          ''}
      </LayoutLR>
    );
  }
}

TradeDetail.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return {
    tradeDetail: state.get('pages').tradeDetail.toJS(),
    language: state.get('language').toJS(),
  };
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(allActions, dispatch),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(TradeDetail)
);
