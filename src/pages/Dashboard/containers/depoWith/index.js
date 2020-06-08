
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Breadcrumb } from 'whaleex/components';
import { pageMap, unZip } from 'whaleex/routeMap';

import { resetState } from './actions';
export class DepoWith extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.resetState();
  }
  componentWillReceiveProps(nextProps) {}

  render() {
    const { history, match, baseRoute, prefix } = this.props;
    return (
      <div>
        <Breadcrumb
          list={unZip(pageMap)}
          history={history}
          match={match}
          prefix={[baseRoute, prefix].join('')}
        />
        DepoWith
      </div>
    );
  }
}

DepoWith.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').admin.toJS();
}

export const mapDispatchToProps = {
  resetState,
};

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withRouter,
  withConnect
)(DepoWith);
