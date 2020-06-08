import { Alert } from 'antd';
import styled from 'styled-components';
export const AlertWrap = styled.div`
  width: 580px;
  margin: 0 auto;
`;
export const StyledAlert = styled(Alert)`
  &.ant-alert {
    border: none;
    background: #fff3e7;
    color: #e14c4c;
    margin-top: 20px;
    font-size: 13px;
    margin-bottom: 20px;
  }
`;
export const ChainStatusBar = styled.div`
  width: 100%;
  .depo-status {
    cursor: pointer;
    margin-top: 50px;
    display: flex;
    justify-content: flex-start;
  }
  .mapDetail {
    width: 20%;
  }
  ._circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #eaeff2;
  }
  .title-line {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    font-size: 12px;
    margin-left: 90%;
    width: 90%;
  }
  .detail-line {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }
  .bar {
    width: 100%;
    height: 5px;
    background-color: #eaeff2;
  }

  .active {
    background-color: #5d97b6;
    color: red;
  }
  .activeText {
    color: #5d97b6;
  }
`;
