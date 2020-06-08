import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from './style.js';
import U from 'whaleex/utils/extends';

export default class PhoneExistModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { onCancel, onOk, notExist } = this.props;
    const lan = U.getUserLan(); //step-4 取当前语言
    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="PhoneExistModal">
          <Icon type="close" onClick={onCancel} className="close-btn" />
          <div className="content">
            <div className="padding">
              <h1>
                {(notExist && <M id="components.registeredNot" />) || (
                  <M id="components.registered" />
                )}
              </h1>
              <p>
                {(notExist && <M id="components.registeredLoginNot" />) || (
                  <M id="components.registeredLogin" />
                )}
              </p>
              <StyledButton
                className="single-btn"
                type="primary"
                onClick={onOk}>
                <M id="components.confirm" />
              </StyledButton>
            </div>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
