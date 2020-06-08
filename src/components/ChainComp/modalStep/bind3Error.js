import React from 'react';
import PropTypes from 'prop-types';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Step } from './style.js';
import './style.less';

export default class Bind3Error extends React.Component {
  render() {
    return (
      <Step className="Bind3Error">
        <div className="content">
          <h1>托管账户设置</h1>
          <p>
            您当前托管账户已经绑定3个秘钥对，请使用常用设备登录，或解绑秘钥对后使用新设备登录
          </p>
        </div>
        <StyledButton
          className="confirm-btn"
          type="primary"
          onClick={this.props.onCancel}>
          我知道了
        </StyledButton>
      </Step>
    );
  }
}

Bind3Error.PropTypes = {
  handler: PropTypes.function,
};
