import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Spin, notification, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { getColumns, scrollX } from './columns.js';
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
import { Wrap, Content } from './style.js';
import * as allActions from './actions';
import './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let timer = undefined;

export class PositionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { current: 1, pageSize: 50 },
    };
  }
  componentDidMount() {
    const { convertMap_digital, legaldigital } = this.props;
    this.props.actions.getFixedType();
    if (!!legaldigital && !_.isEmpty(convertMap_digital)) {
      this.pageInit(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { convertMap_digital, legaldigital, store } = nextProps;
    const { pagination } = store;
    if (pagination !== undefined) {
      this.setState({ pagination });
    }
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
      const { pagination } = this.state;
      this.props.actions.getUserAsset(
        convertMap_digital,
        legaldigital,
        pagination
      );
      timer = setTimeout(() => {
        !_config.stop_request_roll && loop();
      }, 10000);
    };
    loop();
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.props.actions.getPositionWal(pagination);
  };
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
      convertMap_digital,
      legaldigital,
      store,
      currencyListObj,
    } = this.props;
    const { earnings = [], assetList = {} } = store;
    const { pagination } = this.state;
    const datasDesc = _.orderBy(earnings.content, ['timestamp'], ['desc']);
    const { fixedAmount } =
      _
        .get(assetList, 'content', [])
        .filter(({ currency }) => currency === 'WAL')[0] || {}; // 变量尽量只取
    const { loading } = this.state;
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
            arr={[<M id="asset.myAsset" />, <M id="position.position" />]}
            actions={[this.urlJump('/user')]}
          />
          <Wrap style={{ alignItems: 'center' }}>
            <Spin size="large" />
          </Wrap>
        </LayoutLR>
      );
    }
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[<M id="asset.myAsset" />, <M id="position.position" />]}
          actions={[this.urlJump('/user')]}
        />
        <Spin
          size="large"
          spinning={datasDesc === undefined || fixedAmount === undefined}
        >
          <Content>
            <div className="info">
              <div className="info-content">
                <div className="value" style={{ textAlign: 'center' }}>
                  {fixedAmount}
                  <span>WAL</span>
                </div>
              </div>
            </div>
            <div className="history">
              <M id="pkAddress.zchistory" />
            </div>
          </Content>
          <Wrap>
            <div>
              <Table
                columns={getColumns(this)}
                dataSource={datasDesc}
                pagination={pagination}
                onChange={this.handleTableChange}
              />
            </div>
          </Wrap>
        </Spin>
      </LayoutLR>
    );
  }
}

PositionList.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').positionList.toJS();
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
  )(PositionList)
);
