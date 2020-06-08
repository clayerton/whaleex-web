import styled from 'styled-components';
import { Button } from 'antd';

export const AuthWrap = styled.div`
  background: #fff;
  border: solid 1px #dfecf3;
  box-shadow: 0 5px 6px 0 rgba(124, 166, 188, 0.17),
    2px 5px 4px 0 rgba(47, 88, 109, 0.06),
    0 13px 20px 0 rgba(108, 162, 191, 0.15);
`;
export const Title = styled.div`
  padding: 15px 40px;
  border-bottom: 1px solid rgba(223, 236, 243, 0.5);
  > span:first-child {
    color: #4e6a79;
    font-size: 16px;
  }
  > span:last-child {
    color: #99acb6;
    font-size: 12px;
    margin-left: 12px;
  }
  > .right {
    float: right;
    button {
    }
  }
`;
export const AuthItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 40px;
  border-bottom: 1px solid rgba(223, 236, 243, 0.5);
  &.inside {
    background-color: rgba(250, 253, 255, 1);
    flex-direction: column;
    padding-left: 90px;
  }
`;
export const ItemDetail = styled.div`
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  .icon {
    width: 30px;
    background: #5d97b6;
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 2px;
    i {
      font-size: 18px;
      &.mail {
        font-size: 13px;
      }
    }
  }
`;
export const ItemValue = styled.div`
  margin-left: 20px;
  font-size: 13px;
  color: #99acb6;
  > div {
    margin: 5px 0;
  }
  .key {
    color: #4e6a79;
    margin-right: 10px;
  }
  i.anticon {
    margin-right: 2px;
  }
  .active {
    color: #2a4452;
  }
  .is-active {
    color: #44e044;
  }
  > div:last-child {
    font-size: 12px;
  }
`;
export const ItemSwitch = styled.div`
  > button.ant-btn {
    width: 110px;
    padding: 0;
  }
  .cpu-set-item {
    cursor: pointer;
  }
  .audit-result,
  .cpu-set-item {
    font-size: 13px;
    color: #2a4452;
    height: 100%;
    line-height: 1.8;
  }
`;
