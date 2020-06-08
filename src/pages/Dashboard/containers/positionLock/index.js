import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Spin, notification, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { preCondition } from 'whaleex/components/preconditions';
import {
  LayoutLR,
  M,
  Switch,
  Table,
  DeepBreadcrumb,
  InputWithClear,
} from 'whaleex/components';
import Loading from 'whaleex/components/Loading';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Breadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { injectIntl } from 'react-intl';
import U from 'whaleex/utils/extends';
import { Wrap, Item, StyledInputNumber, Addon } from './style.js';
import * as allActions from './actions';
import { login, getPermissions } from 'whaleex/common/actions.js';
import './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let timer = undefined;
export class PositionLock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { convertMap_digital, legaldigital } = this.props;
    if (!!legaldigital && !_.isEmpty(convertMap_digital)) {
      this.pageInit(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { convertMap_digital, legaldigital, store } = nextProps;
    if (!_.isEmpty(convertMap_digital) && !!legaldigital && !timer) {
      this.pageInit(nextProps);
    }
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }
  pageInit = props => {
    const { convertMap_digital, legaldigital } = props;
    const loop = () => {
      clearTimeout(timer);
      this.props.actions.getUserAsset(convertMap_digital, legaldigital);
      timer = setTimeout(() => {
        !_config.stop_request_roll && loop();
      }, 10000);
    };
    loop();
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  onInputChange = (value, precision, max = Infinity, min = 0) => {
    this.setState({
      inputValue: U.formatInsertData(`${value > max ? max : value}`, precision),
    });
  };
  confirmLock = () => {
    const { inputValue } = this.state;
    const {
      intl: { formatMessage },
      convertMap_digital,
      legaldigital,
    } = this.props;
    this.setState({ loading: true });
    this.props.actions.LockAsset(inputValue, status => {
      this.setState({ loading: false, inputValue: '' });
      this.props.actions.getUserAsset(convertMap_digital, legaldigital);
      if (status) {
        notification.open({
          message: <span>{formatMessage({ id: 'position.myAsset' })}</span>,
          description: (
            <span>{formatMessage({ id: 'position.lockSuccess' })}</span>
          ),
          icon: (
            <Icon type="check-circle" style={{ color: 'rgb(87, 212, 170)' }} />
          ),
        });
      }
    });
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      intl: { formatMessage },
      convertMap_digital,
      legaldigital,
      store,
      currencyListObj,
      app,
    } = this.props;
    const { inputValue, loading } = this.state;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    if (
      _.isEmpty(convertMap_digital) ||
      !legaldigital ||
      _.isEmpty(currencyListObj)
    ) {
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
            arr={[<M id="asset.myAsset" />, <M id="position.lock" />]}
            actions={[this.urlJump('/user')]}
          />
          <Wrap style={{ alignItems: 'center' }}>
            <Spin size="large" />
          </Wrap>
        </LayoutLR>
      );
    }
    const wal =
      _
        .get(store, 'assetList.content', [])
        .filter(({ currency }) => currency === 'WAL')[0] || {};
    let walAsset = Object.assign(
      {},
      wal,
      currencyListObj.WAL,
      _.get(store, 'wal', {})
    );
    const { availableAmount, precision } = walAsset;
    const allButton = (
      <Addon
        onClick={() => {
          this.onInputChange(availableAmount, precision);
        }}
      >
        <M id="position.all" />
      </Addon>
    );
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[<M id="asset.myAsset" />, <M id="position.lock" />]}
          actions={[this.urlJump('/user')]}
        />
        <Spin size="large" spinning={availableAmount === undefined}>
          <Wrap>
            <div>
              <Item>
                <label>
                  <M id="position.available" />
                </label>
                <div>{availableAmount} WAL</div>
              </Item>
              <Item>
                <label>
                  <M id="position.inputNumber" />
                </label>
                <div className="input-position">
                  <InputWithClear
                    style={{ width: 250, height: 35 }}
                    addonAfter={allButton}
                    placeholder={formatMessage({
                      id: 'position.lockAmountInput',
                    })}
                    value={inputValue}
                    onChange={e => {
                      this.onInputChange(
                        e.target.value,
                        precision,
                        +availableAmount
                      );
                    }}
                    resetField={e => {
                      this.onInputChange('', precision);
                    }}
                  />
                </div>
              </Item>
              <Item>
                <label />
                <StyledButton
                  className={(loading && 'opacity-btn') || ''}
                  type="primary"
                  style={{ width: 250 }}
                  disabled={loading || !+inputValue}
                  onClick={() => {
                    preCondition(
                      'position',
                      app, //common app store
                      history,
                      { superProps: this.props, actions: this.props.actions }, //this.props需要实现国际化 actions.login common
                      this.confirmLock
                    )();
                  }}
                >
                  {(loading && <Loading />) || null}
                  <M id="position.lock" />
                </StyledButton>
              </Item>
              <Item>
                <label />
                <div className="lock-tips">
                  <p>
                    <M id="position.tips" />
                  </p>
                  <M
                    id="position.lockTipsList"
                    values={{ time: '5' }}
                    richFormat
                  />
                </div>
              </Item>
            </div>
          </Wrap>
        </Spin>
      </LayoutLR>
    );
  }
}

PositionLock.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return { ...state.get('pages').positionLock.toJS(), app: state.get('app') };
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { login, getPermissions }),
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
  )(PositionLock)
);
