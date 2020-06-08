import { Alert, Timeline } from 'antd';
const TimeItem = Timeline.Item;
import styled from 'styled-components';
export const StyledTimeItem = styled(TimeItem)`
  .text {
    color: ${props => props.textColor};
  }
  .ant-timeline-item-tail {
    border-color: ${props => props.color};
  }
`;
export const AlertWrap = styled.div`
  width: 580px;
  margin: 0 auto;
`;
export const ChainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  .imgPerson {
    display: flex;
    justify-content: center;
    margin: 0 0 30px 0;
    > img {
      width: 160px;
      height: 160px;
    }
  }
  .chainProgress {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: center;
  }
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

export const DepoContent = styled.div`
  width: 100%;
  margin-top: 70px;
  padding-top: 50px;
  border-top: 1px solid #f1f1f1;
  .depo-div {
    font-size: 13px;
    margin-left: 15%;
    height: 100%;
    margin-bottom: 20px;
  }
  .depo-div > label {
    color: #99acb6;
    display: inline-block;
    width: 80px;
  }
  .depo-div > span {
    font-family: 'rRegular';
    color: #2a4452;
  }
  .changeCny {
    font-size: 12px;
    letter-spacing: 1px;
    color: #abbdc6;
    padding-left: 20px;
  }
`;
