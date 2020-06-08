import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Dropdown, Icon } from 'antd';
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;
import './style.less';
import M from 'whaleex/components/FormattedMessage';
const StyledMenuItem = styled(MenuItem)`
  .help {
    text-align: center;
    a {
      font-size: 14px;
      color: #658697;
    }
  }
`;
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
export default class HelpAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMenuClick = ({ key }) => {
    if (key === 'notice') {
      _czc.push(['_trackEvent', '公告', '点击']);
    } else if (key === 'help') {
      _czc.push(['_trackEvent', '帮助', '点击']);
    } else if (key === 'workList') {
      _czc.push(['_trackEvent', '头部意见反馈', '点击']);
    }
    this.setState({ curSelect: key });
  };
  render() {
    const language = U.getUserLan();
    const url =
      language === 'zh'
        ? 'https://support.whaleex.com/hc/zh-cn/categories/360000918052-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83'
        : 'https://support.whaleex.com/hc/en-us';
    const menuMap = [
      {
        key: 'notice',
        label: <M id="components.notice" />,
        url: `${url}`,
      },
      {
        key: 'help',
        label: <M id="components.help" />,
        url: 'https://support.whaleex.com/hc/zh-cn',
      },
      {
        key: 'workList',
        label: <M id="components.workList" />,
        url: 'https://support.whaleex.com/hc/zh-cn/requests/new',
      },
    ];
    let menuItems = [];
    menuMap.forEach(({ key, label, url }, idx) => {
      menuItems.push(
        <StyledMenuItem key={key}>
          <div className="help">
            <a href={url} target="_blank" ref="nofollow">
              {label}
            </a>
          </div>
        </StyledMenuItem>
      );
      // if (idx < menuMap.length - 1) {
      //   menuItems.push(<MenuDivider key={'_' + idx} />);
      // }
    });
    const menu = <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
    return (
      <Dropdown overlay={menu}>
        <StyledWrap>
          <M id="components.noticeHelp" />
          {/* {menuMap
            .filter(({ key }) => key === curSelect)
            .map(({ key, label, url }, idx) => {
              return (
                <div style={{ display: 'inline-block' }} key={idx}>
                  {label}
                </div>
              );
            })} */}
          <StyledIcon type="caret-down" />
        </StyledWrap>
      </Dropdown>
    );
  }
}

HelpAction.PropTypes = {
  handler: PropTypes.function,
};
