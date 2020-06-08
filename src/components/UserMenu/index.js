import React from 'react';
import PropTypes from 'prop-types';
import { languages } from 'i18n.js';
import styled from 'styled-components';
import { Menu, Dropdown, Icon } from 'antd';
import U from 'whaleex/utils/extends';
import M from 'whaleex/components/FormattedMessage';
const MenuItem = Menu.Item;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
import './style.less';
const StyledWrap = styled.span`
  cursor: pointer;
  white-space: nowrap;
`;
const StyledIcon = styled(Icon)`
  font-size: 10px;
  position: relative;
  top: -2px;
  margin-left: 10px;
`;
export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleMenuClick = ({ key }) => {
    const { logout, history } = this.props;
    const pathMap = {
      asset: '/user',
      user: '/user/setting',
      tradeDetail: '/user/tradeDetail',
    };
    if (key === 'logout') {
      logout(history);
    } else {
      history.push([BASE_ROUTE, prefix, pathMap[key]].join(''));
    }
  };
  render() {
    const { history, permissions = {} } = this.props;
    const tabs = [
      { key: 'asset', label: <M id="withdraw.userset" /> },
      { key: 'tradeDetail', label: <M id="route.tradeDetail" /> },
      { key: 'user', label: <M id="pkAddress.user" /> },
      { key: 'logout', label: <M id="components.loginOut" /> },
    ];
    const menuItems = tabs.map(({ key, label }) => {
      return (
        <MenuItem key={key}>
          <span
            style={{
              color: '#658697',
              fontSize: '14px',
            }}
          >
            {label}
          </span>
        </MenuItem>
      );
    });
    const menu = <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
    const userId = sessionStorage.getItem('user') || permissions.user_name;
    return (
      <Dropdown overlay={menu}>
        <StyledWrap>
          <span>{U.infoMosaic(userId)}</span>
          <StyledIcon type="caret-down" />
        </StyledWrap>
      </Dropdown>
    );
  }
}

UserMenu.PropTypes = {
  handler: PropTypes.function,
};
