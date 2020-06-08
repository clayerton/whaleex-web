import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import './style.less';
const StyledSpan = styled.span`
  display: inline-block;
  width: 92px;
  background: ${props => (props.disable && '#abbdc7') || 'rgb(83, 151, 180)'};
  height: 40px;
  line-height: 40px;
  display: inline-block;
  cursor: ${props => (props.disable && 'not-allowed') || 'pointer'};
`;
let timer = undefined;
export default class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countStep: 0,
      count: props.count || 60,
    };
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }
  startCount = () => {
    clearTimeout(timer);
    const { countStep, count } = this.state;
    const nextStep = (countStep + 1) % count;
    this.setState({ countStep: nextStep });
    if (nextStep === 0) {
      return;
    }
    timer = setTimeout(() => {
      this.startCount();
    }, 1000);
  };
  sendCode = () => {
    const { disableClick } = this.state;
    this.setState({ disableClick: true });
    const { onCount } = this.props;
    const { countStep } = this.state;
    if (countStep === 0 && !disableClick) {
      if (onCount) {
        onCount(isSuccess => {
          if (isSuccess) {
            this.startCount();
          }
        });
      } else {
        this.startCount();
      }
    }
    setTimeout(() => {
      this.setState({ disableClick: false });
    }, 1500);
  };
  render() {
    const { label, onCount, disabled, className } = this.props;
    const { count, countStep, disableClick } = this.state;
    return (
      <StyledSpan
        disable={disabled || countStep != 0 || disableClick}
        className={className}
        onClick={this.sendCode}>
        {(countStep > 0 && `${count - countStep}s`) || label}
      </StyledSpan>
    );
  }
}

CountDown.PropTypes = {
  handler: PropTypes.function,
};
