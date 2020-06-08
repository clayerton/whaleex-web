import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import M from 'whaleex/components/FormattedMessage';

const SwitchWrap = styled.div`
  font-size: 12px;
  color: #99acb6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  > div {
    width: 12px;
    height: 12px;
    background-color: #5d97b6;
    display: inline-block;
    border: 2px solid #fff;
    outline: 2px solid rgba(187, 187, 187, 1);
    cursor: pointer;
    margin-right: 10px;
  }
  > div.switch-not-checked {
    background-color: #fff;
  }
`;
import './style.less';

export default class Switch extends React.Component {
  constructor(props) {
    super(props);
    const { checked } = props;
    this.state = { checked };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.checked) {
      this.setState({ checked: nextProps.checked });
    }
  }
  setChecked = status => {
    this.setState({ checked: status });
  };
  render() {
    const { onSwitch, className, label } = this.props;
    const { checked } = this.state;
    const tabBarExtraContent = (
      <SwitchWrap className={className}>
        {(checked && (
          <div
            className="switch-checked"
            onClick={() => {
              onSwitch(false);
            }}
          />
        )) || (
          <div
            className="switch-not-checked"
            onClick={() => {
              onSwitch(true);
            }}
          />
        )}
        <span>{(label && label) || <M id="orderHistory.hideOthers" />}</span>
      </SwitchWrap>
    );
    return tabBarExtraContent;
  }
}

Switch.PropTypes = {
  handler: PropTypes.function,
};
