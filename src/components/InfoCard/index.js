import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class Card extends React.Component {
  render() {
    const { info } = this.props;
    return (
      <div className="verify-card">
        <ul>
          {info.map(({ key, value }, idx) => {
            return (
              (value && (
                <li key={idx}>
                  <span>{key}</span>
                  <span>{value}</span>
                </li>
              )) ||
              null
            );
          })}
        </ul>
      </div>
    );
  }
}

Card.PropTypes = {
  handler: PropTypes.function,
};
