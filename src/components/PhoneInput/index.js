import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Input } from 'antd';
import './style.less';

export default class InputWithClear extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: undefined };
  }
  componentDidMount() {}
  emitEmpty = () => {
    this.Input.focus();
    this.props.resetField(this.props.inputKey);
    this.setState({
      value: undefined,
    });
  };
  onChange = e => {
    const { value: values } = e.target;
    // const values = value.split(' ').join('');
    const reg = /^[0-9]*$/;
    if (
      (!isNaN(values) && reg.test(values)) ||
      values === '' ||
      values === '-'
    ) {
      this.props.onChange(values);
      this.setState({
        value: e.target.value,
      });
    }
  };

  render() {
    const { value: initialValue } = this.props;
    const suffix =
      this.props.value && !this.props.disabled ? (
        <Icon type="close-circle" onClick={this.emitEmpty} />
      ) : null;
    let _props = _.omit(this.props, ['resetField', 'inputKey']);
    const { value = initialValue || '' } = this.state;
    // const a = [
    //   value
    //     .slice(0, 3)
    //     .split(' ')
    //     .join(''),
    //   value
    //     .slice(3, 8)
    //     .split(' ')
    //     .join(''),
    //   value
    //     .slice(8, 13)
    //     .split(' ')
    //     .join(''),
    // ].filter(i => !!i);
    // const b = a.join(' ');

    return (
      <Input
        {..._props}
        value={value}
        suffix={suffix}
        ref={node => (this.Input = node)}
        className={'input-hover-style ' + _props.className}
        onChange={this.onChange}
      />
    );
  }
}

InputWithClear.PropTypes = {};
