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
import U from 'whaleex/utils/extends';
import tabColumns from './tabColumns';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { injectIntl } from 'react-intl';
import { getTypeOptions } from './typeOptions.js';
import './style.less';
import { Select, Spin } from 'antd';
const Option = Select.Option;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;

export class DepoWithPage extends React.Component {
  constructor(props) {
    super(props);
    const typeSelect = U.getSearch('typeSelect');
    const currencySelect = U.getSearch('currencySelect');
    this.state = {
      typeSelect: typeSelect || 'all',
      currencySelect: currencySelect || 'WAL',
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
  componentWillUnmount() {
    clearTimeout(window.getdepoWithPageTimer);
  }
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  pageInit = props => {
    clearTimeout(window.getdepoWithPageTimer);
    const { currencyListObj } = props;
    const { currencySelect } = this.state;
    this.props.actions.getdepoWithPage({
      ...this.state,
      currencyId: currencyListObj[currencySelect].id,
      currency: currencySelect,
    });
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.setState({ current });
    this.getdepoWithPage(Object.assign({}, this.state, { current }));
  };
  handleTypeChange = e => {
    const { currencySelect } = this.state;
    this.urlJump(
      `/assetAction/depowithpage?currencySelect=${currencySelect}&typeSelect=${e}`
    )();
    this.setState({ typeSelect: e });
    this.getdepoWithPage(Object.assign({}, this.state, { typeSelect: e }));
  };
  handleChange = e => {
    const { typeSelect } = this.state;
    this.urlJump(
      `/assetAction/depowithpage?currencySelect=${e}&typeSelect=${typeSelect}`
    )();
    this.setState({ currencySelect: e, typeSelect });
    this.getdepoWithPage(
      Object.assign({}, this.state, {
        currencySelect: e,
        typeSelect,
        currencyChange: true,
      })
    );
  };
  getdepoWithPage = nextState => {
    const { currencyListObj } = this.props;
    const { currencySelect } = nextState;
    this.props.actions.getdepoWithPage({
      ...nextState,
      currencyId: currencyListObj[currencySelect].id,
      currency: currencySelect,
    });
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
    const { depositData = {}, tableLoading } = store;
    const { currencySelect, typeSelect } = this.state;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    if (_.isEmpty(currencyList)) {
      return (
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user"
          history={history}
          match={match}
          className="depoWithPage-layout"
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
    const options = currencyList.map((i, idx) => {
      const { shortName, id, icon } = i;
      return (
        <Option value={shortName} key={idx} className="dropdownOption">
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
    });
    // options.unshift(
    //   <Option value={'all'} key={'all'} className="dropdownOption">
    //     <div className="withdraw-dropdownOption">
    //       <span className="empty_box" />
    //       {formatMessage({ id: 'depoWithPage.all' })}
    //     </div>
    //   </Option>
    // );
    // const comProps = Object.assign({}, this.props, {
    //   tabsData: {
    //     tabDeposit: { content: _.get(store, 'depositList.depositRecords') },
    //     tabWithdraw: { content: _.get(store, 'withdrawList.withdrawRecords') },
    //   },
    //   tabsPagination: {
    //     tabDeposit: U.getPagination(_.get(store, 'depositList')),
    //     tabWithdraw: U.getPagination(_.get(store, 'withdrawList')),
    //   },
    //   tabColumns,
    //   tabsKey,
    //   handleTableChange: this.handleTableChange,
    //   urlJump: this.urlJump,
    // });
    const ExtraContent = (
      <div className="depoWithPage-extends">
        {/* <Select
          dropdownClassName={'selectDropdown'}
          defaultValue={typeSelect}
          value={typeSelect}
          style={{ width: 110, lineHeight: 35 }}
          onChange={this.handleTypeChange}
        >
          {getTypeOptions(currencySelect).map(({ key, label, query }, idx) => {
            return (
              <Option value={key} key={idx} className="dropdownOption">
                <div className="withdraw-dropdownOption">{label}</div>
              </Option>
            );
          })}
        </Select> */}
        <Select
          dropdownClassName={'selectDropdown'}
          showSearch
          defaultValue={currencySelect}
          value={currencySelect}
          style={{ width: 150, lineHeight: 35 }}
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
          {options}
        </Select>
      </div>
    );
    const {
      tab: { columns },
    } = tabColumns(undefined, false, this, this.props);
    let _columns = columns;
    if (typeSelect === 'all') {
      _columns = _columns.slice(0, -1);
    }
    const pagination = U.getPagination(depositData);
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user"
        history={history}
        match={match}
        className="depoWithPage-layout"
      >
        <DeepBreadcrumb
          arr={
            (typeSelect === 'deposit' && [
              <M id="asset.myAsset" />,
              <M id="asset.deposit" />,
              <M id="pkAddress.zchistory" />,
            ]) || [
              <M id="asset.myAsset" />,
              <M id="asset.withdraw" />,
              <M id="pkAddress.zchistory" />,
            ]
          }
          actions={[this.urlJump('/user'), this.props.history.goBack]}
          extend={ExtraContent}
        />
        {(currencyListObj && (
          <div style={{ padding: '0 20px' }}>
            <Table
              columns={_columns}
              dataSource={depositData.dataList}
              pagination={pagination}
              onChange={this.handleTableChange}
              loading={tableLoading}
            />
          </div>
        )) ||
          ''}
      </LayoutLR>
    );
  }
}

DepoWithPage.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').depoWithPage.toJS();
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
  )(DepoWithPage)
);
