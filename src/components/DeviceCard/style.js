import styled from 'styled-components';
const BgImg = _config.cdn_url+'/web-static/imgs/logo/bg.png';
export const Card = styled.div`
  background-image: url(${BgImg});
  background-repeat: no-repeat;
  background-position: 125% 0;
  position: relative;
  background-color: #ffffff;
  width: 440px;
  height: 82px;
  margin: 15px 0;
  box-shadow: 6px 10px 14px 0 rgba(18, 52, 92, 0.1),
    2px 5px 5px 0 rgba(18, 46, 93, 0.04);
  outline: solid 1px #eaeff2;
  padding: 10px 20px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &.border-left {
    border-left: 6px solid #5d97b6;
  }
  &.arrow-left {
    padding-left: 25px;
    .tag {
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 12px;
      color: #fff;
      z-index: 2;
      > span {
        transform: scale(0.6);
        display: inline-block;
        position: relative;
        white-space: nowrap;
        left: -5px;
        top: -2px;
        text-align: center;
        width: 33px;
      }
      &:after {
        content: '';
        display: inline-block;
        border: ${props => `17px solid ${props.arrowColor || '#5d97b6'}`};
        border-bottom-color: transparent;
        border-right-color: transparent;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    color: #2a4452;
    font-size: 15px;
    .btn {
      font-size: 12px;
      color: #5d97b6;
      border: 1px solid #5d97b6;
      border-radius: 4px;
      padding: 2px 6px;
      cursor: pointer;
      &.primary-btn {
        color: #fff;
        border: 1px solid #5d97b6;
        background-color: #5d97b6;
      }
      &:hover {
        opacity: 0.6;
      }
    }
  }
  .body {
    font-size: 12px;
    color: #99acb6;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .info {
    font-size: 12px;
    color: #99acb6;
  }
  div p.inside {
    max-width: 100%;
    width: 100%;
    margin: 10px 0;
  }
`;
