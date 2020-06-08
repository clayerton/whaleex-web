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
import oldPageList from './oldPageList.js';
import { M } from 'whaleex/components';
const pageMap = [
  ...oldPageList,
  {
    key: '/homePage',
    title: <M id="route.homePage" />,
    component: HomePage,
  },
  {
    key: '/download-web',
    title: <M id="route.appDownload" />,
    component: AppDownload,
  },
  {
    key: '/eosworld',
    title: <M id="route.eosWorld" />,
    component: EosWorld,
  },
  {
    key: '/minePage',
    title: <M id="route.minePage" />,
    component: MinePage,
  },
  {
    key: '/market',
    title: <M id="route.market" />,
    component: Market,
  },
  {
    key: '/stakeFor',
    title: <M id="route.market" />,
    component: StakeFor,
  },
  {
    key: '/trade',
    title: <M id="route.trade" />,
    component: Trade,
    children: [
      {
        key: 'orderBook/:symbolStr',
        title: <M id="route.orderBookPage" />,
        component: OrderBookPage,
      },
      { key: ':symbolStr', title: <M id="route.trade" />, component: Trade },
    ],
  },
  // {
  //   key: 'asset',
  //   title: '我的资产',
  //   component: Asset,
  //   icon: 'icon-Home-tablebar-caichan',
  //   children: [
  //     // { key: 'deposit/:id', title: '充币', component: DepoWith },
  //     // { key: 'withdraw/:id', title: '提币', component: DepoWith },
  //     {
  //       key: 'tradeDetail',
  //       title: '交易记录',
  //       component: TradeDetail,
  //       icon: 'icon-jiaoyi-xiangqing',
  //     },
  //     {
  //       key: 'pkAddress',
  //       title: '资产账户绑定',
  //       component: PkAddress,
  //       icon: 'icon-EOS',
  //     },
  //     {
  //       key: 'depowith',
  //       title: '财务记录',
  //       component: DepoWithList,
  //       icon: 'icon-caiwujilu',
  //     },
  //             {
  //   key: 'auth',
  //   title: '身份认证',
  //   component: Auth,
  //   icon: 'icon-identity',
  // },
  //   ],
  // },
  {
    key: '/user',
    title: <M id="route.asset" />,
    icon: 'icon-caiwujilu',
    component: Asset,
    children: [
      {
        key: 'setting',
        title: <M id="route.setting" />,
        component: User,
        icon: 'icon-setting1',
      },
      {
        key: 'invite',
        title: <M id="route.invite" />,
        component: Invite,
        icon: 'icon-yaoqinghaoyou',
      },
      {
        key: 'tradeDetail',
        title: <M id="route.tradeDetail" />,
        component: TradeDetail,
        icon: 'icon-jiaoyi-xiangqing',
      },
      // {
      //   key: 'asset',
      //   title: <M id="route.asset" />,
      //   component: Asset,
      //   icon: 'icon-caiwujilu',
      // },
    ],
  },
  {
    key: '/tradeDetailAction',
    title: <M id="route.tradeDetail" />,
    component: TradeDetail,
    children: [
      {
        key: 'item/:id',
        title: <M id="route.uploadChain" />,
        component: ChainStatus,
      },
    ],
  },
  {
    key: '/usercenter',
    title: <M id="route.userCenter" />,
    component: User,
    children: [
      {
        key: 'pkAddressNotActive',
        title: <M id="route.pkAddressNotActive" />,
        component: PkAddressNotActive,
      },
      {
        key: 'resetPass',
        title: <M id="route.resetPass" />,
        component: ResetPass,
      },
      { key: 'setPass', title: <M id="route.setPass" />, component: SetPass },
      {
        key: 'resetPhone',
        title: <M id="route.resetPhone" />,
        component: ResetPhone,
      },
      {
        key: 'resetMail',
        title: <M id="route.resetMail" />,
        component: ResetMail,
      },
      {
        key: 'resetGoogle',
        title: <M id="route.resetGoogle" />,
        component: ResetGoogle,
      },
      {
        key: 'pkAddress/:step/:pk',
        title: <M id="route.pkAddress" />,
        component: PkAddress,
      },
      {
        key: 'pkAddress/:step',
        title: <M id="route.pkAddress" />,
        component: PkAddress,
      },
      {
        key: 'auth',
        title: <M id="route.auth" />,
        component: Auth,
      },
    ],
  },
  {
    key: '/assetAction',
    title: <M id="route.asset" />,
    component: Asset,
    children: [
      {
        key: 'deposit/:currencyName',
        title: <M id="route.deposit" />,
        component: Deposit,
      },
      {
        key: 'withdraw/:currencyName',
        title: <M id="route.withdraw" />,
        component: Withdraw,
      },
      {
        key: 'depowith',
        title: <M id="route.depowith" />,
        component: DepoWithList,
      },
      {
        key: 'depowithPage',
        title: <M id="route.depowith" />,
        component: DepoWithPage,
      },
      {
        key: 'positionLock',
        title: <M id="route.positionLock" />,
        component: PositionLock,
      },
      {
        key: 'positionUnlock',
        title: <M id="route.positionUnlock" />,
        component: PositionUnlock,
      },
      {
        key: 'positionUnlockList',
        title: <M id="route.positionUnlockList" />,
        component: PositionUnlockList,
      },
      {
        key: 'positionList',
        title: <M id="route.positionList" />,
        component: PositionList,
      },
    ],
  },
  {
    key: '/assetDepoWith/deposit/:recordId',
    title: <M id="route.asset" />,
    component: DepositDetail,
  },
  {
    key: '/assetDepoWith/withdraw/:recordId',
    title: <M id="route.asset" />,
    component: DepoWithDetail,
  },
  {
    key: '/stepPage/:type/:execId',
    title: <M id="route.homePage" />,
    component: StepPage,
  },
];
const unZip = pageMap => {
  return pageMap.reduce((r, { key, title, component, children, ...other }) => {
    if (children && children.length) {
      children.forEach(({ key: key2, title, component, ...other }) => {
        r.push({
          path: `${key}/${key2}`,
          title,
          component,
          ...other,
        });
      });
    }
    r.push({ path: `${key}`, title, component, ...other });
    return r;
  }, []);
};
const getSubPath = topPath => {
  return pageMap.filter(({ key }) => key === topPath);
};
/*
subPath need unZip
 */
const getLevelPath = (subPath, levels = 1) => {
  return subPath
    .filter(({ path }) => {
      return path.split('/').length < levels + 4;
    })
    .reverse();
};
const shouldShowMaintenance = path => {
  // noMtPages 以及 notFound，download，maintenance 这些页面不需要在网站维护的时候关闭
  let noMtPages = [];
  if (noMtPages.includes(path)) {
    return false;
  }
  return _config.system_maintenance === 'true';
};
export { pageMap, unZip, getSubPath, getLevelPath, shouldShowMaintenance };
