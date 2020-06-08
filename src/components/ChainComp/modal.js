import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon, message } from 'antd';
import './style.less';
import { ChainModalWrap } from './style.js';
import {
  DeviceNew,
  Bind3Error,
  RegisterNew,
  ChainSuccess,
  AddressBind,
} from './modalStep';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
const CodeToggle = styled.div``;
export default class ChainModal extends React.Component {
  constructor(props) {
    super(props);
    const { data } = props;
    const { step } = data;
    let curPath = [0, 0];

    if (step === 'bind3Error') {
      curPath = [2, 0];
    } else if (step === 'deviceNew') {
      curPath = [0, 1];
    } else if (step === 'chainSuccess') {
      curPath = [0, 0];
    }
    this.state = {
      routeTree: [
        ['chainSuccess', 'deviceNew'],
        ['addressBind'],
        ['bind3Error'],
        // ['deviceNew', 'registerNew', 'deviceActive'],
        // ['chainSuccess'],
        // ['addressBind'],
        // ['bind3Error'],
      ],
      curPath,
    };
  }
  updateState = (key, value) => {
    this.setState({ [key]: value });
  };
  nextStep = (jump = 1, preData = {}) => {
    this.setState(preState => {
      let { curPath, routeTree } = preState;
      const [step, route] = curPath;
      let _step = step + jump;
      if (_step >= routeTree.length) {
        _step = routeTree.length - 1;
      }
      let _state = { ...preState, curPath: [_step, route], preData };
      return _state;
    });
  };
  getCurStep = () => {
    const { routeTree, curPath } = this.state;
    const [step, route] = curPath;
    return routeTree[step][route] || routeTree[step][0];
  };
  render() {
    const { onOk, onCancel, data } = this.props;
    const { preData = {} } = this.state;
    const curStep = this.getCurStep();
    return (
      <ChainModalWrap>
        {/* <Icon type="close" onClick={onCancel} className="close-btn" /> */}
        {curStep === 'deviceNew' && (
          <DeviceNew
            nextStep={this.nextStep.bind(null, 1)}
            onOk={onOk}
            onCancel={onCancel}
            data={data}
          />
        )}
        {/* {curStep === 'registerNew' && (
          <DeviceNew nextStep={this.nextStep.bind(null, 1)} data={data} />
        )} */}
        {curStep === 'chainSuccess' && (
          <ChainSuccess
            nextStep={this.nextStep.bind(null, 1)}
            onOk={onOk}
            data={data}
          />
        )}
        {curStep === 'addressBind' && (
          <AddressBind
            nextStep={this.nextStep.bind(null, 1)}
            onOk={onOk}
            data={data}
            preData={preData}
          />
        )}
        {curStep === 'bind3Error' && (
          <Bind3Error onCancel={onCancel} data={data} />
        )}
      </ChainModalWrap>
    );
  }
}

ChainModal.PropTypes = {
  handler: PropTypes.function,
};
