import React from 'react';
import EmptyStatePng from './empty-state.png';
import { StyledEmptyDiv } from './style';

const EmptyState = () => (
  <StyledEmptyDiv>
    <div>
      <img src={EmptyStatePng} alt="empty-content" />
      <p>暂无相关内容</p>
    </div>
  </StyledEmptyDiv>
);

export default EmptyState;
