import React from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import Loading from 'whaleex/components/Loading';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { chainModal } from 'whaleex/common/actionsChain.js';

import { Wrap } from './style.js';
import U from 'whaleex/utils/extends';

export default class IdRepeat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onOk = async () => {
    this.props.onOk();
  };
  render() {
    const { onCancel, onOk } = this.props;
    const lan = U.getUserLan(); //step-4 取当前语言

    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="IdRepeat">
          {/* <Icon type="close" onClick={onCancel} className="close-btn" /> */}
          <div className="content">
            <h1>
              <M id="components.securityTips" />
            </h1>
            <div className="padding">
              <p>
                <M id="components.idRepeat" />
              </p>
              <StyledButton
                className="confirm-btn"
                type="primary"
                onClick={this.onOk}>
                <M id="components.confirm" />
              </StyledButton>
            </div>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
