import styled from 'styled-components';
export const AssetContainer = styled.div`
  margin-top: 20px;
  background: #fff;
  border: solid 1px #dfecf3;
  box-shadow: 0 5px 6px 0 rgba(124, 166, 188, 0.17),
    2px 5px 4px 0 rgba(47, 88, 109, 0.06),
    0 13px 20px 0 rgba(108, 162, 191, 0.15);
`;
export const AssetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 70px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(223, 236, 243, 0.5);
  .switch {
    align-items: center;
    width: 100%;
    > i {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 10px;
      color: #d4d4d4;
      margin: 0 20px 0 5px;
      cursor: help;
    }
    input {
      font-size: 12px;
    }
    .switch-right {
      display: inline-flex;
      float: right;
      .switch-margin {
        margin-right: 10px;
      }
      > i {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #99acb6;
        margin: 0 20px 0 5px;
        cursor: help;
      }
    }
  }
`;
export const AssetSearch = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  padding: 0 20px 14px;
  border-bottom: 1px solid rgba(223, 236, 243, 0.5);
  .switch {
    align-items: center;
    width: 100%;
    > i {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 10px;
      color: #d4d4d4;
      margin: 0 20px 0 5px;
      cursor: help;
    }
    input {
      font-size: 12px;
    }
    .switch-right {
      display: inline-flex;
      float: right;
      .switch-margin {
        margin-right: 10px;
      }
      > i {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #99acb6;
        margin: 0 20px 0 5px;
        cursor: help;
      }
    }
  }
`;
export const AssetTotal = styled.div`
  font-size: 18px;
  white-space: nowrap;
  font-family: 'rRegular';
  .user-asset {
    color: #2a4452;
    letter-spacing: 1px;
    > span:last-child {
    }
  }
  .user-asset-convert {
    font-size: 12px;
    color: #658697;
    padding-left: 10px;
  }
`;
export const AssetTable = styled.div`
  padding: 0 20px 20px 20px;
  i {
    margin-left: 5px;
    vertical-align: middle;
    .iconfont {
      cursor: help;
    }
  }
`;
export const WalWrap = styled.div`
  margin: 20px;
  margin-bottom: 30px;
  border: solid 1px #dfecf3;
  box-shadow: 0 2px 6px 0 rgba(124, 166, 188, 0.17),
    0px 2px 4px 0 rgba(47, 88, 109, 0.06),
    0px 6px 20px 0 rgba(108, 162, 191, 0.15);
`;
