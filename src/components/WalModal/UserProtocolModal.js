import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon, Checkbox } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from './style.js';
import U from 'whaleex/utils/extends';
import Styled from 'styled-components';
const StyledFrame = Styled.div`
  iframe{
    height: 400px;
    border: none;
    width: 100%;
    padding: 0 10px 20px;
    max-height: 700px;
  }
`;
export default class UserProtocolModal extends React.Component {
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
        <Wrap className="UserProtocolModal">
          <Icon
            type="close"
            onClick={() => {
              onCancel();
            }}
            className="close-btn"
          />
          <div className="content">
            <h1>
              <M id="userProtocol.title" />
            </h1>
            <StyledFrame>
              <iframe
                src={
                  _config.static_url + '/static/userProtocol.html?lan=' + lan
                }
              />
            </StyledFrame>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
