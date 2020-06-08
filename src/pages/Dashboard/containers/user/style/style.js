import { Alert } from 'antd';
import styled from 'styled-components';
export const StatusMsg = styled.span`
  &.not-active {
    font-size: 13px;
    color: #f27762;
  }
  &.is-going {
    font-size: 13px;
    color: #44cb9c;
  }
`;
export const AlertWrap = styled.div`
  width: 580px;
  margin: 0 auto;
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
export const UserItem = styled.div`
  color: #99acb6;
  font-size: 14px;
  padding: 5px 0 5px 20px;
  i.anticon {
    margin-right: 2px;
  }
  .ant-checkbox-group .ant-checkbox-group-item:first-child {
    margin-right: 20px;
  }
  .item-key {
    display: inline-block;
    ${'' /* width: 70px; */} white-space: nowrap;
    margin-right: 10px;
  }
  .item-value {
    color: #2a4452;
    display: inline-block;
    width: 100px;
    white-space: nowrap;
    letter-spacing: 1px;
  }
  .user-name {
    letter-spacing: 2px;
  }
  a {
    color: #5d97b6;
  }
  .switch-btn {
    margin-right: 8px;
  }
  &.flex-between {
    display: flex;
    justify-content: space-between;
  }
  &.flex-end {
    display: flex;
    justify-content: flex-end;
  }
`;
export const LeftItems = styled.div`
  display: flex;
  align-items: center;
  .user-logo {
    border-radius: 80px;
    overflow: hidden;
  }
  img {
    width: 56px;
    height: 56px;
  }
`;
export const RightItems = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const UserConfig = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const UserConfigWrap = styled.div`
  padding: 18px 40px;
  background: #fff;
  border: solid 1px #dfecf3;
  box-shadow: 0 5px 6px 0 rgba(124, 166, 188, 0.17),
    2px 5px 4px 0 rgba(47, 88, 109, 0.06),
    0 13px 20px 0 rgba(108, 162, 191, 0.15);
`;
export const Item = styled.div`
  display: flex;
  margin: 15px 0;
  flex-direction: column;
  .user-alert {
    display: inline-block;
    color: #f27762;
    padding: 20px;
    font-size: 12px;
    width: 450px;
    margin-top: 30px;
    line-height: 16px;
  }
  .copy {
    font-size: 14px;
    color: #5d97b6;
    cursor: pointer;
    margin-left: 15px;
  }
  .inside {
    background-color: rgba(234, 239, 242, 0.48);
    border: solid 1px #eaeff2;
    display: inline-block;
    max-width: 440px;
    word-break: break-all;
    padding: 0 13px;
    color: #2a4452;
    line-height: 40px;
  }
  .section-title {
    display: flex;
    color: #99acb6;
    font-size: 14px;
    line-height: 20px;
    justify-content: space-between;
    width: 440px;
  }
  .userTips {
    color: #f27762;
    font-size: 12px;
  }
`;
