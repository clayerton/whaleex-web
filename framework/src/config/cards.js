const products = [
  {
    key: 'mof',
    name: 'Whaleex',
    version: '3.2.1',
    categories: [
      {
        name: '盘中实时监控',
        key: 'mof.1',
        tags: '盘中实时监控',
      },
    ],
  },
  {
    key: 'rrp',
    name: '萝卜',
    version: '1.0.0',
    categories: [
      {
        name: '资讯类',
        key: 'rrp.info',
        tags: '资讯类',
      },
    ],
  },
];
const cards = [
  {
    product: 'mof',
    description: '',
    key: 'LatestBenchmarkReturn',
    name: '基准收益',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'HistoryHighLow',
    name: '创历史新高／新低股票',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'IndustryMoneyFlow',
    name: '行业资金流',
    tags: '投资大脑,盘中实时监控,type:bar2',
  },
  {
    product: 'mof',
    description: '',
    key: 'IndustryLevelOne',
    name: '申万一级行业涨跌情况',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'IndustryLevelTwo',
    name: '申万二级行业涨跌情况',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'FinancingEquityLoanBalance',
    name: '融资融券情况',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'SHHKMoneyFlow',
    name: '沪港通资金情况',
    tags: '投资大脑,盘中实时监控,type:bar1',
  },
  {
    product: 'mof',
    description: '',
    key: 'SZHKMoneyFlow',
    name: '深港通资金情况',
    tags: '投资大脑,盘中实时监控,type:bar1',
  },
  {
    product: 'mof',
    description: '',
    key: 'SecurityFundInOut',
    name: '证券资金转入转出情况',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'MarketFundFlow',
    name: '市场资金流入流出情况',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'MoneyFlowTheme',
    name: '主题监控',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'IndustryFactor',
    name: '行业指标',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'BulkFund',
    name: '大宗资金情况',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'EventsTimeDistribution',
    name: '事件数量时间分布',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'EventsStatistics',
    name: '事件数量统计',
    tags: '投资大脑,盘中实时监控,type:bar',
  },
  {
    product: 'mof',
    description: '',
    key: 'ExecHoldingChangeIndustry',
    name: '高管增减持行业分布',
    tags: '投资大脑,盘中实时监控,type:table',
  },
  {
    product: 'mof',
    description: '',
    key: 'ExecHoldingChangeStatistics',
    name: '高管增减持统计',
    tags: '投资大脑,盘中实时监控,type:bar',
  },
  {
    product: 'mof',
    description: '',
    key: 'ExecHoldingChangeTimeDistribution',
    name: '高管增减持时间分布',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'PerformanceForeCastChange',
    name: '业绩预期变动',
    tags: '投资大脑,盘中实时监控,type:pie',
  },
  {
    product: 'mof',
    description: '',
    key: 'StyleFactorMonitor',
    name: '风格因子监控',
    tags: '投资大脑,盘中实时监控,type:line',
  },
  {
    product: 'mof',
    description: '',
    key: 'MacroMonitor',
    name: '宏观资金面监控', // 资金面监
    tags: '投资大脑,盘中实时监控,type:bar',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'NEWS',
    name: '新闻资讯',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'EXTERNAL_REPORT',
    name: '券商研报',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'ANNOUNCEMENT',
    name: '公司公告',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'STOCK_REPORT',
    name: '智能研报',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'ANNOUNCEMENT_EVENT',
    name: '公告事件',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'MONITOR_GROUP_MARKET',
    name: '市场统计',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'MONITOR_GROUP_MACRO',
    name: '宏观经济',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'MONITOR_GROUP_INDUSTRY',
    name: '行业经济',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'MONITOR_GROUP_MY',
    name: '我的监控',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'PEER_COMPARISON',
    name: '同行业对比',
  },
  {
    product: 'rrp',
    tags: '资讯类',
    description: '',
    key: 'SECURITY_POOL',
    name: '股票池',
  },
];

export const getProducts = () =>
  new Promise((resolve, reject) => {
    resolve(products.reduce((re, p) => Object.assign(re, { [p.key]: p }), {}));
  });

export const getCards = (tags) =>
  new Promise((resolve, reject) => {
    getProducts().then((products) => {
      resolve(
        cards.map((c) => ({
          ...c,
          type: `${c.product}/${c.key}`,
          version: c.version || products[c.product].version,
        }))
      );
    });
  });
