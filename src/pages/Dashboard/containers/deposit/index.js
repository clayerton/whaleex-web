import React from 'react';
import PropTypes from 'prop-types';
import { Spin, message, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withRouter, Route } from 'react-router-dom';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { LayoutLR, M, DeepBreadcrumb } from 'whaleex/components';
import { injectIntl } from 'react-intl';

import QRCode from 'qrcode';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { Wrap, Item } from './style.js';
import * as allActions from './actions';

import './style.less';
const BASE_ROUTE = _config.base;

const prefix = _config.app_name;
export class Deposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.initPage(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.initPage(nextProps);
  }
  initPage = props => {
    const { currencyListObj } = props;
    if (currencyListObj && !this.state.qrcode) {
      const currencyName = _.get(
        this.props.match,
        'params.currencyName',
        'EOS'
      );
      const currencyObj = currencyListObj[currencyName] || {};
      const { depositAddress } = currencyObj;
      QRCode.toDataURL(depositAddress, { width: 250 }).then(r => {
        this.setState({ qrcode: r });
      });
    }
  };
  onCopy = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    message.success(formatMessage({ id: 'deposit.cpsuccess' }));
  };
  splitStr = address => {
    return (
      <span>
        <span className="font2-1">{address.slice(0, 7)}</span>
        {address.slice(7)}
      </span>
    );
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  tooltipVisible = visible => {
    if (visible) {
      _czc.push(['_trackEvent', '我的资产-充币', '显示二维码地址']);
    }
    this.setState({ visible });
    setTimeout(() => {
      this.setState({ workaround: Date.now() });
    }, 10);
  };
  render() {
    const {
      history,
      match,
      currencyListObj = {},
      intl: { formatMessage },
    } = this.props;
    const currencyName = _.get(match, 'params.currencyName', 'EOS');
    const currencyObj = currencyListObj[currencyName] || {};
    const { qrcode } = this.state;
    const { depositAddress } = currencyObj;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const eosAccount = _.get(this.props, 'eosAccount.eosAccount');

    const ExtraContent = (
      <div className="depoWithPage-extends">
        <a
          onClick={() =>
            this.urlJump(
              `/assetAction/depowithpage?currencySelect=${currencyName}&typeSelect=deposit`
            )()
          }
        >
          <M id="pkAddress.zchistory" />
        </a>
      </div>
    );

    if (!depositAddress) {
      return (
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user"
          history={history}
          match={match}
          className="depoWithList-layout"
        >
          <DeepBreadcrumb
            arr={[<M id="asset.myAsset" />, <M id="asset.deposit" />]}
            actions={[this.urlJump('/user')]}
          />
          <Wrap style={{ alignItems: 'center' }}>
            <Spin size="large" />
          </Wrap>
        </LayoutLR>
      );
    }

    const exEosAccount = _.get(this.props, 'eosConfig.result');
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}
        className="depoWithList-layout"
      >
        <DeepBreadcrumb
          arr={[<M id="asset.myAsset" />, <M id="asset.deposit" />]}
          actions={[this.urlJump('/user')]}
          extend={ExtraContent}
        />
        <Wrap>
          <div>
            <Item>
              <label />
              <div className="prompt">
                <M id="deposit.prompt" values={{ eosAccount: eosAccount }} />
              </div>
            </Item>
            <Item>
              <label>
                <M id="deposit.out" />
              </label>
              <div className="item-grey">{eosAccount}</div>
            </Item>
            <Item>
              <label>
                <M id="deposit.enter" />
              </label>
              <div className="item-grey">
                <span className="font2">{this.splitStr(depositAddress)}</span>
                <CopyToClipboard
                  text={depositAddress}
                  className="copy font3"
                  onCopy={() => {
                    _czc.push(['_trackEvent', '我的资产-充币', '复制地址']);
                    this.onCopy();
                  }}
                >
                  <span className="font3" id="deposit_copy_eos_account">
                    <M id="deposit.copyadress" />
                  </span>
                </CopyToClipboard>
                {/* <Tooltip
                  placement="top"
                  overlayClassName="deposit-tooltip"
                  visible={this.state.visible}
                  onVisibleChange={this.tooltipVisible}
                  title={
                    <div>
                      <img src={qrcode} width="100px" />
                    </div>
                  }>
                  <span className="font4">
                    {formatMessage({ id: 'deposit.code' })}
                  </span>
                </Tooltip> */}
              </div>
            </Item>
            {/* <Item>
              <label>
                <M id="deposit.amount" />
              </label>
              <div className="item-grey gery">
                <M id="deposit.amountTips" />
              </div>
            </Item> */}
            {/* <div className="remarks">
              <div className="top">
                <span className="font1">
                  <M id="deposit.remarks" />
                </span>
                <CopyToClipboard
                  text={exEosAccount.exEosAccountAlias}
                  className="copy font2"
                  onCopy={this.onCopy}>
                  <span className="font3">
                    <M id="deposit.copyadress" />
                  </span>
                </CopyToClipboard>
              </div>
              <div className="bottom">
                <div className="content">{exEosAccount.exEosAccountAlias}</div>
              </div>
            </div>
            <div className="remarkstips">
              <M id="deposit.remarkstips" />
            </div> */}
            <Item>
              <label />
              <div className="bottom-alert">
                <p>
                  <M id="deposit.tips" />
                </p>
                <div>
                  <M id="deposit.text1" values={{ data: 3 }} richFormat />
                </div>
              </div>
            </Item>
          </div>
        </Wrap>
      </LayoutLR>
    );
  }
}

Deposit.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').asset.toJS();
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
  )(Deposit)
);
