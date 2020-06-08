import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class List extends React.Component {
  render() {
    return <div>list</div>;
  }
}

List.PropTypes = {
  handler: PropTypes.function,
};
