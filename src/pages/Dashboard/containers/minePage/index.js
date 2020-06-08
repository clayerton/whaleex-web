//TODO 优化，部分重复数据不重复请求
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Icon, Spin } from 'antd';
import M from 'whaleex/components/FormattedMessage';

import * as allActions from '../homePage/actions';
import { HomeWrap, CarouselSlide, Footer, Title } from './style.js';
import { injectIntl } from 'react-intl';
import HomeTable from './components/homeTable.js';
import HomeBoxFloat from './components/homeBoxFloat.js';
import {
  addScrollListener,
  deleteScrollListener,
} from '../homePage/addScrollListener.js';
import './style.less';
const miningBanner =
  _config.cdn_url + '/web-static/imgs/extend/mining-banner.jpg';
const miningFooter =
  _config.cdn_url + '/web-static/imgs/extend/mining-footer.png';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class MinePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.pageInit();
    this.props.actions.getCurrentExChangge();
    this.props.actions.getCurrentList();
    if (sessionStorage.getItem('userId')) {
      this.props.actions.getCurrentData();
    }
    this.props.actions.getWhaleexEos();
    addScrollListener();
  }
  componentWillUnmount() {
    deleteScrollListener();
    clearTimeout(window.getCurrentDataTimer);
    clearTimeout(window.getWhaleexEosTimer);
    clearTimeout(window.getCurrentExChanggeTimer);
    clearTimeout(window.getCurrentListTimer);
    clearTimeout(window.getmineDataTimer);
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { userConfig = {}, legalTender } = nextProps;
    const { checkedPageStatus } = this.state;
    if (!checkedPageStatus) {
      this.setState({ checkedPageStatus: true });
      this.props.actions.convertMap(legalTender || 'CNY');
    }
  }
  pageInit = (props = this.props) => {
    props.actions.initHomePage();
  };
  urlJump = path => e => {
    this.props.history.push([BASE_ROUTE, prefix, e].join(''));
  };
  getBackMineDetailData = params => {
    const { key } = params;
    this.setState(preState => {
      return _.set(preState, `tableLoading.${key}`, true);
    });
    this.props.actions.getBackMineDetailData(params, () => {
      this.setState(preState => {
        return _.set(preState, `tableLoading.${key}`, false);
      });
    });
  };
  render() {
    const {
      match,
      store,
      legalTender = 'CNY',
      intl: { formatMessage, formatNumber },
    } = this.props;
    const { tableLoading } = this.state;
    const { publicSymbolObj = {} } = store;
    let walData = {
      all: _.get(this.props, 'store.exChange') || {},
      youself: _.get(this.props, 'store.currData') || {},
    };
    const {
      activityList = [],
      noticeList = [],
      eosConfig = {},
      convertMap,
      convertMap_digital,
      mineData,
      mineBackData,
    } = store;
    const mineConfig = _.get(store, 'eosConfig.result.mineConfig', {});
    const { feePercent = 0 } = mineConfig;
    const datas = {
      formatMessage,
      walData,
      convertMap,
      convertMap_digital,
      feePercent,
      legalTender,
      urlJump: this.urlJump(),
      noticeList,
      activityList,
      remoteInfo: mineConfig,
    };
    return (
      <HomeWrap>
        <div className="banner">
          <img
            src={`${_config.cdn_url}web-static/imgs/extend${
              sessionStorage.getItem('userLan') === 'zh' ? '' : 'En'
            }/mining-banner.jpg`}
          />
        </div>
        <CarouselSlide>
          <HomeBoxFloat {...datas} />
          <Spin spinning={!convertMap_digital}>
            {(!convertMap_digital && null) || (
              <HomeTable
                formatMessage={formatMessage}
                formatNumber={formatNumber}
                publicSymbolObj={publicSymbolObj}
                mineBackData={mineBackData}
                getmineData={this.props.actions.getmineData}
                getBackMineDetailData={this.getBackMineDetailData}
                mineData={mineData}
                mineConfig={mineConfig}
                urlJump={this.urlJump()}
                convertMap_digital={convertMap_digital}
                tableLoading={tableLoading}
              />
            )}
          </Spin>
        </CarouselSlide>
        <div className="footer">
          <img src={miningFooter} />
        </div>
        {/* <Footer>
          <Title>
            <M id="minePage.mineRule" />
          </Title>
          <M id="minePage.mineDetail" richFormat />
          <div>
            <a className="detail-line">
              <M id="minePage.mineDetailLink" />
              <Icon type="right" />
            </a>
          </div>
        </Footer> */}
      </HomeWrap>
    );
  }
}

MinePage.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').homePage.toJS();
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
  )(MinePage)
);
