import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
//TODO 为什么使用less后 @keyframes rotate111 会加后缀但是
//TODO animation: rotate111 不会加后缀

export default class Loading extends React.Component {
  render() {
    const { inverse, img } = this.props;
    return (
      <div className="ball-clip-rotate">
        {(img && (
          <div className="img-circle">
            <img src={img} />
          </div>
        )) || (
          <div className={(inverse && 'css-circle inverse') || 'css-circle'} />
        )}
      </div>
    );
  }
}

Loading.PropTypes = {
  handler: PropTypes.function,
};
