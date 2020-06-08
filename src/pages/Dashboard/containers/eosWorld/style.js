import Styled from 'styled-components';
let eosWold = _config.cdn_url + '/web-static/imgs/eosWorld/banner.png';
// background-image:url(${bgImg});
export const StyledWrap = Styled.div`
  width: 100vw;
  min-height: calc(100vh - 58px);
`;
export const Banner = Styled.div`
height: 410px;
background-image: url(${eosWold});
background-position: center;
background-size: cover;
display: flex;
justify-content: center;
align-items: center;
text-align: center;
color: #fff;
position: relative;
background-color: #0d1f2a;
`;
