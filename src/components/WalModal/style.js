import styled from 'styled-components';
export const Wrap = styled.div`
  &.UserProtocolModal {
    text-align: center;
    .close-btn {
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 15px;
      margin: 5px;
      font-size: 22px;
      color: #97a3b4;
    }
    .content {
      h1 {
        font-size: 20px;
        color: #4086a2;
        border-bottom: 1px solid #eaeff2;
        padding: 20px 25px;
        text-align: left;
      }
      p {
        color: #99acb6;
        font-size: 12px;
        padding: 18px;
      }
      .check-box {
        font-size: 12px;
        margin-bottom: 20px;
      }
    }
  }
  &.ActiveRuleModal,
  &.TradeRuleModal,
  &.LockRuleModal {
    text-align: center;
    .close-btn {
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 15px;
      margin: 5px;
      font-size: 22px;
      color: #97a3b4;
    }
    .content {
      h1 {
        font-size: 18px;
        color: #4e6a79;
        padding: 20px 25px;
      }
      p {
        color: #99acb6;
        font-size: 12px;
        padding: 18px;
      }
      .check-box {
        font-size: 12px;
        margin-bottom: 20px;
      }
      .modal-text {
        border: none;
        width: 100%;
        padding: 0 25px 20px;
        max-height: 700px;
        text-align: left;
        font-size: 12px;
        color: #99acb6;
      }
      img {
        width: 400px;
      }
    }
  }
  &.LoginErrorModal {
    text-align: center;
    .close-btn {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      margin: 5px;
      font-size: 22px;
      color: #97a3b4;
    }
    .content {
      h1 {
        font-size: 18px;
        color: #4e6a79;
        border-bottom: 1px solid #eaeff2;
        padding: 18px;
      }
      p {
        color: #99acb6;
        font-size: 12px;
        padding: 18px;
      }
      .check-box {
        font-size: 12px;
        margin-bottom: 20px;
      }
    }
  }
  &.GoUnbindModal,
  &.ScatterFinded,
  &.ScatterBind,
  &.PhoneExistModal {
    text-align: center;
    .close-btn {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      margin: 5px;
      font-size: 22px;
      color: #97a3b4;
    }
    .content {
      h1 {
        font-size: 18px;
        color: #4e6a79;
        padding: 18px;
        border: none;
      }
      .padding {
        padding: 0px 35px 25px;
      }
      .tips {
        font-size: 12px;
        color: #99acb6;
      }
      p {
        color: #99acb6;
        font-size: 12px;
        padding: 18px;
      }
      .check-box {
        font-size: 12px;
        margin-bottom: 20px;
      }
      .cancel-btn {
        width: 40%;
        height: 40px;
        margin: 0 7px;
        letter-spacing: 0.6px;
        font-size: 16px;
        background-color: #fff;
        border-radius: 2px;
        border: solid 1px #5d97b6;
        color: #5d97b6;
      }
      .confirm-btn {
        letter-spacing: 0.6px;
        font-size: 16px;
        width: 40%;
        height: 40px;
        margin: 0 7px;
        border-radius: 2px;
        background-color: #5d97b6;
      }

      .single-btn {
        letter-spacing: 0.6px;
        font-size: 16px;
        width: 100%;
        height: 40px;
        margin: 0 7px;
        border-radius: 2px;
        background-color: #5d97b6;
      }
    }
  }
  &.NeedAuditModal,
  &.NeedLoginModal,
  &.CantReceiveSMS,
  &.WithdrawNotArrived,
  &.WalletModal,
  &.DeveiceLimitModal,
  &.NeedAccountBindModal,
  &.NonsupportUSAModal,
  &.IdRepeat,
  &.AuthSuccess,
  &.BihuAuthSuccess,
  &.NeedPassAuthModal,
  &.ChangeStakeALertModal,
  &.GuideModal {
    text-align: center;
    .close-btn {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      margin: 5px;
      font-size: 22px;
      color: #97a3b4;
    }
    .content {
      h1 {
        font-size: 18px;
        color: #4e6a79;
        padding: 18px;
        border: none;
      }
      h2 {
        color: #99acb6;
        font-size: 16px;
        padding: 16px 0 0 0;
        border: none;
      }
      .padding {
        padding: 0px 35px 25px;
      }
      p {
        color: #99acb6;
        font-size: 12px;
        padding: 18px;
      }
      .check-box {
        font-size: 12px;
        margin-bottom: 20px;
      }
      .reset-pass {
        margin-bottom: 20px;
        text-align: right;
        margin-right: 20px;
      }
      .cancel-btn {
        width: 40%;
        height: 40px;
        margin: 0 7px;
        letter-spacing: 0.6px;
        font-size: 16px;
        background-color: #fff;
        border-radius: 2px;
        border: solid 1px #5d97b6;
        color: #5d97b6;
      }
      .confirm-btn {
        letter-spacing: 0.6px;
        font-size: 16px;
        width: 50%;
        height: 40px;
        margin: 0 7px;
        border-radius: 2px;
        padding: 0;
        background-color: #5d97b6;
      }
    }
  }
`;
