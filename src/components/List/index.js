import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
class List extends React.Component {
  render() {
    const { items, children, keyWidth } = this.props;
    return <div className="c-list">{children}</div>;
  }
}
class Item extends React.Component {
  render() {
    const { objArr, items, children, hide, keyWidth } = this.props;
    if (hide) {
      return null;
    }
    return (
      <div
        className={`c-item ${(objArr && objArr.length > 1 && 'multi-item') ||
          ''}`}
      >
        {(!objArr && <div style={{ display: 'block' }}>{children}</div>) ||
          objArr.map((obj, idx) => {
            const { key, value, keyBlock } = obj;
            return (
              <div key={idx}>
                <span
                  className={(!key && !keyBlock && 'hide') || ''}
                  style={{ width: keyWidth }}
                >
                  {(key && `${key} :`) || ''}
                </span>
                <span>{value}</span>
              </div>
            );
          })}
      </div>
    );
  }
}
List.PropTypes = {};
List.Item = Item;
export default List;
