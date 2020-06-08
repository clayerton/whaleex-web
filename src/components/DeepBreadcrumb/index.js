import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import './style.less';
export const Bread = styled.div`
  color: #99acb6;
  padding: 20px 40px;
  border-bottom: 1px solid #eaeff2;
  * {
    user-select: none;
  }
  & > div {
    display: inline-block;
    > i {
      margin: 0 10px;
    }
    > span {
      cursor: pointer;
    }
  }
  & .last-class {
    color: #2a4452;
  }
  .extend-action {
    float: right;
    color: #5d97b6;
  }
`;
export default class DeepBreadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { arr, actions = [], extend } = this.props;
    return (
      <Bread>
        {arr.map((i, idx) => {
          const suffix =
            (idx < arr.length - 1 && <Icon type="right" />) || null;
          const lastClass = idx === arr.length - 1 && arr.length > 1;
          return (
            <div key={idx} className={(lastClass && 'last-class') || ''}>
              <span
                onClick={() => {
                  if (typeof actions[idx] === 'function') {
                    actions[idx]();
                  }
                }}>
                {i}
              </span>
              {suffix}
            </div>
          );
        })}
        <div className="extend-action">{extend}</div>
      </Bread>
    );
  }
}

DeepBreadcrumb.PropTypes = {
  handler: PropTypes.function,
};
