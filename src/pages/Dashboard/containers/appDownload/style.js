import Styled from 'styled-components';
let img1 = _config.cdn_url + '/web-static/imgs/appDownload/Desktop-bg.png';
let img2 = _config.cdn_url + '/web-static/imgs/appDownload/web-erweima.png';
export const BkCover = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #88b3ca;
  width: 100vw;
  height: 100vh;
  z-index: 999;
`;
// background-image:url(${bgImg});
export const StyledWrap = Styled.div`
  background-image:url(${img1});
  background-position: center;
  background-size: cover;
  width: 100vw;
  min-height: calc(100vh - 58px);
  display:flex;
  justify-content:center;
  flex-wrap: wrap;
  padding: 0 50px;
`;
export const Box = Styled.div`
  min-width: 500px;
  max-width: 700px;
  min-height: 500px;
  box-sizing: border-box;
  color:#fff;
  &.left{
    display: flex;
    justify-content: center;
    align-items: center;
    flex:2;
  }
  &.right{
    display: flex;
    align-items: center;
    justify-content: center;
    flex:1;
  }
`;
export const Item = Styled.div`
  text-align: center;
  margin: 20px 15px;
  flex: 1;
  img{
    height: 130px;
    margin-bottom: 30px;
  }
  p{
    margin: 0;
    line-height: 1.5;
    &:last-child{
      color:rgba(255, 255, 255, 0.6);
    }
  }
`;
export const LeftBox = Styled.div`
  position: relative;
  .content{
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
  }
  .download{
    display: flex;
    align-items: center;
    justify-content: space-around;
    .download-qrcode{
      img{
        width: 120px;
      }
    }
    .download-btns{
      a{
        display: block;
        background-color: #fff;
        color: rgba(93, 151, 182, 1);
        height: 40px;
        width: 250px;
        line-height: 40px;
        text-align: center;
        border-radius: 2px;
        margin: 20px;
        cursor: pointer;
        text-decoration: none;
        &:hover{
          opacity: 0.9;
        }
      }
    }
  }
`;
export const RightBox = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
export const QrcodeBox = Styled.div`
  background-image: url(${img2});
  width: 200px;
  height: 200px;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #5d97b6;
  line-height: 2;
  position: relative;
  left: 20px;
  flex-direction: column;
  img{
    width: 100px;
  }
`;
