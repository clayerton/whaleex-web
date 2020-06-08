import styled from 'styled-components';
export const Step = styled.div`
  &.AddressBind,
  &.AddressUnbind {
    padding: 40px 40px;
  }
  &.AddressBindHistory {
    padding: 10px 40px;
  }
  &.AddressBind {
    padding: 20px 40px;
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-direction: column;
    min-height: 400px;
    font-size: 13px;
    > div {
      flex: 1;
      border-right: 1px solid #eaeff2;
      padding: 5px;
    }
    > div:last-child {
      border: none;
    }
  }
`;
export const Item = styled.div`
  display: flex;
  width: 480px;
  align-items: center;
  margin: 30px 0 30px 10px;
  &.alertItem{
    a{
      text-decoration: none;
    }
    .url-style{
      color:#f27762;
    }
  }
  h1 {
    color: #4e6a79;
    font-weight: normal;
    text-align: left;
    font-size: 18px;
  }
  .text-align-right{
    text-align: right;
    width: 100%;
  }
  .left-padding {
    flex-basis: 80px;
    padding-right: 20px;
    text-align: right;
    color: #99acb6;
    > span {
      width: 24px;
      height: 24px;
      position: relative;
      top: 2px;
      background-color: #abbdc6;
      color: #fff;
      display: inline-block;
      text-align: center;
      line-height: 24px;
      border-radius: 24px;
    }
  }
  .prompt {
    width: 100%;
    color: #f27762;
    font-size: 10px;
    letter-spacing: 0.6px;
  }
  label {
    flex-basis: 80px;
    color: #658697;
    text-align: right;
    margin-right: 20px;
    font-size: 10px;
  }
  .little-guide {
    font-size: 13px;
    color: #99acb6;
  }
  .inside {
    display: inline-block;
    max-width: 250px;
    word-break: break-all;
    color: #2a4452;
    margin-right: 50px;
  }
  p.top-guide {
    display: inline-block;
    width: 440px;
    color: #2a4452;
  }
  p.bottom-alert,
  p.top-alert {
    display: inline-block;
    width: 400px;
    color: #f27762;
    background-color: #fff;
    padding: 20px;
    font-size: 12px;
  }
  p.user-alert-outter {
    font-size: 12px;
    color: #f27762;
    margin: 10px 0;
  }
  .copy {
    font-size: 14px;
    color: #5d97b6;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 15px;
    float: right;
  }
  .copy-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  img {
    box-shadow: 0 11px 11px 0 rgba(207, 217, 223, 0.63),
      0 2px 3px 0 rgba(183, 199, 208, 0.59);
    background-color: #ffffff;
    border: solid 1px #eaeff2;
  }

  .gery {
    color: #99acb6 !important;
  }
  .item-grey {
    width: 100%;
    background-color: rgba(234, 239, 242, 0.48);
    border: solid 1px #eaeff2;
    padding: 10px;
    color: #2a4452;
    font-size: 12px;
    .font1 {
      letter-spacing: 0.7px;
      color: #99acb6;
      font-size: 14px;
    }
    .font2 {
      color: #5d97b6;
      font-size: 12px;
      .font2-1 {
        color: #2a4452;
      }
    }
    .font3 {
      color: #5d97b6;
      cursor: pointer;
      float: right;
      text-decoration: underline;
      font-size: 12px;
    }
    .font4 {
      font-size: 12px;
      color: #5d97b6;
      float: right;
      margin-right: 19px;
      cursor: default;
      text-decoration: underline;
    }
  }
    .bottom {
      padding: 20px;
      .content {
        width: 360px;
        background-color: #eaeff2;
      }
    }
  }
  .remarkstips {
    letter-spacing: 0.5px;
    color: #f27762;
    margin-bottom: 50px;
    font-size: 10px;
  }
  .message {
    margin: 0 0 150px 0;
    line-height: 1.6;
    letter-spacing: 1px;
    color: #658697;
    font-size: 10px;
  }
`;
export const CopySuccess = styled.div`
  height: 14px;
  font-size: 14px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.8);
  i {
    color: #52c41a;
    margin-right: 5px;
  }
`;
