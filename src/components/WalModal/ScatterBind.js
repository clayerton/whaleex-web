import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon, Select } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { Wrap } from './style.js';
import U from 'whaleex/utils/extends';
import styled from 'styled-components';
const Option = Select.Option;
const Item = styled.div`
  margin: 40px 0;
`;
const msgMap = {
  BIND: {
    info: <M id="components.SBindInfo" />,
  },
  ACTIVE: {
    info: <M id="components.activeInfo" />,
  },
  UNBIND: {
    info: <M id="components.unbingInfo" />,
  },
};
const msgTitleMap = {
  BIND: {
    info: <M id="components.SEosbind" />,
  },
  ACTIVE: {
    info: <M id="components.SEosactive" />,
  },
  UNBIND: {
    info: <M id="components.SEosunbind" />,
  },
};
const msgButtonMap = {
  BIND: {
    info: <M id="components.goBindEOS" />,
  },
  ACTIVE: {
    info: <M id="components.goActiveEOS" />,
  },
  UNBIND: {
    info: <M id="components.goUnbindEOS" />,
  },
};
export default class ScatterBind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = value => {
    this.setState({ selectAccount: value });
  };
  render() {
    const { onCancel, onOk, data, eosAccount, actionType } = this.props;
    const { accounts } = data;
    // console.log(accounts, data, eosAccount);
    const { selectAccount } = this.state;
    const msg = msgMap[actionType].info;
    const title = msgTitleMap[actionType].info;
    const buttonMsg = msgButtonMap[actionType].info;
    const defaultValue = selectAccount || accounts[0].name;
    const lan = U.getUserLan(); //step-4 取当前语言
    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="ScatterBind">
          <Icon
            type="close"
            onClick={() => {
              onCancel();
            }}
            className="close-btn"
          />
          <div className="content">
            <h1>{title}</h1>
            <div className="padding">
              <Item>
                <span className="tips">{msg}</span>
              </Item>
              <Item>
                {(!!eosAccount && <p>{eosAccount}</p>) || (
                  <Select
                    defaultValue={defaultValue}
                    style={{ width: 280 }}
                    onChange={this.handleChange}>
                    {accounts.map((i, idx) => {
                      const { name, blockchain, authority } = i;
                      return (
                        <Option value={name} key={idx}>
                          {name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Item>

              <StyledButton
                className="single-btn"
                type="primary"
                onClick={() => {
                  onOk(defaultValue);
                }}>
                {buttonMsg}
              </StyledButton>
            </div>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
