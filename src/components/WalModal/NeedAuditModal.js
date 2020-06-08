import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'antd';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import U from 'whaleex/utils/extends';
import { Wrap } from './style.js';
export default class NeedAuditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { onCancel, onOk, extendData } = this.props; // hjl-2 通过传入数据来分情况显示身份审核提示框
    const lan = U.getUserLan(); //step-4 取当前语言

    // step-5 IntlProvider 包裹组件
    //hjl-2 根据条件显示不同 所需要的数据就是当前身份审核的状态  userConfig/idCardStatus AUDITING???
    const isAuditing =
      _.get(extendData, 'superProps.app.userConfig.idCardStatus') ===
      'AUDITING';
    if (isAuditing) {
      return (
        <IntlProvider locale={lan} messages={translationMessages[lan]}>
          <Wrap className="NeedAuditModal">
            <Icon type="close" onClick={onCancel} className="close-btn" />
            <div className="content">
              <h1>
                <M id="components.securityTips" />
              </h1>
              <div className="padding">
                <p>
                  <M id="components.authing" />
                </p>
                <StyledButton
                  className="confirm-btn"
                  type="primary"
                  onClick={onCancel}>
                  <M id="components.iKnow" />
                </StyledButton>
              </div>
            </div>
          </Wrap>
        </IntlProvider>
      );
    }
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="NeedAuditModal">
          <Icon type="close" onClick={onCancel} className="close-btn" />
          <div className="content">
            <h1>
              <M id="components.securityTips" />
            </h1>
            <div className="padding">
              <p>
                <M id="components.authentication" />
              </p>
              <StyledButton
                className="confirm-btn"
                type="primary"
                onClick={onOk}>
                <M id="components.goAuthentication" />
              </StyledButton>
            </div>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
