import styled from 'styled-components';
export const Step = styled.div`
  .content {
    padding: 30px 50px;
    text-align: center;
    > h1 {
      color: #4e6a79;
      font-weight: normal;
      text-align: center;
      font-size: 21px;
      margin: 20px;
    }
    > h2 {
      color: #4e6a79;
      font-size: 16px;
    }
    > p {
      color: #2a4452;
      text-align: left;
      line-height: 2;
    }
    p.user-alert {
      font-size: 12px;
      color: #f27762;
    }
    .btn-wrap {
      margin: 40px 0 40px 0;
    }
    .copy {
      font-size: 14px;
      color: #5d97b6;
      text-decoration: underline;
      cursor: pointer;
      margin-left: 15px;
    }
    .inside {
      background-color: rgba(234, 239, 242, 0.48);
      border: solid 1px #eaeff2;
      display: inline-block;
      word-break: break-all;
      padding: 15px;
      color: #2a4452;
    }
    .bottom-guide {
      font-size: 12px;
      color: #99acb6;
      text-align: left;
    }
    .qrcode-img {
      img {
        box-shadow: 0 11px 11px 0 rgba(207, 217, 223, 0.63),
          0 2px 3px 0 rgba(183, 199, 208, 0.59);
        background-color: #ffffff;
        border: solid 1px #eaeff2;
      }
    }
  }
`;
