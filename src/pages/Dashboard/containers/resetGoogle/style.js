import styled from 'styled-components';

export const LayoutItem = styled.div`
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & > span:first-child {
      flex-basis: 26px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    & > span:last-child {
      color: #2a4452;
      font-size: 15px;
      line-height: 20px;
    }
  }
  .guide {
    margin-left: 26px;
    margin-top: 15px;
    p {
      font-size: 10px;
      color: #99acb6;
      & > .alert {
        color: #f27762;
      }
    }
  }
  .guide-pic {
    margin-left: 26px;
    margin-top: 25px;
    margin-bottom: 100px;
    display: flex;
    align-items: flex-end;
  }
`;
export const SecretKey = styled.span`
  color: #2a4452;
  font-size: 16px;
  &.inside {
    display: inline-block;
    background-color: rgba(234, 239, 242, 0.48);
    border: solid 1px #eaeff2;
    line-height: 40px;
    padding: 0 10px;
  }
  &.outside {
    display: inline-block;
    box-shadow: 0 11px 11px 0 rgba(207, 217, 223, 0.63),
      0 2px 3px 0 rgba(183, 199, 208, 0.59);
    background-color: #ffffff;
    border: solid 1px #eaeff2;
    line-height: 40px;
    padding: 5px 20px;
    user-select: none;
  }
  & + .copy {
    font-size: 14px;
    color: #5d97b6;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 15px;
  }
`;
export const Index = styled.span`
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 20px;
  background-color: #abbdc6;
  text-align: center;
  line-height: 15px;
  color: #fff;
  vertical-align: middle;
  font-size: 10px;
`;
export const Download = styled.div`
  &.download-1 {
    margin-bottom: 0;
  }
  background-color: #5d97b6;
  box-shadow: 0 11px 11px 0 rgba(207, 217, 223, 0.63),
    0 2px 3px 0 rgba(183, 199, 208, 0.59);
  display: flex;
  color: #fff;
  background-color: #5d97b6;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  padding: 5px 15px;
  margin: 15px 0 25px 15px;
  > div:last-child {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    margin: 0 13px;
    > span:first-child {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  > div:first-child {
    font-size: 25px;
  }
`;
export const CopySuccess = styled.div`
  height: 14px;
  font-size: 14px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.8);
  i {
    color: #52c41a;
    margin-right: 5px;
  }
`;
