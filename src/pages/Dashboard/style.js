import styled from 'styled-components';
import { Layout, Header, Button } from 'antd';
const { Content } = Layout;

export const StyledLayout = styled(Layout)`
  &.ant-layout {
    background: #fff;
  }
`;
export const StyledHeader = styled(Layout)`
  &.ant-layout {
    position: fixed;
    z-index: 10;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
    height: 58px;
    background-color: ${props => {
      return (
        ((props.color === 'transparent' ||
          props.color === 'dark-transparent') &&
          'transparent') ||
        '#fff'
      );
    }};
    color: ${props => {
      return (
        ((props.color === 'dark-transparent' ||
          props.color === 'transparent') &&
          `#fff`) ||
        '#2a4452'
      );
    }};
    box-shadow: ${props => {
      return (
        ((props.color === 'dark-transparent' ||
          props.color === 'transparent') &&
          `none`) ||
        '2px 5px 5px 0 rgba(18, 46, 93, 0.04)'
      );
    }};
  }
  .logo {
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: -2px;
    cursor: pointer;
    img {
      width: 115px;
    }
  }
  span:hover {
    color: ${props => {
      return (
        ((props.color === 'dark-transparent' ||
          props.color === 'transparent') &&
          `#66b5e3`) ||
        '#5D97B6'
      );
    }};
  }
  .menu-wrap {
    display: flex;
    width: calc(100% - 200px);
  }
  .info-wrap {
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
    font-family: 'rRegular';
    font-size: 14px;
    top: 3px;
    > div {
      padding: 0 10px;
      display: inline-block;
    }
    .menu-item {
      cursor: pointer;
      img.small-logo {
        height: 19px;
        position: relative;
        top: -2px;
        left: 2px;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }
  .header-right-action {
    display: flex;
    align-items: center;
    position: relative;
    top: 3px;
    > div {
      margin-right: 15px;
      ${'' /* width: 90px; */} text-align: right;
    }
    > .language-action {
      text-align: center;
      width: 80px;
    }
  }
`;

export const StyledContent = styled(Content)`
  margin-top: 58px;
  height: calc(100% - 64px);
  .trade-wrap {
    height: ${props => (props.data && 'calc(100% - 130px)') || ''};
    overflow: ${props => (props.data && 'auto') || ''};
  }
`;
export const StyledContentFlow = styled(Content)`
  padding: 0 0;
  margin-top: 58px;
  background: #f9fdff;
  overflow: auto;
`;
export const StyledContentStatic = styled(Content)`
  background: #f9fdff;
  overflow: auto;
`;
export const ResearchTopBar = styled.div``;

export const Operations = styled.div``;

export const ContentWrapper = styled.div``;

export const StyledEmptyDiv = styled.div``;
export const DashOperations = styled.div``;
export const StyledButton = styled(Button)`
  &.ant-btn {
    a {
      text-decoration: none;
    }
    border-radius: 0;
    padding: 0 23px;
    background-color: ${props => {
      return (
        (props.type === 'primary' && props.theme['@wal-primaryBtn_bg']) ||
        props.theme['@wal-defaultBtn_bg']
      );
    }};
    border-color: ${props =>
      (props.type === 'primary' && props.theme['@wal-primaryBtn_bg']) ||
      props.theme['@wal-defaultBtn_border']};
    color: ${props =>
      (props.type === 'primary' && props.theme['@wal-primaryBtn_color']) ||
      props.theme['@wal-defaultBtn_color']};
    &:hover,
    &:focus {
      background-color: ${props => {
        return (
          (props.type === 'primary' && props.theme['@wal-primaryBtn_f_bg']) ||
          props.theme['@wal-defaultBtn_f_bg']
        );
      }};
      border-color: ${props =>
        (props.type === 'primary' && props.theme['@wal-primaryBtn_f_border']) ||
        props.theme['@wal-defaultBtn_f_border']};
      color: ${props =>
        (props.type === 'primary' && props.theme['@wal-primaryBtn_f_color']) ||
        props.theme['@wal-defaultBtn_f_color']};
    }
  }
`;
