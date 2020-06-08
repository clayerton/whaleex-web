import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { StyledWrap, StyledLayout, StyledContent } from './style.js';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { Breadcrumb } from 'whaleex/components';
const { SubMenu } = Menu;
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
      noBreadcrumb,
    } = this.props;
    return (
      <StyledWrap className={className}>
        <StyledLayout>
          {(!noBreadcrumb && (
            <Breadcrumb
              list={unZip(pageMap)}
              history={history}
              match={match}
              prefix={[BASE_ROUTE, prefix].join('')}
            />
          )) ||
            null}
          <StyledContent
            className={
              (backgroundShadow !== 'hidden' && 'box-shadow') ||
              'box-shadow-hidden'
            }
          >
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
