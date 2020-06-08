import styled from 'styled-components';
export const WalWrap = styled.div`
  width: 780px;
  height: 168px;
  margin: 20px 20px;
  width: 96%;
  box-shadow: 6px 10px 14px 0 rgba(18, 52, 92, 0.1),
    2px 5px 5px 0 rgba(18, 46, 93, 0.04);
  background-color: #ffffff;
  .user-asset-convert {
    font-size: 12px;
    color: #658697;
    padding-left: 10px;
  }
`;
export const BodyHeader = styled.div`
  display: flex;
  padding: 20px 30px 20px 20px;
  justify-content: space-between;
  border: solid 1px #eaeff2;
  div:first-child > span {
    margin-right: 10px;
  }
  div:last-child > span {
    margin-left: 20px;
  }
`;
export const BodyList = styled.div`
  display: flex;
  justify-content: space-between;
  > div {
    position: relative;
    flex: 1;
    i.iconfont {
      cursor: help;
    }
    .title {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 20px;
      align-items: center;
      font-size: 12px;
      > span:first-child {
        color: #99acb6;
        font-size: 12px;
        line-height: 20px;
        margin-top: 5px;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        font-family: 'rRegular';
        i {
          margin-left: 10px;
        }
      }
      .big-number {
        letter-spacing: 1px;
        line-height: 40px;
        font-size: 30px;
        color: #2a4452;
        margin: 8px 0;
      }
      .lineheight {
        line-height: 30px;
      }
    }
  }
  .confirm-btn {
    font-size: 12px;
    width: 160px;
  }
  > div:after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 90px;
    background-color: #eaeff2;
    position: absolute;
    top: 20px;
    right: 0;
  }
  > div:last-child:after {
    display: none;
  }
`;
