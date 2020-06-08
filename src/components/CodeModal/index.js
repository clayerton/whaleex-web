import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CodeItem from './CodeItem.js';
import { Icon, message } from 'antd';
import './style.less';
import { CodeModalWrap } from './style.js';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import M from 'whaleex/components/FormattedMessage';
const CodeToggle = styled.div``;
export default class CodeModal extends React.Component {
  constructor(props) {
    super(props);
    const { codeLayout } = props;
    this.state = {
      activeItem: codeLayout.map(i => {
        if (typeof i === 'string') {
          return i;
        } else {
          return i[0];
        }
      }),
    };
  }
  updateState = (key, value) => {
    this.setState({ [key]: value });
  };
  onToggle = items => () => {
    const { activeItem } = this.state;
    const _activeItem = _.xor(activeItem, items);
    this.setState({ activeItem: _activeItem });
  };
  IsCodeReady = () => {
    const { activeItem } = this.state;
    return activeItem.every(item => {
      return (this.state[item] || []).join('').length === 6;
    });
  };
  onConfirm = () => {
    const { activeItem } = this.state;
    const params = activeItem.reduce((pre, cur) => {
      pre[cur] = this.state[cur].join('');
      return pre;
    }, {});
    this.props.onConfirm(params, (status, msg) => {
      if (!status) {
        message.warning(msg);
      }
    });
  };
  render() {
    const { codeLayout, addressList, onSend, types } = this.props;
    const { activeItem } = this.state;
    const IsCodeReady = this.IsCodeReady();
    return (
      <CodeModalWrap>
        <Icon
          type="close"
          onClick={this.props.onCancel}
          className="close-btn"
        />
        <div className="code-modal">
          {codeLayout.map((i, idx) => {
            if (typeof i === 'string') {
              if (activeItem.includes(i)) {
                return (
                  <CodeItem
                    key={idx}
                    item={i}
                    addressList={addressList}
                    onSend={onSend}
                    types={types}
                    updateSuperState={this.updateState}
                  />
                );
              } else {
                return null;
              }
            } else if (Array.isArray(i)) {
              const items = i.map((j, idx2) => {
                if (activeItem.includes(j)) {
                  return (
                    <CodeItem
                      key={`${idx}-${idx2}`}
                      item={j}
                      items={i}
                      onToggle={this.onToggle(i)}
                      addressList={addressList}
                      onSend={onSend}
                      types={types}
                      updateSuperState={this.updateState}
                    />
                  );
                } else {
                  return null;
                }
              });
              return <CodeToggle key={idx}>{items}</CodeToggle>;
            }
          })}
        </div>
        <div>
          <StyledButton
            className="confirm-btn"
            type="primary"
            disabled={!IsCodeReady}
            onClick={this.onConfirm}>
            <M id="components.confirm" />
          </StyledButton>
        </div>
      </CodeModalWrap>
    );
  }
}

CodeModal.PropTypes = {
  handler: PropTypes.function,
};
