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
import { Wrap } from './style.js';
import * as allActions from './actions';
import './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export class PositionUnlockList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.pageInit(this.props);
  }
  componentWillReceiveProps(nextProps) {
    // const { convertMap_digital, legaldigital, store } = nextProps;
    // if (!_.isEmpty(convertMap_digital) && !!legaldigital && !timer) {
    //   this.pageInit(nextProps);
    // }
  }
  componentWillUnmount() {}
  pageInit = props => {
    this.props.actions.getUnlockList();
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const { current } = pagination;
    // 请求接口
    this.props.actions.getUnlockList(current - 1);
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      intl: { formatMessage },
      store,
    } = this.props;
    const { currencySelect, inputValue, loading } = this.state;
    const { unlocklist, remotePag } = store;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    if (_.isEmpty(store)) {
      return (
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user"
          history={history}
          match={match}
          className="depoWithList-layout">
          <DeepBreadcrumb
            arr={[<M id="asset.myAsset" />, <M id="position.unlocklist" />]}
            actions={[this.urlJump('/user')]}
          />
          <Wrap style={{ alignItems: 'center' }}>
            <Spin size="large" />
          </Wrap>
        </LayoutLR>
      );
    }
    let pagination = remotePag;

    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}>
        <DeepBreadcrumb
          arr={[<M id="asset.myAsset" />, <M id="position.unlocklist" />]}
          actions={[this.urlJump('/user')]}
        />
        <Spin size="large" spinning={unlocklist === undefined}>
          <Wrap>
            <div>
              <Table
                columns={getColumns(this)}
                dataSource={unlocklist}
                pagination={pagination}
                onChange={this.handleTableChange}
                loading={this.state.loading}
              />
            </div>
          </Wrap>
        </Spin>
      </LayoutLR>
    );
  }
}

PositionUnlockList.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').positionUnlockList.toJS();
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
  )(PositionUnlockList)
);
