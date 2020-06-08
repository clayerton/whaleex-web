import styled from 'styled-components';
import { Spin, message, InputNumber } from 'antd';
export const Wrap = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 13px;
  button {
    width: 220px;
  }
  .guide-img {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0 50px 0;
    img {
      width: 250px;
      height: 250px;
    }
  }
  .guide-text {
    color: #f27762;
    font-size: 12px;
    padding: 20px;
    background-color: #fff;
  }
`;
export const Item = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
  margin: 30px 0 0 15px;
  float: left;
  .ant-select {
    height: 35px;
    .ant-select-selection {
      height: 35px;
    }
    .ant-select-selection__rendered {
      line-height: 33px;
    }
  }
  label {
    flex-basis: 120px;
    color: #658697;
    text-align: right;
    margin-right: 20px;
    font-size: 13px;
  }
  .inputTips {
    padding: 3px 10px;
    background-color: #f9fdff;
    font-size: 12px;
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
  .bottom-alert {
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
