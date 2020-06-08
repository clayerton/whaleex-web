import styled from 'styled-components';
import { Carousel, Tabs, Table } from 'antd';
export const StyledCarousel = styled(Carousel)`
  height: 25vw;
  max-height: 100vh;
  overflow: hidden;
  .slick-list {
    .slick-slide {
      height: 25vw;
      max-height: 100vh;
      position: relative;
    }
  }
`;
export const Arrow = styled.div`
  width: 12px;
  line-height: 0px;
  display: inline-block;
  margin-left: 5px;
  margin-top: 4px;
  > i {
    display: inline-block;
    font-size: 12px !important;
    transform: scale(0.7);
    line-height: 6px;
    height: 6px;
    &:first-child {
      color: ${props => (props.sorter === 'ascend' && '#cbdfea') || 'inherit'};
    }
    &:last-child {
      color: ${props => (props.sorter === 'descend' && '#cbdfea') || 'inherit'};
    }
  }
`;
export const StyledTitle = styled.div`
  position: relative;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  span {
    font-size: 14px;
  }
`;
export const WalSlide = styled.div`
  width: 100vw;
  height: 25vw;
  max-height: 100vh;
  overflow: hidden;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  a {
    display: inline-block;
    width: 100%;
  }
  img {
    width: 100%;
    height: 25vw;
  }
`;
export const BannerText = styled.div`
  top: 13vw;
  margin-left: 0;
  width: 100vw;
  text-align: center;
  padding: 0 10vw;
  box-sizing: border-box;
  position: absolute;
  color: #fff;
  .title {
    font-size: 40px;
    &.sub {
      font-size: 20px;
    }
  }
`;
export const Notice = styled.div`
  position: absolute;
  margin-top: -40px;
  left: 0;
  right: 0;
  display: flex;
  background-color: rgba(8, 41, 55, 0.6);
  .alert-line {
    margin: 0 10%;
    width: 100%;
    color: #eaeff2;
    font-size: 12px;
    font-family: 'rRegular';
  }
  .alert-msg {
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
    }
  }
`;
export const BoxWrap = styled.div`
  display: flex;
  margin: 30px 10% 10px 10%;
  flex-direction: column;
  justify-content: center;
  z-index: 9;

  .progress {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
  }
  .data-statistics {
    margin-bottom: 50px;
    .top-row {
      position: relative;
      margin-bottom: 30px;
      font-weight: 500;
      a {
        letter-spacing: 0.7px;
        color: #21a4ea;
        font-size: 12px;
        text-decoration: none;
      }
      .right-style {
        float: right;
      }
    }
    .data-info {
      background-color: #182a3b;
      padding: 30px 0;
      display: flex;
      justify-content: center;
      .data-frame {
        width: 100%;
        text-align: left;
        flex-direction: column;
        font-family: 'rRegular';
        padding-left: 40px;
        display: flex;
        justify-content: center;
        align-items: left;
        .data-content {
          margin-bottom: 5px;
          p {
            letter-spacing: 1.2px;
            color: #7ea3b7;
            font-size: 12px;
            margin-bottom: 10px;
            i {
              margin-left: 5px;
              font-size: 12px;
              color: #7ea3b7;
              cursor: pointer;
            }
          }
          a {
            color: #4eb5ed;
            cursor: default;
            font-size: 30px;
            font-family: 'dNumber','rRegular';
            span{
              font-size: 20px;
            }
          }
        }
        .data-content-little {
          p {
            i {
              margin-left: 5px;
              font-size: 12px;
              color: #7ea3b7;
              cursor: pointer;
            }
            span{
              color: #7ea3b7;
              font-size: 12px;
              margin-bottom: 0;
            }
            a {
              color: #5d97b6;
              cursor: default;
              font-size: 16px;
              letter-spacing: 1.7px;
              font-family: 'dNumber','rRegular';
              span{
                font-size: 16px;
              }
            }
          }
        }
        .data-three {
          padding-top: 38px;
          p {
            color: #4eb5ed;
            font-size: 22px
            display: inline-flex;
            font-family: 'dNumber','rRegular';
            span {
              letter-spacing: 1.2px;
              color: #7ea3b7;
              font-size: 12px;
            }
            i {
              margin-left: 5px;
              font-size: 12px;
              color: #7ea3b7;
              cursor: pointer;
            }
          }

        }
      }
    }
  }
  .flex-div {
    display: flex;
    justify-content: center;
    padding: 56px 30px 46px 30px;
    background-color: #182a3b;
    position: relative;
    .left-style {
      img{
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
      position: absolute;
      font-size: 14px;
      top: 14px;
      left: 30px;
      letter-spacing: 1.3px;
      color: #7ea3b7;
      display: flex;
    }
    .right-style {
      position: absolute;
      font-size: 14px;
      top: 14px;
      right: 30px;
      letter-spacing: 1px;
      color: #21a4ea;
      cursor: pointer;
    }
  }
`;

