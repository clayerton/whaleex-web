import { Layout, Menu, Icon } from 'antd';
const { Content, Sider } = Layout;
import styled from 'styled-components';
export const StyledWrap = styled.div`
  min-width: 960px;
  max-width: 1150px;
  margin: 0 auto;
`;
export const StyledLayout = styled(Layout)`
  &.ant-layout {
    color: #4e6a79;
    padding: 24px 0;
    background: #f9fdff;
    padding-top: 30px;
  }
`;
export const StyledSider = styled(Sider)`
  &.ant-layout-sider {
    color: #4e6a79;
    background: #fff;
    border: solid 1px #dfecf3;
    box-shadow: 0 5px 6px 0 rgba(124, 166, 188, 0.17),
      2px 5px 4px 0 rgba(47, 88, 109, 0.06),
      0 13px 20px 0 rgba(108, 162, 191, 0.15);
    .ant-menu {
      .iconfont {
        font-size: 15px;
        color: #99acb6;
      }

      .extra-tip {
        background-color: #f27762;
        margin-left: 15px;
        font-size: 10px;
        width: 38px;
        height: 15px;
        color: #ffffff;
        font-weight: 150;
        padding: 2px;
        border-radius: 2px;
        > span {
          display: inline-block;
          transform: scale(0.8);
        }
      }
      .ant-menu-inline .ant-menu-item {
        overflow: auto;
        text-overflow: inherit;
      }
      .ant-menu-item .ant-menu-item-selected {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ant-menu-item {
        text-overflow: initial;
        color: #658697;
        padding-left: 10px;
        margin: 0;
        height: 65px;
        line-height: 65px;
        font-size: 15px;
        font-weight: lighter;
        border-bottom: 1px solid rgba(223, 236, 243, 0.5);
        > i {
          margin: 0 20px 0 8px;
        }
      }
      .ant-menu-item-selected {
        color: #ffffff;
        background: #5d97b6;
        font-weight: bold;
        width: 100%;
        &:after {
          display: none;
        }
      }
    }
    .ant-menu-item-selected {
      color: #ffffff;
      .iconfont {
        color: #ffffff;
      }
    }
  }
`;
export const StyledContent = styled(Content)`
  min-height: 520px;
  color: #4e6a79;
  margin: 0 24px;
`;
