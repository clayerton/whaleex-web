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
export default class MenuTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { match: { url: _url } } = nextProps;
    const { match: { url } } = this.props;
    return url !== _url;
  }
  urlJump = path => () => {
    const { history } = this.props;
    history.push(path);
  };
  render() {
    const { tree, match, prefix } = this.props;
    const selectKeys = findLevel(tree, prefix, match.url);
    const MenuComp = (
      <Menu
        defaultSelectedKeys={[selectKeys.join('-')]}
        style={{ lineHeight: '64px' }}
        mode="horizontal"
      >
        {tree.map(({ key, title, children = [] }, idx) => {
          if (!children.length) {
            return (
              <MenuItem
                key={idx}
                onClick={this.urlJump([prefix, key].join(''))}
              >
                <span>{title}</span>
              </MenuItem>
            );
          }
          return (
            <SubMenu
              key={idx}
              title={
                <span>
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
                    <span>{title}</span>
                  </MenuItem>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    );
    return MenuComp;
  }
}

MenuTop.PropTypes = {
  handler: PropTypes.function,
};
