import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import {
  LayoutLR,
  M,
  Breadcrumb,
  DeepBreadcrumb,
  Table,
} from 'whaleex/components';
import SearchTool from './components/SearchTool';
import U from 'whaleex/utils/extends';
import tabColumns from './tabColumns';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { injectIntl } from 'react-intl';
import { getTypeOptions } from './typeOptions.js';
import './style.less';
import { Select, Spin, Checkbox, Pagination } from 'antd';
const Option = Select.Option;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;

export class DepoWithList extends React.Component {
  constructor(props) {
    super(props);
    const {
      intl: { formatMessage },
    } = this.props;
    this.state = {
      current: 1,
      init: false,
    };
  }
  componentDidMount() {
    const { currencyListObj } = this.props;
    if (!_.isEmpty(currencyListObj)) {
      this.pageInit(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { currencyListObj } = nextProps;
    if (!_.isEmpty(currencyListObj) && !this.state.init) {
      this.setState({ init: true });
      this.pageInit(nextProps);
    }
  }
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  pageInit = props => {
    const { currencyListObj } = props;
    this.props.actions.getSelectType();
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { searchParams } = this.state;
    this.searchFilter({ ...searchParams, pagination });
  };
  //翻页插件抽出
  handlePageChange = (page, pagesize) => {
    const { pagination } = this.props.store;
    const { searchParams } = this.state;
    this.searchFilter({
      ...searchParams,
      pagination: { ...pagination, current: page },
    });
  };
  searchFilter = params => {
    //set into Search
    const { assetType, reasons, currency } = params;
    this.urlJump(
      `/assetAction/depowith?${Object.keys({
        assetType,
        reasons,
        currency,
      })
        .reduce((pre, cur) => {
          if (params[cur]) {
            pre.push(`${cur}=${params[cur]}`);
          }
          return pre;
        }, [])
        .join('&')}`
    )();
    if (assetType === 'liquidAsset' && reasons === '') {
      this.setState({ hasCheckBox: true, searchParams: params });
    } else {
      this.setState({ hasCheckBox: false, searchParams: params });
    }
    //调用接口
    this.props.actions.getDepowithList(params);
  };
  needOrderChange = e => {
    const { searchParams = {} } = this.state;
    const checked = e.target.checked;
    if (!checked) {
      const checked = false;
      this.searchFilter({
        ...searchParams,
        needOrder: 'true',
        pagination: { current: 1, pageSize: 10 },
      });
    } else {
      this.searchFilter({
        ...searchParams,
        needOrder: 'false',
        pagination: { current: 1, pageSize: 10 },
      });
    }
  };
  showLeastRelease = () => {
    //
    const { currencyList } = this.props;
    // const minimumReleasePercent = _.get(
    //   this.props,
    //   'eosConfig.result.mineConfig.minimumReleasePercent'
    // );
    const { searchParams = {} } = this.state;
    const { assetType, currency } = searchParams;
    const currencyObj =
      currencyList.filter(({ shortName }) => shortName === currency)[0] || {};
    let { minimumRelease, minimumReleasePercent } = currencyObj;
    if (assetType === 'fixedAsset' && currency && minimumReleasePercent) {
      if (!+minimumRelease) {
        return (
          <p className="least-release">
            *{' '}
            <M
              id="tradeDetail.leastReleasePercent"
              values={{
                percent: U.percentNumber(minimumReleasePercent * 100).join(''),
              }}
            />
          </p>
        );
      }
      return (
        <p className="least-release">
          *{' '}
          <M
            id="tradeDetail.leastRelease"
            values={{
              percent: U.percentNumber(minimumReleasePercent * 100).join(''),
              leastNum: minimumRelease,
              currency,
            }}
          />
        </p>
      );
    }
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      tabsData = [],
      store,
      currencyListObj,
      currencyList,
      intl: { formatMessage },
    } = this.props;
    const {
      depositData = {},
      tableLoading,
      selectType,
      depositList = {},
      pagination,
    } = store;
    const { hasCheckBox } = this.state;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const needOrder = _.get(this.state, 'searchParams.needOrder', false);
    if (_.isEmpty(currencyList)) {
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
            arr={[<M id="asset.myAsset" />, <M id="asset.detail" />]}
            actions={[this.urlJump('/user')]}
          />
          <div className="spin-center">
            <Spin size="large" spinning={true} />
          </div>
        </LayoutLR>
      );
    }

    const {
      tab: { columns },
    } = tabColumns(undefined, false, this, this.props);
    let _columns = columns;
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
          arr={[<M id="asset.myAsset" />, <M id="asset.detail" />]}
          actions={[this.urlJump('/user')]}
        />
        {(currencyListObj && (
          <div style={{ padding: '0 20px 40px 20px' }}>
            <SearchTool
              formatMessage={formatMessage}
              getTypeOptions={getTypeOptions}
              that={this}
            />
            <Spin size="large" spinning={!depositList.content}>
              <Table
                columns={_columns}
                dataSource={depositList.content}
                //pagination={{ ...pagination, hideOnSinglePage: true }}
                pagination={false}
                onChange={this.handleTableChange}
                loading={tableLoading}
              />
            </Spin>
            {hasCheckBox && (
              <Checkbox
                onChange={this.needOrderChange}
                defaultChecked={(needOrder === 'false' && true) || false}
                style={{ marginTop: 40 }}
              >
                <M id="depoWithList.needOrder" />
              </Checkbox>
            )}
            {this.showLeastRelease()}
            <Pagination
              size="small"
              {...pagination}
              hideOnSinglePage
              onChange={this.handlePageChange}
              style={{ float: 'right', margin: '35px 0' }}
            />
          </div>
        )) ||
          ''}
      </LayoutLR>
    );
  }
}

DepoWithList.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').depoWithList.toJS();
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
  )(DepoWithList)
);
