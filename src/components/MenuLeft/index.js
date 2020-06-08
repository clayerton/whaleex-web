import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Layout } from 'antd';

import './style.less';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

const cutPrefix = (prefix, url) => {
  return url.slice(prefix.length);
};
const splitLevel = (prefix, url) => {
  const levels = cutPrefix(prefix, url)
    .split('/')
    .reduce(
      (obj, cur, idx) => {
        if (idx === 0) {
          obj[0] = cur;
        } else if (idx < 3) {
          obj[0] = `${obj[0]}/${cur}`;
        } else {
          obj.push(cur);
        }
        return obj;
      },
      ['']
    );
  return levels;
};
const findLevel = (tree, prefix, url) => {
  const levels = splitLevel(prefix, url);
  return levels.reduce((pre, cur, idx) => {
    let levelIdx = undefined;
    if (idx === 0) {
      levelIdx = _.findIndex(tree, ['key', cur]);
    } else {
      levelIdx = _.findIndex(tree[pre[idx - 1]].children, ['key', cur]);
    }
    pre.push(`${levelIdx}`);
    return pre;
  }, []);
};
export default class MenuLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { match: { url: _url } } = nextProps;
    const { match: { url } } = this.props;
    const { collapsed: _collapsed } = nextState;
    const { collapsed } = this.state;
    return url !== _url || collapsed !== _collapsed;
  }
  urlJump = path => () => {
    const { history } = this.props;
    history.push(path);
  };
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  render() {
    const { tree, match, prefix } = this.props;
    const selectKeys = findLevel(tree, prefix, match.url);
    const MenuComp = (
      <Menu
        theme="dark"
        defaultSelectedKeys={[`${selectKeys[0]}-${selectKeys[1]}`]}
        defaultOpenKeys={[selectKeys[0]]}
        mode="inline"
      >
        {tree.map(({ key, title, children }, idx) => {
          if (!children.length) {
            return (
              <MenuItem
                key={idx}
                onClick={this.urlJump([prefix, key].join(''))}
              >
                <Icon type="pie-chart" />
                <span>{title}</span>
              </MenuItem>
            );
          }
          return (
            <SubMenu
              key={idx}
              title={
                <span>
                  <Icon type="pie-chart" />
                  <span>{title}</span>
                </span>
              }
            >
              {children.map(({ key: key2, title }, idx2) => {
                return (
                  <MenuItem
                    key={`${idx}-${idx2}`}
                    onClick={this.urlJump([prefix, `${key}/${key2}`].join(''))}
                  >
                    <Icon type="pie-chart" />
                    <span>{title}</span>
                  </MenuItem>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    );
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        {MenuComp}
      </Sider>
    );
  }
}

MenuLeft.PropTypes = {
  handler: PropTypes.function,
};
