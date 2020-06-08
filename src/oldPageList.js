import {
  KlineChart,
  Trade,
  User,
  DepoWith,
  DepoWithDetail,
  DepositDetail,
  DepoWithList,
  TradeDetail,
  Asset,
  Auth,
  Invite,
  ResetPass,
  ResetPhone,
  ResetMail,
  ResetGoogle,
  PkAddress,
  Deposit,
  Withdraw,
  OrderBookPage,
  HomePage,
  PositionLock,
  PositionUnlock,
  PositionUnlockList,
  PositionList,
  SetPass,
  ChainStatus,
  PkAddressNotActive,
  AppDownload,
  EosWorld,
  MinePage,
  DepoWithPage,
  Market,
  StepPage,
  StakeFor,
} from 'whaleex/pages/Dashboard/containers';
import Login from 'whaleex/common/Login';
import Register from 'whaleex/common/Register';
import ForgetPwd from 'whaleex/common/ForgetPwd';
const oldPageList = [
  {
    key: '/whaleex/dash/trade',
    component: Trade,
    children: [
      {
        key: 'orderBook/:symbolStr',
        component: OrderBookPage,
      },
      { key: ':symbolStr', component: Trade },
    ],
  },
  {
    key: '/whaleex',
    children: [
      { key: 'dash/homePage', component: HomePage },
      { key: 'dash/download', component: AppDownload },
      { key: 'dash/eosworld', component: EosWorld },
      { key: 'dash/minePage', component: MinePage },
      { key: 'dash/market', component: Market },
      { key: 'dash/stakeFor', component: StakeFor },
      { key: 'dash/user', component: Asset },
      { key: 'dash/usercenter', component: User },
      { key: 'login', component: Login },
      { key: 'register', component: Register },
      { key: 'forgetPwd', component: ForgetPwd },
    ],
  },
];
export default oldPageList;
