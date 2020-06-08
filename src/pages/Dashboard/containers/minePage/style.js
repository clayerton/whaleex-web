import styled from 'styled-components';
export const HomeWrap = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: #0b304a;
  padding-top: 58px;
  position: relative;
  .banner {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    img {
      width: 100%;
      position: relative;
      top: -6vw;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    z-index: 1;
    width: 100%;
    img {
      width: 100%;
    }
  }
`;
export const CarouselSlide = styled.div`
  position: relative;
  height: auto;
  min-height: 30vw;
  display: flex;
  flex-direction: column;
  z-index: 2;
  margin-top: 20%;
  padding-bottom: 17%;
`;
// export const Footer = styled.div`
//   margin: 0 10%;
//   color: #658697;
//   padding-bottom: 50px;
//   font-size: 12px;
//   i {
//     margin-left: 5px;
//   }
//   a {
//     color: #21a4ea;
//     &:hover {
//       color: #21a4ea;
//     }
//   }
// `;
// export const Title = styled.div`
//   font-size: 14px;
//   margin-bottom: 20px;
// `;
