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
    const { onCancel, onOk, data } = this.props;
    const { userConfig, step } = data;
    const lan = U.getUserLan(); //step-4 取当前语言

    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <ThemeProvider
          theme={() => {
            return getTheme();
          }}>
          <Wrap className="GuideModal">
            <Icon
              type="close"
              onClick={() => {
                onCancel();
              }}
              className="close-btn"
            />
            <div className="content">
              <h1>
                <M id="walModal.redTitle" />
              </h1>
              <div className="padding">
                <p>
                  <M id={'walModal.redStep' + step} />
                </p>
                <div>
                  {((step === 1 || step === 2) && (
                    <StyledButton
                      style={{ width: '30%' }}
                      className="confirm-btn"
                      type="primary"
                      onClick={onOk.bind(
                        null,
                        '/usercenter/pkAddress/bind?force=true'
                      )}>
                      <M id="walModal.goBind" />
                    </StyledButton>
                  )) ||
                    null}
                  {((step === 1 || step === 3) && (
                    <StyledButton
                      style={{ width: '30%' }}
                      className="confirm-btn"
                      type="primary"
                      onClick={onOk.bind(
                        null,
                        '/usercenter/auth?type=1&sytep=1'
                      )}>
                      <M id="walModal.goAuth" />
                    </StyledButton>
                  )) ||
                    null}
                </div>
              </div>
            </div>
          </Wrap>
        </ThemeProvider>
      </IntlProvider>
    );
  }
}