export const Box = styled.div`
  width: 100%;
  margin: 0 30px;
  text-align: center;
  height: 93px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'rRegular';
  img {
    width: 80px;
  }
  p {
    color: #7ea3b7;
    font-size: 12px;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }
  .number {
    font-size: 26px;
    color: #4eb5ed;
    font-family: 'dNumber', 'rRegular';
  }
  .unit {
    font-size: 16px;
    color: #4eb5ed;
    letter-spacing: 1.6px;
    margin-left: 4px;
  }
  .data-content-little {
    p {
      i {
        margin-left: 5px;
        font-size: 12px;
        color: #7ea3b7;
        cursor: pointer;
      }
      span {
        color: #7ea3b7;
        font-size: 12px;
        margin-bottom: 0;
      }
      a {
        color: #5d97b6;
        cursor: default;
        font-size: 16px;
        letter-spacing: 1.7px;
        font-family: 'dNumber', 'rRegular';
        span {
          font-size: 16px;
        }
      }
    }
  }
  .button {
    cursor: pointer;
    background-color: #4eb5ed;
    color: #0f2f41;
    font-size: 14px;
    display: inline-block;
    width: 80px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    margin: 8px auto 0 auto;
    cursor: pointer;
    &:hover {
      background-color: #2499d8;
    }
  }
`;

export const MiddleLine = styled.div`
  border-right: 1px solid #2a4452 !important;
`;

export const QusLine = styled.div`
  display: inline-block;
  margin: 0 10px;
  color: #5d97b6;
  i {
    font-size: 12px;
    margin: 0 5px;
  }
`;

export const TabsWrap = styled.div`
  padding-bottom: 60px;
  padding-top: 50px;
  margin: 0 10%;
  h2 {
    color: #fff;
    text-align: center;
    > span {
      display: inline-block;
      width: 80px;
      font-size: 16px;
      border-bottom: 4px solid #2a4452;
      padding: 10px;
    }
  }
`;
export const StyledTabs = styled(Tabs)`
  .ant-input-search.ant-input-search-enter-button > .ant-input {
    background-color: #263741;
    font-size: 12px;
    color: #99acb6;
  }
  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    background-color: #263741;
    color: #ffffff;
    opacity: 0.5;
  }
  .ant-table-placeholder {
    background-color: transparent;
    border-bottom: none;
    color: #ffffff;
    opacity: 0.5;
  }
  .ant-pagination-item {
    background-color: #263741;
    a {
      color: rgba(255, 255, 255, 0.65);
    }
  }
  .ant-input-affix-wrapper .ant-input {
    border: none;
  }
  .ant-input-search > .ant-input-suffix > .ant-input-search-button {
    border: none;
    background-color: #082637;
    color: #658697;
  }
  .ant-tabs-bar {
    border-bottom: 1px solid #294352;
  }
  .cUmwSh .ant-table-row,
  .cUmwSh .ant-table-row:nth-child(odd) {
    opacity: 0.7;
  }

  .ant-btn-clicked {
    border: none;
  }
  &.ant-tabs-top {
    .ant-tabs-ink-bar {
      background-color: #4eb5ed;
    }
  }
  .ant-tabs-nav-wrap {
    .ant-tabs-nav {
      .ant-tabs-tab {
        font-size: 16px;
        color: #658697;
        &.ant-tabs-tab-active {
          color: #4eb5ed;
          background-color: inherit;
        }
        &:hover {
          color: #4eb5ed;
        }
      }
    }
  }
`;
export const StyledTable = styled(Table)`
  th.column-right,
  td.column-right {
    text-align: right !important;
    padding-right: 4px !important;
  }
  .ant-table-thead > tr > th .ant-table-column-sorter-up {
    &.on {
      color: rgba(255, 255, 255, 0.8);
    }
    &.off {
      color: #658697;
    }
  }
  .ant-table-thead > tr > th .ant-table-column-sorter-down {
    &.on {
      color: rgba(255, 255, 255, 0.8);
    }
    &.off {
      color: #658697;
    }
  }
  .ant-table-thead > tr > th.ant-table-column-has-actions:hover {
    background-color: transparent;
  }
  .ant-table-thead {
    .ant-table-expand-icon-th {
      padding-left: 12px !important;
      min-width: 0 !important;
      width: 1px !important;
      overflow: hidden;
    }
  }
  .ant-table-tbody {
    font-size: 16px;
    .ant-table-row-expand-icon-cell {
      min-width: 0 !important;
      width: 1px !important;
      overflow: hidden;
      padding-left: 12px !important;
      margin: 0;
      > * {
        display: none;
      }
    }
  }
  .ant-table-thead > tr.ant-table-row-hover > td,
  .ant-table-tbody > tr.ant-table-row-hover > td,
  .ant-table-thead > tr:hover > td,
  .ant-table-tbody > tr:hover > td {
    background: rgba(255, 255, 255, 0.1);
  }
  .ant-table-tbody {
    tr.ant-table-expanded-row,
    tr.ant-table-expanded-row:hover,
    tr.ant-table-expanded-row:hover > td {
      background-color: #0f2131;
    }
  }
  &.ant-table-wrapper .ant-table-thead > tr > th:last-child,
  &.ant-table-wrapper .ant-table-tbody > tr > td:last-child {
    padding-right: 20px;
  }
  .ant-table-thead > tr {
    background-color: transparent;
    > th {
      background-color: transparent;
      color: #658697;
    }
  }
  .ant-table-body {
    .ant-table-tbody {
      tr {
        td {
          height: 60px !important;
          color: #cbdfea;
          border-bottom: 1px solid #2a4352;
          a {
            display: block;
            &.no-block {
              display: inline-block;
            }
          }
        }
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
      tr.ant-table-row {
        background: transparent;
      }
    }
  }
`;
export const AlertMsg = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  .alert-msg {
    color: #a6c7d9;
    width: 30%;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
  }
`;
