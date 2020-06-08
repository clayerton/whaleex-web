import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import M from 'whaleex/components/FormattedMessage';
const NetworkWrap = styled.div`
  color: #f27762;
  text-align: center;
  width: 60px;
  i {
    font-size: 20px;
  }
  .network-logo {
    height: 24px;
  }
  .network-msg {
    font-size: 10px;
  }
`;
let timer = undefined;
export default class NetworkDetector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { network = {} } = this.props;
    const { type, time } = network;
    if (_.isEmpty(network)) {
      return null;
    }
    if (type === 'delay' && time !== undefined) {
      return (
        <NetworkWrap>
          <div className="network-logo">
            <i className="iconfont icon-duankailianjie" />
          </div>
          <div className="network-msg">
            <M id="components.delayNetwork" values={{ time }} />
          </div>
        </NetworkWrap>
      );
    }
    if (type === 'close') {
      return (
        <NetworkWrap>
          <div className="network-logo">
            <i className="iconfont icon-wangluozhongduan" />
          </div>
          <div className="network-msg">
            <M id="components.closeNetwork" />
          </div>
        </NetworkWrap>
      );
    }
  }
}

NetworkDetector.PropTypes = {
  handler: PropTypes.function,
};
