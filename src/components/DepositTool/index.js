import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Button, InputNumber, message } from 'antd';
import styled from 'styled-components';
import msgs from 'whaleex/utils/messages';
import M from 'whaleex/components/FormattedMessage';
import './style.less';

const RadioGroup = Radio.Group;
const Tool = styled.div`
  .cointool-input-number,
  .cointool-action-button {
    text-align: right;
    padding: 10px;
    button {
      margin-left: 10px;
    }
  }
  .cointool-input-number {
    padding: 20px 10px 20px 10px;
  }
`;
export default class DepositTool extends React.Component {
  constructor(props) {
    super(props);
    const { coinList } = props;
    this.state = { coinList, amount: 1 };
  }
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  onChangeNumber = value => {
    this.setState({
      amount: value,
    });
  };
  onOk = () => {
    const { value, amount } = this.state;
    if (!value) {
      message.warning(msgs.warning.noCoinSelect);
    } else {
      this.props.onOk(value, amount);
    }
  };
  render() {
    const { coinList, value } = this.state;
    const { loading } = this.props;
    return (
      <Tool>
        <div className="cointool-coin-list">
          <RadioGroup onChange={this.onChange} value={value}>
            {coinList.map(({ shortName, id }, idx) => {
              return (
                <Radio value={id} key={idx}>
                  {shortName}
                </Radio>
              );
            })}
          </RadioGroup>
        </div>
        <div className="cointool-input-number">
          <InputNumber
            min={0}
            defaultValue={1}
            onChange={this.onChangeNumber}
          />
        </div>
        <div className="cointool-action-button">
          <Button onClick={this.props.onCancel}>
            <M id="components.confirm" />
          </Button>
          <Button type="primary" onClick={this.onOk} loading={!!loading}>
            <M id="components.cancel" />
          </Button>
        </div>
      </Tool>
    );
  }
}

DepositTool.PropTypes = {};
