import React from 'react';
import PropTypes from 'prop-types';
import {
  Spin,
  message,
  InputNumber,
  Select,
  Modal,
  notification,
  Icon,
} from 'antd';
import { injectIntl } from 'react-intl';
import Loading from 'whaleex/components/Loading';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import styled from 'styled-components';
import U from 'whaleex/utils/extends';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { LayoutLR, M, CodeModal, DeepBreadcrumb } from 'whaleex/components';
import { unitMap } from 'whaleex/utils/dollarMap';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { Wrap, Item } from './style.js';
import * as allActions from '../asset/actions';
import { sendCode } from 'whaleex/common/actions.js';
import { getIds, getNextId } from '../trade/actions';
import './style.less';
const Option = Select.Option;
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let timer = {};
const StyledInputNumber = styled(InputNumber)`
  input {
    color: #2a4452;
  }
  &:after {
    content: ${props => "'" + `${props.unit}` + "'"};
    position: absolute;
    top: 0;
    right: 22px;
    line-height: 35px;
    height: 100%;
    color: #99acb6;
  }
`;
export class Withdraw extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const currencyName = _.get(match, 'params.currencyName', 'EOS');
    this.state = { currencySelect: currencyName };
  }
  componentDidMount() {
    const convertMap_digital = _.get(this.props, 'convertMap_digital');
    if (!!convertMap_digital) {
      this.pageInit(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const isEmpty = !_.get(nextProps, 'store.assetList');
    const convertMap_digital = _.get(nextProps, 'convertMap_digital');
    if (isEmpty && !!convertMap_digital) {
      this.pageInit(nextProps);
    }
    const { userUniqKey, pubKey } = this.props;
    const { userUniqKey: _userUniqKey, pubKey: _pubKey } = nextProps;
    if ((!userUniqKey || !pubKey) && _userUniqKey && _pubKey) {
      this.props.actions.getIds({ pk: _pubKey, userUniqKey: _userUniqKey });
    }
  }
  componentWillUnmount() {
    Object.keys(timer).forEach(key => {
      clearTimeout(timer[key]);
    });
    timer = {};
  }
  pageInit = props => {
    const {
      convertMap_digital,
      legaldigital,
      trade,
      pubKey,
      userUniqKey,
    } = props;
    this.props.actions.getUserAsset(convertMap_digital, legaldigital);
    const loopAskId = () => {
      clearTimeout(timer.getNewIds);
      if (pubKey) {
        this.props.actions.getIds({ pk: pubKey, userUniqKey });
      }
      timer.getNewIds = setTimeout(() => {
        !_config.stop_request_roll && loopAskId();
      }, 1000 * 60 * 40);
    };
    loopAskId();
  };
  handleChange = value => {
    this.setState({ currencySelect: value, inputValue: undefined });
  };
  onInputChange = (value, precision, max = Infinity, min = 0) => {
    const {
      intl: { formatMessage },
    } = this.props;
    if (value > max) {
      message.error(formatMessage({ id: 'withdraw.overMax' }));
    }
    this.setState({
      inputValue: U.formatInsertData(`${value > max ? max : value}`, precision),
    });
  };
  confirmWithdraw = () => {
    this.setState({ loading: true });
    const {
      userConfig,
      userUniqKey,
      currencyListObj,
      pubKey,
      eosAccount: { eosAccount: userEosAccount },
      withdrawFeeObj,
      legaldigital,
      convertMap_digital,
      trade,
      intl: { formatMessage },
    } = this.props;
    const that = this;
    const signIds = _.get(trade, 'store.signIds');
    const { currencySelect, inputValue } = this.state;
    const currencyObj = currencyListObj[currencySelect];
    const feeQty = withdrawFeeObj[currencySelect];
    const googleEnable = _.get(this.props, 'userConfig.googleVerify');
    const phoneEnable = _.get(this.props, 'userConfig.phoneVerify');
    const exEosAccount = _.get(this.props, 'eosConfig.result.exEosAccount');
    let codeLayout = [];
    if (googleEnable) {
      codeLayout.push('googleCode');
    }
    if (phoneEnable) {
      codeLayout.push('phoneCode');
    }
    if (codeLayout.length === 1) {
      codeLayout = codeLayout.join('');
    }

    this.props.actions.getNextId({
      signIds,
      pubKey,
      userUniqKey,
      callBack: (expressId, remark) => {
        this.props.actions.confirmWithdraw(
          {
            exEosAccount,
            params: {
              publicKey: pubKey,
              currency: currencySelect,
              feeCurrency: currencySelect,
              quantity: U.calc(`${inputValue} - ${feeQty}`),
              feeQty,
              verifyType: 'withdraw',
              withdrawId: expressId,
            },
            currencyObj,
            userEosAccount,
            userUniqKey,
            remark,
          },
          (status, msg) => {
            //本身为 action 回调
            // callBack 来自组件回调
            that.setState({ loading: false });
            that.props.actions.getAssetList(convertMap_digital, legaldigital);
            if (status) {
              notification.open({
                message: (
                  <span>{formatMessage({ id: 'withdraw.userset' })}</span>
                ),
                description: (
                  <span>{formatMessage({ id: 'withdraw.depowith' })}</span>
                ),
                icon: (
                  <Icon
                    type="check-circle"
                    style={{ color: 'rgb(87, 212, 170)' }}
                  />
                ),
              });
              setTimeout(() => {
                this.urlJump(
                  '/assetAction/depowithpage?currencySelect=' +
                    currencySelect +
                    '&typeSelect=withdraw'
                )();
              }, 1500);
            } else {
              notification.open({
                message: (
                  <span>{formatMessage({ id: 'withdraw.userset' })}</span>
                ),
                description: <span>{msg}</span>,
                icon: (
                  <Icon
                    type="exclamation-circle"
                    style={{ color: 'rgb(217, 242, 94)' }}
                  />
                ),
              });
            }
            // callBack(status, msg);
          }
        );
      },
    });
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  render() {
    const {
      history,
      match,
      convertMap,
      convertMap_digital,
      currencyList,
      currencyListObj = {},
      userConfig,
      eosAccount,
      store,
      legalTender,
      intl: { formatMessage },
      withdrawFeeObj = {},
    } = this.props;

    const { currencySelect, inputValue, loading } = this.state;
    const feeQty = withdrawFeeObj[currencySelect];
    const currencyObj = currencyListObj[currencySelect];
    const { precision = 2, shortName } = currencyObj || {};
    const assetList = _.get(store, 'assetList.content', []);
    const tabPath = getLevelPath(unZip(getSubPath('/user')));

    const ExtraContent = (
      <div className="depoWithPage-extends">
        <a
          onClick={() =>
            this.urlJump(
              `/assetAction/depowithpage?currencySelect=${currencySelect}&typeSelect=withdraw`
            )()
          }
        >
          <M id="pkAddress.zchistory" />
        </a>
      </div>
    );

    if (_.isEmpty(store)) {
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
            arr={[<M id="asset.myAsset" />, <M id="asset.withdraw" />]}
            actions={[this.urlJump('/user')]}
          />
          <Wrap>
            <Spin size="large" />
          </Wrap>
        </LayoutLR>
      );
    }
    const { availableAmount = 0 } =
      assetList.filter(({ currency }) => currency === currencySelect)[0] || {};
    const available = U.symbolNumber(+availableAmount, precision);
    const errorTooSmall = inputValue - feeQty < 0;
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
          arr={[<M id="asset.myAsset" />, <M id="asset.withdraw" />]}
          actions={[this.urlJump('/user')]}
          extend={ExtraContent}
        />
        <Wrap>
          <div>
            <Item className="select">
              <label>
                <M id="withdraw.withdrawType" />
              </label>
              <Select
                dropdownClassName={'selectDropdown'}
                showSearch
                defaultValue={currencySelect}
                style={{ width: 250, lineHeight: 35 }}
                placeholder={formatMessage({
                  id: 'withdraw.selectType',
                })}
                optionFilterProp="children"
                onChange={this.handleChange}
                filterOption={(input, option) => {
                  return (
                    option.props.children.props.children[1]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {currencyList
                  .filter(
                    ({ withdrawEnable, visible }) => withdrawEnable && visible
                  )
                  .map((i, idx) => {
                    const { shortName, id, icon } = i;
                    return (
                      <Option
                        value={shortName}
                        key={idx}
                        className="dropdownOption"
                      >
                        <div className="withdraw-dropdownOption">
                          <img
                            className="logo"
                            src={icon}
                            style={{
                              width: '18px',
                              margin: '0 10px',
                            }}
                          />
                          {shortName}
                        </div>
                      </Option>
                    );
                  })}
              </Select>
            </Item>
            <Item>
              <label>
                <M id="withdraw.depowithAccont" />
              </label>
              <div>
                <StyledInputNumber
                  className="input-quantity"
                  style={{ width: 250, height: 35 }}
                  min={+feeQty}
                  max={+available}
                  value={inputValue}
                  step={Math.pow(0.1, precision).toFixed(precision)}
                  placeholder={formatMessage({
                    id: 'withdraw.placeAmount',
                  })}
                  onChange={value => {
                    this.onInputChange(value, precision, +available);
                  }}
                  unit={shortName}
                />
                <div className="inputTips">
                  <M id="withdraw.can" /> {available} {shortName}
                </div>
              </div>
            </Item>
            <Item>
              <label>
                <M id="withdraw.depoAdress" />
              </label>
              <span>{eosAccount.eosAccount}</span>
            </Item>
            <Item>
              <label>
                <M id="withdraw.fee" />
              </label>
              <span>
                {feeQty} {shortName}
              </span>
            </Item>
            <Item>
              <label>
                <M id="withdraw.Amount" />
              </label>
              <div>
                {(errorTooSmall && <span>0 {shortName}</span>) || (
                  <span>
                    {!!+inputValue
                      ? U.scientificToNumber(
                          U.calc(`${inputValue} - ${feeQty}`)
                        )
                      : 0}{' '}
                    {shortName}
                  </span>
                )}
                <span className="convert">
                  ≈{unitMap[legalTender]}
                  {(errorTooSmall && '0.00') ||
                    (
                      (!!+inputValue ? inputValue - feeQty : 0) *
                        convertMap_digital[shortName] *
                        convertMap['EOS'] || 0
                    ).toFixed(2)}
                </span>
              </div>
            </Item>
            <Item>
              <label />
              <StyledButton
                className={(loading && 'opacity-btn') || ''}
                type="primary"
                style={{ width: 250 }}
                disabled={!currencySelect || !+inputValue || loading}
                onClick={this.confirmWithdraw}
              >
                {(loading && <Loading />) || null}
                <M id="withdraw.dep" />
              </StyledButton>
            </Item>
            <Item>
              <label />
              <div className="bottom-alert">
                <p>
                  <M id="withdraw.message" />
                </p>
                <M id="withdraw.messList" values={{ data: 3 }} richFormat />
              </div>
            </Item>
          </div>
        </Wrap>
      </LayoutLR>
    );
  }
}

Withdraw.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  const asset = state.get('pages').asset.toJS();
  const trade = state.get('pages').trade.toJS();
  return { ...asset, trade };
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { sendCode, getIds, getNextId }),
    dispatch
  ),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Withdraw)
);
