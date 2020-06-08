import React from 'react';
import styled from 'styled-components';
const StarWrap = styled.span`
  font-size: 14px;
  margin: 0 8px 0 2px;
  color: ${props => {
    if (props.color) {
      return props.color;
    }
    if (props.check) {
      return 'rgb(93, 151, 182)';
    }
    return 'rgb(153, 172, 182);';
  }};
`;
export default class Star extends React.Component {
  render() {
    const { check, onClick, color } = this.props;
    if (check) {
      return (
        <StarWrap check onClick={onClick} color={color}>
          <i className="iconfont icon-icon_collect_done" />
        </StarWrap>
      );
    }
    return (
      <StarWrap onClick={onClick} color={color}>
        <i className="iconfont icon-icon_collect" />
      </StarWrap>
    );
  }
}
