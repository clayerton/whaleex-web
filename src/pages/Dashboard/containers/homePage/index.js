import React from 'react';
import PropTypes from 'prop-types';
import context from 'whaleex/utils/service';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { LayoutLR, M, Switch, Table } from 'whaleex/components';
import { htmlBody } from './html.js';
import { Spin } from 'antd';
import { HomeWrap, CarouselSlide } from './style.js';
import Carousel from './components/banner.js';
import HomeTable from './components/homeTable.js';
import HomeBoxFloat from './components/homeBoxFloat.js';
import * as allActions from './actions';
import * as allSubActions from 'whaleex/common/actionsSubscribe.js';
import { injectIntl } from 'react-intl';
import {
  addScrollListener,
  deleteScrollListener,
} from './addScrollListener.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
import './style.less';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const {
      intl: { formatMessage },
    } = this.props;
    this.pageInit();
    this.props.actions.getCurrentList();
    this.props.actions.getCurrentExChangge();
    if (sessionStorage.getItem('userId')) {
      this.props.actions.getCurrentData();
    }
    this.props.actions.getWhaleexEos();
    this.props.actions.getQuotable();
    this.props.actions.getPartition();
    this.getConvert(this.props);
    addScrollListener();

    console.log(this.props);
  }
  componentWillUnmount() {
    deleteScrollListener();
    clearTimeout(window.getCurrentDataTimer);
    clearTimeout(window.getWhaleexEosTimer);
    clearTimeout(window.getCurrentExChanggeTimer);
    clearTimeout(window.getCurrentListTimer);
  }
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.legalTender !== this.props.legalTender) {
      this.getConvert(nextProps);
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
  pageInit = (props = this.props) => {
    props.actions.initHomePage();
  };

  urlJump = path => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  tooltipVisible = visible => {
    if (visible) {
      _czc.push(['_trackEvent', '微信', '二维码显示']);
    }
    this.setState({ visible });
    setTimeout(() => {
      this.forceUpdate();
    }, 20);
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      store,
      intl: { formatMessage },
    } = this.props;
    const {
      activityList,
      noticeList = [],
      publicSymbol = [],
      publicSymbolObj = {},
      currencyList = [],
      publicQuotable = [],
      eosConfig = {},
      symbolPartition = [],
      legalTender,
    } = store;
    // let dataIsNotReady =
    //   activityList === undefined ||
    //   noticeList === undefined ||
    //   publicSymbol === undefined ||
    //   currencyList === undefined ||
    //   eosConfig === undefined ||
    //   publicQuotable === undefined;
    // if (dataIsNotReady) {
    //   return (
    //     <div className="spin-center">
    //       <Spin size="large" spinning={true} />
    //     </div>
    //   );
    // }
    let walData = {
      all: _.get(this.props, 'store.exChange') || {},
      youself: _.get(this.props, 'store.currData') || {},
    };
    const { convertMap, convertMap_digital } = store;
    const mineConfig = _.get(store, 'eosConfig.result.mineConfig', {});
    const { feePercent = 0 } = mineConfig;
    const datas = {
      formatMessage,
      walData,
      convertMap,
      convertMap_digital,
      feePercent,
      legalTender,
      urlJump: this.urlJump,
      noticeList,
      activityList,
      remoteInfo: mineConfig,
    };
    let tableData = {
      publicQuotable,
      publicSymbol,
      publicSymbolObj,
      currencyList,
      formatMessage,
      convertMap,
      convertMap_digital,
      legalTender,
      urlJump: this.urlJump,
      symbolPartition,
      actions: this.props.actions,
      subscription: this.props.subscription,
    };

    return (
      <HomeWrap>
        <Carousel activityList={activityList} />
        <CarouselSlide>
          <HomeBoxFloat {...datas} />
          <HomeTable {...tableData} />
        </CarouselSlide>
        {htmlBody(this)}
      </HomeWrap>
    );
  }
}

HomePage.propTypes = {};

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
  )(HomePage)
);
