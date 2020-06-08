import React from 'react';
import PropTypes from 'prop-types';
import U from 'whaleex/utils/extends';
import styled from 'styled-components';

import { Modal } from 'antd';
import './style.less';
const StyledModal = styled(Modal)`
  top: 50px;
  .ant-modal-content {
    min-height: 500px;
    display: flex;
    align-items: center;
  }
`;
export default class ImgPreview extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = { show: false, data: { imgs: [], idx: 0 } };
    this.state = this.initialState;
  }
  componentWillReceiveProps(nextProps) {
    const { show, data } = nextProps;
    if (show) {
      this.setState({ show, data });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff([nextProps, this.props], ['show']);
    const isStateChanged = U.isObjDiff([nextState, this.state], ['show']);

    if (isChanged || isStateChanged) {
      return true;
    }
    return false;
  }
  handleCancel = () => {
    this.setState(this.initialState);
  };
  render() {
    const { show, data = {} } = this.state;
    const { imgs, idx } = data;
    return (
      <StyledModal
        visible={show}
        footer={null}
        onCancel={this.handleCancel}
        width="80%"
      >
        <img style={{ width: '100%' }} src={imgs[idx]} />
      </StyledModal>
    );
  }
}

ImgPreview.PropTypes = {
  handler: PropTypes.function,
};
