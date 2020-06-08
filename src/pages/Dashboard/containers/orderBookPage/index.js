import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { LayoutCT, M, Switch, Table } from 'whaleex/components';
import { Spin } from 'antd';
import { Breadcrumb } from 'whaleex/components';
import { List } from './tabCloumns/columns';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import './style.less';
import { injectIntl } from 'react-intl';
let timer;
export class OrderBookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { record: {} };
  }
  componentDidMount() {
    this.pageInit(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.pageInit(nextProps);
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }
  pageInit = props => {
    const { publicSymbol = [], match } = props;
    const { isPageInit } = this.state;
    if (!_.isEmpty(publicSymbol) && !isPageInit) {
      this.setState({ isPageInit: true });
      const [baseCurrency, quoteCurrency] = (
        match.params.symbolStr || ''
      ).split('_');
      let curSymbol = publicSymbol.filter(i => {
        return (
          i.baseCurrency === baseCurrency && i.quoteCurrency === quoteCurrency
        );
      })[0];
      this.setState({ partition: curSymbol.partition });
      // console.log(partition);
      const loop = () => {
        clearTimeout(timer);
        this.props.actions.getDeepData(
          (!!curSymbol && curSymbol.id) || publicSymbol[0].id,
          100,
          r => {
            this.setState({
              record: r,
            });
          }
        );
        timer = setTimeout(() => {
          loop();
        }, 5000);
      };
      loop();
    }
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      store,
      intl: { formatMessage },
      curSymbol,
    } = this.props;

    const [baseCurrency, quoteCurrency] = (match.params.symbolStr || '').split(
      '_'
    );
    if (_.isEmpty(this.state.record)) {
      return (
        <div className="spin-center">
          <Spin size="large" spinning={true} />
        </div>
      );
    }
    const asks = this.state.record.asks || [];
    const bids = this.state.record.bids || [];
    return (
      <LayoutCT history={history} match={match} backgroundShadow="hidden">
        <div className="flex-style order-book">
          {/* {baseCurrency}+{quoteCurrency} */}
          <List
            _name={formatMessage({ id: 'orderBookPage.maip1' })}
            list={bids}
            colorT="asks"
            type={formatMessage({ id: 'orderBookPage.mai1' })}
            match={match}
            partition={this.state.partition}
          />
          <div className="line_div" />
          <List
            _name={formatMessage({ id: 'orderBookPage.maip2' })}
            list={asks}
            colorT="bids"
            type={formatMessage({ id: 'orderBookPage.mai2' })}
            match={match}
            partition={this.state.partition}
          />
        </div>
      </LayoutCT>
    );
  }
}

OrderBookPage.propTypes = {};

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
  )(OrderBookPage)
);
