import styled from 'styled-components';
export const HomeWrap = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: #082637;
`;
export const CarouselSlide = styled.div`
  height: auto;
  min-height: 30vw;
  background-color: #082637;
  display: flex;
  flex-direction: column;
`;
let img1 = _config.cdn_url + '/web-static/imgs/extend/long-page.jpg';
export const LongPage = styled.div`
  padding: 0 0 100px 0;
  background-color: #0f2d3e;
  color: #fff;
  background-size: cover;
  background-repeat: no-repeat;
  background-repeat-y: repeat;
  background-image: url(${img1});
  .title {
    text-align: center;
    padding: 60px 0 100px 30px;
    font-size: 30px;
    letter-spacing: 5px;
    ${'' /* &:after {
      content: '';
      display: block;
      width: ${props => (props.lineWidth && props.lineWidth) || '40px'};
      height: 4px;
      background-color: ${props =>
        (props.lineColor && props.lineColor) || '#fff'};
      margin: 0 auto;
    } */};
  }

  .fix-box {
    display: flex;
    width: 70vw;
    margin: 0 auto;
    padding-bottom: 50px;
  }

  .word {
    width: 55%;
  }

  .pic {
    width: 45%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
let img2 = _config.cdn_url + '/web-static/imgs/extend/2.png';
let img3 = _config.cdn_url + '/web-static/imgs/extend/3.png';
let img4 = _config.cdn_url + '/web-static/imgs/extend/4.png';
let img5 = _config.cdn_url + '/web-static/imgs/extend/5.png';
let img6 = _config.cdn_url + '/web-static/imgs/extend/6.png';
let img7 = _config.cdn_url + '/web-static/imgs/extend/7top.png';
let img8 = _config.cdn_url + '/web-static/imgs/extend/8.png';
let img10 = _config.cdn_url + '/web-static/imgs/extend/10.png';
// export const Title
export const Page = styled.div`
  padding: 50px 0;
  min-height: 45vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  background: rgb(19, 19, 19);
  color: #fff;
  background-position-y: 0%;
  background-position-x: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${img2});
  &.bg-2 {
    background-image: url(${img3});
  }

  &.bg-3 {
    background-image: url(${img4});
  }

  &.bg-4 {
    background-image: url(${img5});
  }

  &.bg-5 {
    background-image: url(${img6});
  }

  &.bg-6 {
    background-image: url(${img7});
  }

  &.bg-7 {
    background-image: url(${img8});
  }

  &.bg-7 img {
    width: 70vw;
    padding: 10px 0;
    margin-top: 50px;
  }
  &.bg-8 {
    background-image: url(${img10});
  }
  &.bg-8 img {
    width: 68vw;
    padding: 10px 0;
  }
  .title {
    font-size: 30px;
    letter-spacing: 5px;
    padding-bottom: 30px;
    max-width: 59vw;
    margin: 0 auto;
    ${'' /* &:after {
      content: '';
      display: block;
      width: ${props => (props.lineWidth && props.lineWidth) || '40px'};
      height: 4px;
      background-color: ${props =>
        (props.lineColor && props.lineColor) || '#fff'};
      margin: 0 auto;
    } */};
  }

  .sub-title {
    font-size: 12px;
    letter-spacing: 4px;
    text-align: justify;
    color: #2a4452b5;
    width: 300px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.5);
    height: 20px;
    margin-bottom: 50px;
    border-radius: 3px;
    text-align: center;
  }

  .sub-p {
    text-align: justify;
    max-width: 59vw;
    line-height: 25px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 auto;
    text-align-last: center;
    max-height: 100%;
    text-align: center;
  }
`;
