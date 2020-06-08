import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { unitMap } from 'whaleex/utils/dollarMap.js';
import { withRouter, Route } from 'react-router-dom';
import {
  AlertWrap,
  StyledAlert,
  ChainContainer,
  StyledTimeItem,
  DepoContent,
} from './style.js';
import {
  LayoutLR,
  M,
  Switch,
  Table,
  DeepBreadcrumb,
  Step,
} from 'whaleex/components';
import { Spin, Timeline } from 'antd';
const TimeItem = Timeline.Item;
import StatusFunc from './extends.js';
import { Breadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { injectIntl } from 'react-intl';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
//进度种类
import ChainSteps from './steps/chainSteps';
import ChainStepsCpuBuy from './steps/chainStepsCpuBuy';
import ChainStepsCpuSell from './steps/chainStepsCpuSell';
import Deposit from './steps/deposit';
import Withdraw from './steps/withdraw';

const defaultStatusImg =
  _config.cdn_url + '/web-static/imgs/web/depowithPage/dengdaitibi.png';

export class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { match, language } = this.props;
    const legalTender = language.locale === 'zh' ? 'CNY' : 'USD';
    const {
      params: { type, execId },
    } = match;
    switch (true) {
      case type.includes('deposit'):
        this.props.actions.getDeposit(type, execId);
        this.props.actions.convertMap(legalTender);
        break;
      case type.includes('withdraw'):
        this.props.actions.getWithDraw(type, execId);
        this.props.actions.convertMap(legalTender);
        break;
      case type.includes('cpuBuy'):
      case type.includes('cpuSell'):
      case type.includes('eos'):
        this.props.actions.getChainDetail(type, execId);
        break;
      default:
        break;
    }
    // this.props.actions.getChainDetail(execId);
  }

  componentWillReceiveProps(nextProps) {}
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      intl: { formatMessage },
      store,
      language,
    } = this.props;
    const {
      params: { execId, type },
    } = match;
    const legalTender = language.locale === 'zh' ? 'CNY' : 'USD';

    const coinFee = _.get(store, `coinFee`, {});
    const coinId = type.substring(type.lastIndexOf('_') + 1).toUpperCase();
    //TODO
    //1. depowith=>withdraw
    //2.cpuBuy cpuSell trade(buy,sell) deposit withdraw
    let curStepFunc;
    let tipText;
    let deposwith = false;
    let direction;
    let curPath;
    let leftMenu = [
      <M id="tradeDetail.history" />,
      <M id="tradeDetail.execHistory" />,
      <M id="tradeDetail.uploadChain" />,
    ];
    let leftActions = [
      this.urlJump('/user/tradeDetail'),
      this.urlJump('/user/tradeDetail?tab=2'),
    ];
    switch (true) {
      case type.includes('deposit'):
        curStepFunc = Deposit['steps'];
        tipText = formatMessage({ id: 'depoWithDetail.wxts' });
        deposwith = true;
        direction = 'horizontal';
        curPath = '/user';
        leftMenu = [
          <M id="asset.myAsset" />,
          <M id="asset.tabDeposit" />,
          <M id="route.depositDetail" />,
        ];
        leftActions = [this.urlJump('/user'), this.props.history.goBack];
        break;
      case type.includes('withdraw'):
        curStepFunc = Withdraw['steps'];
        tipText = formatMessage({ id: 'depoWithDetail.wxts' });
        deposwith = true;
        direction = 'horizontal';
        curPath = '/user';
        leftMenu = [
          <M id="asset.myAsset" />,
          <M id="asset.tabWithdraw" />,
          <M id="route.withdrawDetail" />,
        ];
        leftActions = [this.urlJump('/user'), this.props.history.goBack];
        break;
      case type.includes('cpuBuy'):
        curStepFunc = ChainStepsCpuBuy['steps'];
        tipText = formatMessage({ id: 'chainStatus.tipMess' }, { data: 2 });
        direction = 'vertical';
        curPath = '/user/tradeDetail';
        break;
      case type.includes('cpuSell'):
        curStepFunc = ChainStepsCpuSell['steps'];
        tipText = formatMessage({ id: 'chainStatus.tipMess' }, { data: 2 });
        direction = 'vertical';
        curPath = '/user/tradeDetail';
        break;
      case type.includes('eos'):
        curStepFunc = ChainSteps['steps'];
        tipText = formatMessage({ id: 'chainStatus.tipMess' }, { data: 2 });
        direction = 'vertical';
        curPath = '/user/tradeDetail';
        break;
      default:
        break;
    }
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const statusData = _.get(store, [`statusObj.${type}.${execId}`], []);
    const stepObj = curStepFunc(statusData, formatMessage);
    const { steps, currentStep } = stepObj;

    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath={curPath}
        history={history}
        match={match}
      >
        <DeepBreadcrumb arr={leftMenu} actions={leftActions} />
        <ChainContainer>
          <AlertWrap>
            <StyledAlert message={tipText} type="warning" closable />
          </AlertWrap>
          {(deposwith && (
            <div className="imgPerson">
              <img src={defaultStatusImg} />
            </div>
          )) ||
            ''}
          <div className="chainProgress">
            <Step
              steps={steps}
              currentStep={currentStep}
              direction={direction}
            />
          </div>
        </ChainContainer>
        {(deposwith && (
          <DepoContent>
            <div className="depo-div">
              <label>
                <M id="depoWithDetail.depositAccount" />
              </label>
              <span>
                {statusData.amount} {coinId}
              </span>
            </div>
            <div className="depo-div">
              <label>
                <M id="depoWithDetail.depositCard" />
              </label>
              <span>{statusData.eosAccount}</span>
            </div>
            <div className="depo-div">
              <label>
                <M id="depoWithDetail.sxf" />
              </label>
              <span>0</span>
            </div>
            <div className="depo-div">
              <label>
                <M id="depoWithDetail.dzsl" />
              </label>
              <span>
                {statusData.amount} {coinId}
                <span className="changeCny">
                  ≈{unitMap[legalTender]}
                  {U.formatLegalTender(statusData.amount * coinFee[coinId])}
                </span>
              </span>
            </div>
          </DepoContent>
        )) ||
          ''}
      </LayoutLR>
    );
  }
}

Address.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').stepPage.toJS();
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
  )(Address)
);
