import styled from 'styled-components';
export const MineButton = styled.div`
  img {
    width: 16px;
    margin-right: 8px;
  }
`;
export const Wrap = styled.div`
  .error {
    color: #f27762;
    display: inline-block;
    margin-top: 30px;
  }
  width: 100%;
  padding: 0px 17px 5px;
  color: #4e6a79;
  font-size: 12px;
  position: relative;
  .setting-wrap {
    > div {
      margin: 10px;
      .ant-input-number {
        width: 200px;
      }
      > span:first-child {
        display: inline-block;
        width: 120px;
      }
    }
  }
  .key {
    color: #99acb6;
  }
  .input-wrap {
    height: 32px;
    margin: 5px 0 12px 0;
    .ant-input-number {
      width: 100%;
    }
  }
`;
export const Header = styled.div`
  padding: 10px 5px;
  display: flex;
  padding-bottom: 0;
  .text-right {
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .large {
    font-weight: bold;
    font-size: 14px;
  }
  > div {
    flex: 1;
    &.left {
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
    &.right {
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      border-left: 1px solid #eaeff2;
    }
  }
`;
export const Left = styled.div`
  flex: 1;
  width: 50%;
  padding-right: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .button {
    > button {
      width: 100%;
      height: 35px;
      border-radius: 4px;
    }
  }
  .text-line {
    text-align: center;
    color: #658697;
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    .error {
      color: #f27762;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .stop-mine {
      cursor: pointer;
      white-space: nowrap;
    }
  }
`;
export const Right = styled.div`
  flex: 1;
  width: 50%;
  padding-left: 15px;
  box-sizing: border-box;
  position: relative;
  .tutorial-link {
    position: absolute;
    bottom: 10px;
    right: 0;
  }
  .input-wrap {
    > .ant-radio-group {
      width: 100%;
      display: flex;
      > label {
        flex: 1;
        text-align: center;
      }
      > label:nth-child(2) {
        margin: 0 20px;
      }
    }
  }
`;
