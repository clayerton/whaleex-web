import styled from 'styled-components';
export const Wrap = styled.div`
  padding: 20px;
  min-height: 400px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  > div {
    width: 100%;
    .font1 {
      font-size: 12px
      letter-spacing: 0.8px;
      color: #4e6a79;
    }
    .font2 {
      font-size: 12px
      letter-spacing: 0.8px;
      color: #2a4452;
    }
    .font3 {
      font-size: 12px
      letter-spacing: 0.8px;
      color: #44cb9c;
    }
  }
`;

export const Content = styled.div`
  padding: 20px 0;
  font-size: 13px;
  border-bottom: 1px solid #eaeff2;
  .history {
    margin-left: 30px;
    margin-top: 30px;
    color: #658697;
  }
  .info {
    display: flex;
    border-bottom: 1px solid #eaeff2;
    margin-bottom: 10px;
    justify-content: center;
    text-align: left;
    padding: 10px 20px;
    div {
      width: 100%;
    }
    .tips {
      line-height: 16px;
      letter-spacing: 1px;
      color: #658697;
      font-size: 10px;
      margin-bottom: 30px;
      text-align: left;
      p {
        margin: 0 0 0 10px;
      }
    }
    .title {
      font-size: 10px;
      letter-spacing: 0.6px;
      color: #658697;
      margin-bottom: 6px;
    }
    .value {
      font-size: 30px;
      letter-spacing: 1px;
      color: #2a4452;
      margin-bottom: 10px;
      margin-left: 20px;
      span {
        font-size: 18px;
        letter-spacing: 0.6px;
        margin-left: 10px;
      }
    }
  }
`;
