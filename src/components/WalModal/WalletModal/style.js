import styled from 'styled-components';
export const MainWrap = styled.div`
  color: #99acb6;
  .sub-text {
    font-size: 13px;
  }
  .qrcode-wrap {
    color: #000;
    position: relative;
    width: 180px;
    height: 180px;
    margin: 0 auto;
    .overtime-wrap {
      cursor: pointer;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      i {
        font-size: 25px;
        margin: 10px;
      }
    }
  }
`;
export const LogoList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 30px 0;

  > .wallet-logo {
    margin: 0 5px;
    img {
      width: 30px;
      cursor: pointer;
    }
  }
`;
export const ResultWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 300px;
  color: #658697;
  &.confirming {
    i {
      font-size: 50px;
      color: #5d97b6;
      margin-bottom: 40px;
    }
    .ball-clip-rotate {
      width: 50px;
      height: 50px;
      margin: 0;
      margin-bottom: 52px;
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
  &.success {
    i {
      font-size: 50px;
      color: #44cb9c;
      margin-bottom: 40px;
    }
  }
  &.failure {
    i {
      font-size: 50px;
      color: #f27762;
      margin-bottom: 40px;
    }
  }
`;
