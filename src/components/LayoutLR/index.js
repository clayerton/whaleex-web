import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';

import {
  StyledWrap,
  StyledLayout,
  StyledContent,
  StyledSider,
} from './style.js';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { Breadcrumb } from 'whaleex/components';
const { SubMenu } = Menu;
import M from 'whaleex/components/FormattedMessage';
import U from 'whaleex/utils/extends';
import './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const MenuItem = Menu.Item;
export default class LayoutLR extends React.Component {
  render() {
    const {
      children,
      history,
      match,
      tabPath,
      curPath,
      className,
      backgroundShadow,
      eosConfig,
    } = this.props;
    const invitePercent = _.get(
      eosConfig,
      'result.mineConfig.invitePercent',
      '0'
    );
    // <Breadcrumb
    //   list={unZip(pageMap)}
    //   history={history}
    //   match={match}
    //   prefix={[BASE_ROUTE, prefix].join('')}
    // />
    return (
      <StyledWrap className={className}>
        <StyledLayout>
          <StyledSider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[curPath]}
              style={{ height: '100%' }}>
              {tabPath.map(({ path, title, icon }) => {
                return (
                  <MenuItem
                    key={path}
                    style={{ fontSize: 14 }}
                    onClick={() => {
                      history.push([BASE_ROUTE, prefix, path].join(''));
                    }}>
                    <i className={`iconfont ${icon}`} />
                    {title}
                    {path === '/user/invite' ? (
                      <span className="extra-tip">
                        <M
                          id="components.maid"
                          values={{
                            data: U.percentNumber(invitePercent).join(''),
                          }}
                        />
                      </span>
                    ) : (
                      ''
                    )}
                  </MenuItem>
                );
              })}
            </Menu>
          </StyledSider>
          <StyledContent
            className={
              (backgroundShadow !== 'hidden' && 'box-shadow') ||
              'box-shadow-hidden'
            }>
            {children}
          </StyledContent>
        </StyledLayout>
      </StyledWrap>
    );
  }
}

LayoutLR.PropTypes = {
  handler: PropTypes.function,
};
