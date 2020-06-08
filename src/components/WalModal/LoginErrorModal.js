import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon, Checkbox } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from './style.js';
import U from 'whaleex/utils/extends';

export default class LoginErrorModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = e => {
    this.setState({ checked: e.target.checked });
  };
  render() {
    const {
      onCancel,
      onOk,
      data: { LoginErrorTimes },
    } = this.props;
    const { checked } = this.state;
    const lan = U.getUserLan(); //step-4 取当前语言

    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="LoginErrorModal">
          <Icon
            type="close"
            onClick={() => {
              onCancel(checked);
            }}
            className="close-btn"
          />
          <div className="content">
            <h1>
              <M id="components.passError" />
            </h1>
            <p>
              <M
                id="components.passTips"
                values={{ tips: `${+LoginErrorTimes + 1}` }}
              />
            </p>
            <Checkbox onChange={this.onChange} className="check-box">
              <M id="components.noTips" />
            </Checkbox>
          </div>
          <StyledButton
            className="confirm-btn"
            type="primary"
            onClick={() => {
              onOk(checked);
            }}>
            <M id="components.confirm" />
          </StyledButton>
        </Wrap>
      </IntlProvider>
    );
  }
}
