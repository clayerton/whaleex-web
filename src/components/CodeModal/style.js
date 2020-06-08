import styled from 'styled-components';
export const CodeModalWrap = styled.div`
  .close-btn {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    margin: 5px;
    font-size: 22px;
    color: #97a3b4;
  }
`;
export const StyledTitle = styled.div`
  font-size: 17px;
  color: #4e6a79;
  border-bottom: 1px solid #eaeff2;
  height: 70px;
  line-height: 70px;
  padding: 5px 25px;
  width: 406px;
`;
export const StyledMsgLine = styled.div`
  font-size: 10px;
  color: #99acb6;
  margin: 20px auto 10px;
  width: 392px;
  > span:last-child {
    float: right;
  }
  .error {
    color: #f27762;
  }
`;
export const StyledSpan = styled.span`
  display: block;
  text-align: right;
  color: #5d97b6;
  font-size: 12px;
  text-decoration: underline;
  width: 392px;
  padding: 0 5px;
  margin: 0 auto;
  position: relative;
  top: -30px;
  > span {
    cursor: pointer;
    user-select: none;
  }
`;
export const StyledInputWrap = styled.div`
  margin: 5px auto;
  width: 406px;
  margin-bottom: 40px;
  line-height: 40px;
  height: 55px;
  > input {
    width: 40px;
    background-color: rgba(234, 239, 242, 0.48);
    border: solid 1px #eaeff2;
    height: 40px;
    margin: 5px;
    line-height: 40px;
    text-align: center;
    color: #2a4452;
    font-size: 18px;
  }
  .send-count-down {
    color: #fff;
    text-align: center;
    margin: 5px;
  }
`;
