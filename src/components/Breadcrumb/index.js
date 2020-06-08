import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
const BreadItem = Breadcrumb.Item;
import './style.less';
const findBread = (list, url) => {
  return list.filter(i => {
    const index = i.path.indexOf(':');
    if (index > 0) {
      return i.path.slice(0, index - 1) === url;
    }
    return i.path === url;
  })[0];
};
const listBread = url => {
  //列出所有可能的面包屑 最多7个
  const breads = [];
  const list = url.split('/');
  const pieces = list.some((i, idx) => {
    if (idx > 6) {
      return true;
    }
    if (idx === 0) {
      return false;
    }
    breads.push(list.slice(0, idx + 1).join('/'));
  });
  return breads;
};
const pickBread = (list, url) => {
  const breads = listBread(url).reduce((pre, cur) => {
    const breadPiece = findBread(list, cur);
    pre.push(breadPiece);
    return pre;
  }, []);
  return breads.filter(i => !!i);
};
export default class Bread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps) {
    const {
      match: { url: _url },
    } = nextProps;
    const {
      match: { url },
    } = this.props;
    return url !== _url;
  }
  urlJump = path => () => {
    const { history } = this.props;
    history.push(path);
  };
  addPrefix = (list, prefix) => {
    return list.map(({ path, title }) => {
      return { path: `${prefix}${path}`, title };
    });
  };
  render() {
    const {
      list,
      prefix,
      match: { path },
    } = this.props;
    const { addPrefix } = this;
    const breadBox = pickBread(addPrefix(list, prefix), path);
    return (
      <Breadcrumb style={{ margin: '16px 0' }}>
        {breadBox.map(({ path, title }, idx) => {
          return (
            <BreadItem
              key={idx}
              onClick={() => {
                if (idx === breadBox.length - 1) {
                  return;
                }
                const {
                  match: { params = {} },
                } = this.props;
                const { symbolStr } = params;
                if (symbolStr) {
                  // orderbook 页面找到回家的路
                  this.urlJump(path.replace(':symbolStr', symbolStr))();
                } else {
                  this.urlJump(path)();
                }
              }}
              style={{
                cursor: (idx === breadBox.length - 1 && 'default') || 'pointer',
              }}>
              {title}
            </BreadItem>
          );
        })}
      </Breadcrumb>
    );
  }
}

Bread.PropTypes = {
  handler: PropTypes.function,
};
