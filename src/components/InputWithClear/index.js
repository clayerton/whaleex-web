import React from 'react';
import PropTypes from 'prop-types';

import PasswordCheck from 'whaleex/components/PasswordCheck';
import Styled from 'styled-components';
import { Icon, Input, Tooltip } from 'antd';
import './style.less';
const IconWrap = Styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export default class InputWithClear extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  emitEmpty = () => {
    this.Input.focus();
    this.props.resetField(this.props.inputKey);
  };
  addExtend = data => () => {
    this.setState({ extendProps: data });
  };
  render() {
    const { tooltipMsg } = this.props;
    const { extendProps = {} } = this.state;
    let _props = _.omit(this.props, [
      'resetField',
      'inputKey',
      'tooltipMsg',
      'withEye',
    ]);
    _props = Object.assign({}, _props, extendProps);
    let suffixComp = <Icon type="close-circle" onClick={this.emitEmpty} />;
    if (this.props.withEyeDelete) {
      suffixComp = (
        <IconWrap>
          <i
            onClick={this.addExtend({
              type: (_props.type === 'string' && 'password') || 'string',
            })}
            className={`iconfont ${(_props.type === 'password' &&
              'icon-htmal5icon08') ||
              'icon-htmal5icon09'}`}
          />
          {/* <Icon type="close-circle" onClick={this.emitEmpty} /> */}
        </IconWrap>
      );
    }
    let suffix = this.props.value && !this.props.disabled ? suffixComp : null;
    if (!_.isEmpty(tooltipMsg)) {
      return (
        <Tooltip
          placement="right"
          title={<PasswordCheck tooltipMsg={tooltipMsg} />}>
          <Input
            {..._props}
            suffix={suffix}
            ref={node => (this.Input = node)}
            className={'input-hover-style ' + _props.className}
          />
        </Tooltip>
      );
    }
    return (
      <Input
        {..._props}
        suffix={suffix}
        ref={node => (this.Input = node)}
        className={'input-hover-style ' + _props.className}
      />
    );
  }
}

InputWithClear.PropTypes = {};
