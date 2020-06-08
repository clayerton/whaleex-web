import styled from 'styled-components';
export const Wrap = styled.div`
  padding: 20px 40px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-direction: column;
  min-height: 400px;
  font-size: 13px;
  .deposit-copy-button {
    button {
      width: 220px;
    }
  }
  .address {
    box-shadow: 6px 10px 14px 0 rgba(18, 52, 92, 0.1),
      2px 5px 5px 0 rgba(18, 46, 93, 0.04);
    background-color: #ffffff;
    border: solid 1px #eaeff2;
    padding: 20px;
    margin-bottom: 20px;
    width: 400px;
    font-size: 14px;
  }
  ${'' /* .remarks {
    box-shadow: 6px 10px 14px 0 rgba(18, 52, 92, 0.1),
      2px 5px 5px 0 rgba(18, 46, 93, 0.04);
    background-color: #ffffff;
    border: solid 1px #eaeff2;
    margin-bottom: 20px;
    width: 400px;
    .top {
      border-bottom: 1px solid #eaeff2;
      padding: 10px 20px;
      .font1 {
        letter-spacing: 0.6px;
        color: #99acb6;
        font-size: 12px;
      }
      .font2 {
        letter-spacing: 1.4px;
        color: #5d97b6;
        cursor: pointer;
        text-decoration: underline;
        float: right;
        font-size: 14px;
      }
    }
    .bottom {
      padding: 20px;
      .content {
        width: 360px;
        height: 32px;
        background-color: #eaeff2;
        padding: 9px 16px;
      }
    }
  }
  .remarkstips {
    letter-spacing: 0.5px;
    color: #f27762;
    margin-bottom: 50px;
  } */};
`;
export const Item = styled.div`
  display: flex;
  width: 480px;
  align-items: center;
  margin: 30px 0 30px 10px;
  .opacity-btn {
    opacity: 0.5;
  }
  .ant-select {
    height: 35px;
    .ant-select-selection {
      height: 35px;
    }
    .ant-select-selection__rendered {
      line-height: 33px;
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
  .convert {
    color: #99acb6;
    font-size: 12px;
    margin-left: 10px;
  }
  .ant-input-number-input-wrap {
    height: 100%;
    > input {
      height: 100%;
    }
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
    .font1 {
      letter-spacing: 0.7px;
      color: #99acb6;
      font-size: 14px;
    }
    .font2 {
      color: #5d97b6;
      margin-right: 90px;
      .font2-1 {
        color: #2a4452;
      }
    }
    .font3 {
      color: #5d97b6;
      cursor: pointer;
      float: right;
      text-decoration: underline;
    }
    .font4 {
      color: #5d97b6;
      float: right;
      margin-right: 19px;
      cursor: default;
      text-decoration: underline;
    }
  }
  .bottom-alert {
    width: 100%;
    color: #658697;
    font-size: 10px;
    line-height: 1.6;
    margin-bottom: 150px;
    p {
      margin: 0;
    }
  }
  .lock-tips {
    margin: 0;
    font-size: 10px;
    font-weight: 300;
    line-height: 1.6;
    letter-spacing: 1px;
    color: #658697;
  }
`;
