import styled from 'styled-components';
export const Page = styled.div`
  .mask {
    position: fixed;
    width: 100vw;
    height: 100%;
    opacity: 0.2;
    background-color: #08101b;
    z-index: 100;
  }
`;
export const PosterModal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 411px;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -300px;
  background-color: #18546c;
  z-index: 101;
  border-radius: 2px;
  .poster-close {
    position: absolute;
    top: 15px;
    right: 10px;
    cursor: pointer;
  }
  .poster {
    img {
      width: 100%;
    }
  }
  > .button {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    > button {
      height: 50px;
      width: 280px;
      border: none;
      border-radius: 2px;
    }
  }
`;
export const InvitePage = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .invite-all {
    padding: 0 30px;
    font-size: 10px;
    color: #658697;
    letter-spacing: 0.6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 47px;
    border-bottom: 1px solid #eaeff2;
  }
  .ant-select .ant-select-selection {
    border: none;
  }

  .ant-table-tbody > tr > td,
  .ant-table-thead > tr > th {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  .ant-table-thead > tr > th:first-child {
    padding-left: 45px !important;
  }
  .ant-table-tbody > tr > td:last-child,
  .ant-table-thead > tr > th:last-child {
    text-align: right;
  }
  .ant-table-thead > tr > th > span {
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.7);
    font-weight: 300;
  }
  .ant-table-tbody > tr.ant-table-row {
    background-color: #f7f9fa;
    &.level-1 {
      background-color: #fff;
    }
    &.level-2 {
      background-color: #fff;
    }
  }
  .table {
    min-height: 250px;
    overflow-y: scroll;
    padding-bottom: 50px;
    .flex {
      display: flex;
      line-height: 10px;
      align-items: center;
      label {
        flex-basis: 23px;
      }
    }
  }
`;
export const InviteHeader = styled.div`
  background-image: url(${props => {
    return props.backImg;
  }});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 260px;
  width: 100%;
  color: #fff;
  position: relative;
  .acty {
    font-size: 14px;
    letter-spacing: 1.4px;
    color: #ffffff;
    cursor: pointer;
    text-align: center;
    margin-top: 200px;
  }
`;
export const InviteType = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 30px;
  height: 128px;
  label:first-child {
    font-size: 10px;
  }
  .invite-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 3;
    button {
      width: 25%;
    }
  }
  label {
    color: #658697;
    flex: 2.5;
  }
  .outInvite {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 3;
  }
  .outInvite > i:first-child {
    margin-right: 10px;
  }
  .tooltip-box {
    display: block;
    height: 153px;
    width: 130px;
  }
  .ewm-box {
    width: 100px;
    height: 100px;
    background-color: #ffffff;
    text-align: center;
    line-height: 100px;
  }
  .tooltip-tips {
  }
  .flex-div {
    position: relative;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .copy {
    font-size: 10px;
  }
  .box1 {
    width: 24%;
    height: 36px;
    background-color: rgba(234, 239, 242, 0.48);
    border: solid 1px #eaeff2;
  }
  .box2 {
    width: 73%;
    height: 36px;
    background-color: rgba(234, 239, 242, 0.48);
    font-size: 10px;
    color: #2a4452;
  }
  .box3 {
    font-size: 12px;
    font-family: 'rRegular';
    width: 25%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  a {
    font-size: 12px;
    color: #5d97b6;
  }
  .icon-pengyouquan,
  .icon-weixin {
    font-size: 24px;
    color: #00b200;
  }
`;
export const InviteContent = styled.div`
  width: 100%;
  height: 107px;
  .invite-account {
    display: flex;
    height: 100%;
    > div:first-child {
      flex: 2;
      margin: 0 5px 5px 30px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    > div:nth-child(2) {
      flex: 1;
      margin: 0 30px 5px 5px;
    }
  }
  .num {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .num > span {
    font-size: 30px;
    color: #2a4452;
  }
  .num > span:first-child {
    font-size: 10px;
    letter-spacing: 0.6px;
    color: #658697;
  }
`;
export const CopySuccess = styled.div`
  position: absolute;
  bottom: -65%;
  left: 0;
  height: 14px;
  font-size: 14px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.8);
  i {
    color: #52c41a;
    margin-right: 5px;
  }
`;
export const CopySuccess1 = styled.div`
  position: absolute;
  bottom: -70%;
  left: -2%;
  height: 14px;
  font-size: 14px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.8);
  i {
    color: #52c41a;
    margin-right: 5px;
  }
`;
export const ActiveRuleWrap = styled.div`
  .back {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 15px 20px;
  }
  .backTitle {
    color: #658697;
  }
  .content-rule {
    width: 100%;
    height: 100%;
    text-align: center;
  }
`;
