import styled from 'styled-components';
export const StyledViewWrap = styled.div`
  &.kline {
    position: relative;
    .TVChartContainer {
    }
    .DeepChart {
      position: absolute;
      top: 39px;
      left: 0;
      padding: 0;
      height: calc(100% - 55px);
      background: #fff;
    }
  }
`;
export const CoinDetailSpan = styled.span`
  text-align: center;
  display: grid;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
  color: rgba(42, 68, 82, 0.6);
  &:hover {
    color: #5d97b6;
  }
`;
