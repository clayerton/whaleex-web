import styled from 'styled-components';
import { InputNumber } from 'antd';
export const Addon = styled.div`
  padding: 0 10px;
`;
export const StyledInputNumber = styled(InputNumber)`
  input {
    color: #2a4452;
  }
`;
export const Wrap = styled.div`
  padding: 20px;
  min-height: 400px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Item = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
  margin: 30px 0 0 15px;
  float: left;
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
  label {
    flex-basis: 80px;
    color: #658697;
    text-align: right;
    margin-right: 20px;
    font-size: 13px;
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
  .input-position {
    .ant-input-group-addon {
      background-color: #fff;
      color: #2a4452;
      border: 1px solid #d9d9d9;
      border-left: none;
      cursor: pointer;
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
