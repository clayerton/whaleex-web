import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CountDown } from 'whaleex/components';
import { injectIntl } from 'react-intl';
import M from 'whaleex/components/FormattedMessage';
import './style.less';
import {
  StyledInputWrap,
  StyledTitle,
  StyledMsgLine,
  StyledSpan,
} from './style.js';
class CodeItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: [] };
  }
  componentDidMount() {}
  onFocus = idx => {
    const input = this[`v${idx}`]; // 如果是textArea的话，const { textAreaRef } = this.inputRef;
    input && input.focus();
    // input.setSelectionRange(input.value.length, 0);
    // input.select(); // 可全部选中
  };
  updateState = (key, value) => {
    const { item, updateSuperState } = this.props;
    this.setState(preState => {
      const _preState = _.cloneDeep(preState);
      _.set(_preState, key, value);
      updateSuperState(item, _preState.code);
      return _preState;
    });
  };
  onChange = idx => e => {
    this.updateState(`code[${idx}]`, e.target.value.slice(-1));
    if (e.target.value !== '') {
      this.onFocus(idx + 1);
    }
  };
  onDelete = idx => () => {
    this.updateState(`code[${idx}]`, '');
    this.onFocus(idx - 1);
  };
  onSend = callBack => {
    const { item, items, onToggle, addressList, types } = this.props;
    const typeMap = {
      mailCode: <M id="components.mail" />,
      phoneCode: <M id="components.phone" />,
    };
    const addressMap = {
      mailCode: 'email',
      phoneCode: 'phone',
    };
    this.props.onSend(
      types[item],
      item,
      addressList[addressMap[item]],
      (status, msg) => {
        callBack(status);
        this.setState({ msg, msgStatus: status });
      }
    );
  };
  render() {
    const map = {
      mailCode: <M id="components.mail" />,
      phoneCode: <M id="components.phone" />,
      googleCode: <M id="components.google" />,
    };
    const {
      item,
      items,
      onToggle,
      addressList,
      intl: { formatMessage },
    } = this.props;
    const { msg, msgStatus } = this.state;
    let toggleComp = null;
    if (!!onToggle) {
      toggleComp = (
        <StyledSpan>
          <span onClick={onToggle}>
            <M
              id="components.switch"
              values={{ map: map[_.xor([item], items)[0]] }}
            />
          </span>
        </StyledSpan>
      );
    }
    return (
      <div className="code-item">
        <StyledTitle>
          <M id="components.verification" values={{ map: map[item] }} />
        </StyledTitle>
        <StyledMsgLine onClick={this.handleClick}>
          <span>
            <M id="components.input" values={{ num: '6', map: map[item] }} />
          </span>
          <span className={`msg ${(!msgStatus && 'error') || ''}`}>{msg}</span>
        </StyledMsgLine>
        <StyledInputWrap>
          {_.fill(Array(6), '*').map((i, idx) => {
            return (
              <input
                key={idx}
                ref={e => (this[`v${idx}`] = e)}
                type="text"
                onChange={this.onChange(idx)}
                onKeyDown={e => {
                  if (e.keyCode === 8) {
                    this.onDelete(idx)();
                  }
                }}
                value={this.state.code[idx] || ''}
              />
            );
          })}
          {item != 'googleCode' && (
            <CountDown
              label={formatMessage({ id: 'components.sendCode' })}
              onCount={this.onSend}
              className="send-count-down"
            />
          )}
        </StyledInputWrap>
        {toggleComp}
      </div>
    );
  }
}

CodeItem.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(CodeItem);
