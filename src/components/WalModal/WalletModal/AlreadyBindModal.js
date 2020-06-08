import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import U from 'whaleex/utils/extends';
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from '../style.js';
import Styled from 'styled-components';
import { getTheme } from 'containers/LanguageProvider/actions.js';
export default class GuideModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { onCancel, onOk } = this.props;
    const lan = U.getUserLan(); //step-4 取当前语言
    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <ThemeProvider
          theme={() => {
            return getTheme();
          }}>
          <Wrap className="GuideModal">
            {/* <Icon
              type="close"
              onClick={() => {
                onCancel();
              }}
              className="close-btn"
            /> */}
            <div className="content">
              <h1>
                <M id="wallet.alreadyBind" />
              </h1>
              <div className="padding">
                <p>
                  <M id={'wallet.alreadyBindJump'} values={{ minute: 2 }} />
                </p>
                <div>
                  <StyledButton
                    style={{ width: '30%' }}
                    className="confirm-btn"
                    type="primary"
                    onClick={onOk}>
                    <M id="components.iKnow" />
                  </StyledButton>
                </div>
              </div>
            </div>
          </Wrap>
        </ThemeProvider>
      </IntlProvider>
    );
  }
}
