import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class Line extends React.Component {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

Line.PropTypes = {};
