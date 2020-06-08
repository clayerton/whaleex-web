import { Alert } from 'antd';
import styled from 'styled-components';
export const AlertWrap = styled.div`
  width: 580px;
  margin: 0 auto;
`;
export const DePo = styled.div`
  .depoWithDetail-box {
    padding: 20px;
  }
`;
export const StyledAlert = styled(Alert)`
  &.ant-alert {
    border: none;
    background: #fff;
    color: #e14c4c;
    font-size: 13px;
    margin-bottom: 20px;
  }
`;
export const TopItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    cursor: pointer;
    width: 160px;
    height: 160px;
  }
  .error-process {
    text-align: center;
    margin-top: 40px;
    img {
      width: 48px;
      height: 48px;
    }
    p {
      color: #f27762;
      font-size: 14px;
      letter-spacing: 0.9px;
      margin: 10px 0 15px 0;
    }
  }
`;
export const DepoStatusBar = styled.div`
  width: 100%;
  .depo-status {
    cursor: pointer;
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
  }
  .mapDetail {
    width: 17%;
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
    color: #99acb6;
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

  .error-bar {
    width: 100%;
    height: 5px;
    background-color: #eaeff2;
  }

  .error-active {
    background-color: #5d97b6;
    color: red;
  }
  .mapDetail:nth-child(3) {
    .error-active {
      background-color: #f27762 !important;
    }
    .error-bar {
      background-color: #f27762 !important;
    }
    .error-activeText {
      color: #f27762;
    }
  }
  .activeText {
    color: #5d97b6;
  }
  .error-activeText {
    color: #5d97b6;
  }
  .activeText > span:first-child {
    margin-bottom: 5px;
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
    width: 120px;
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
