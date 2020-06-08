import styled, { injectGlobal } from 'styled-components';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { CardIcon } from 'dyc/styles/card';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  .react-draggable {
    .dy-card-head {
      cursor: move;
    }
  }
  .react-grid-layout {
    .react-grid-item.react-draggable-dragging {
      opacity: 0.7;
    }
    .react-grid-item.react-grid-placeholder {
      background: #FFF;
      border: 2px dashed gray;
    }
  }
  .dy-card-tool-popover {
    .ant-popover-inner-content {
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
      li {
        line-height: 28px;
        > a {
          color: #666;
          &:hover {
            color: #3d77c7;
          }
        }
      }
    }
  }
`;

const headHeight = '36px';

export const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(195, 200, 205, 0.43);
  font-size: 14px;
  position: relative;
  transition: all ease-in-out 0.2s;
  &:hover {
    box-shadow: 0 2px 8px 0 rgba(21, 114, 206, 0.36);
  }

  /* 卡片内的antd message提示 相对卡片定位 */
  .ant-message {
    position: absolute;
  }
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Head = styled.div`
  padding: 0 9px;
  height: ${headHeight};
  line-height: ${headHeight};
  overflow: hidden;
  background: #f4f9ff;
`;

export const HeadTitle = styled.div`
  font-size: 14px;
  font-weight: bold;

  > span:first-child {
    margin-right: 15px;
  }
`;

export const HeadOperations = styled.div`
  float: right;
  text-align: right;
  margin-left: auto;

  .anticon {
    font-size: 18px;
    padding: 0 10px;
    cursor: pointer;
  }
`;

export const Body = styled.div`
  padding: 9px;
  height: ${props =>
    props.hideHeader ? '100%' : `calc(100% - ${headHeight})`};
`;

export const StyledInput = styled(Input)`
  transition: all 0.2s ease;
  position: absolute;
  right: -40px;
  top: -5px;
  opacity: 0;
  pointer-events: none;
  width: 110px;

  &.active {
    right: 0px;
    opacity: 1;
    pointer-events: all;
  }
`;

export const IconWrapper = styled.a`
  font-size: 18px;
  cursor: pointer;
  color: #666;
`;

export const IconWrapperLink = styled(Link)`
  font-size: 18px;
  padding-left: 10px;
  cursor: pointer;
  color: #666;
`;

export const FullScreenIcon = CardIcon.extend`
  background-position: -72px -40px;
  width: 16px;
  height: 16px;
  margin-bottom: 4px;
`;

export const FullScreenExitIcon = CardIcon.extend`
  background-position: -265px -40px;
  width: 16px;
  height: 16px;
  margin-bottom: -2px;
`;

export const StyledEmptyDiv = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  min-height: 200px;

  > div {
    width: 132px;
    height: 126px;
    position: absolute;
    left: calc(50% - 66px);
    top: calc(50% - 64px);
    > img {
      width: 100%;
    }

    > p {
      margin-top: 10px;
      color: #999;
    }
  }
`;
