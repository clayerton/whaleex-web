
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { LayoutLR, M, Switch, Table } from 'whaleex/components';

import { Breadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import './style.less';
export class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.actions.resetState();
  }
  componentWillReceiveProps(nextProps) {}

  render() {
    const { history, match, baseRoute, prefix } = this.props;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));

    return (
      <LayoutLR {...this.props}
        tabPath={tabPath}
        curPath="/asset/address"
        history={history}
        match={match}>
        <div className="flex-style">
          <M id="demo.poperate" />
        </div>
      </LayoutLR>
    );
  }
}

Address.propTypes = {};

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

export default compose(
  withRouter,
  withConnect
)(Address);
