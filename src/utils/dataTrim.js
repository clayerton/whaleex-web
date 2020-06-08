import digitUtils from './digit';

export function trimBenchmarkNav(rawBenchmarkNav = [], beginDate = '', endDate = '') {
  const { benchmarkNav, baseBen } = getBenchmarkNav(rawBenchmarkNav, beginDate, endDate);

  return benchmarkNav.map(na => [
    new Date(na.date).getTime(),
    (na.value / baseBen.value - 1) * 100,
  ]);
}

export function trimNavsToExcel(rawBenchmarkNav, rawNav) {
  const { benchmarkNav, baseBen } = getBenchmarkNav(rawBenchmarkNav, rawNav[0].date);
  const baseValue = rawNav[0].value;
  return _.sortBy(
    rawNav.map((na) => {
      const curBen = benchmarkNav.find(benNa => benNa.date === na.date) || {};
      return {
        date: na.date,
        nav: digitUtils.format(na.value / baseValue - 1, '0.00%') || '--',
        benNav: digitUtils.format(curBen.value / baseBen.value - 1, '0.00%') || '--',
      };
    }),
    'date',
  ).reverse();
}

function getBenchmarkNav(rawBenchmarkNav = [], beginDate, endDate) {
  let benchmarkNav = _.sortBy(rawBenchmarkNav, 'date');
  const belowBens = benchmarkNav.filter(benNav => benNav.date <= beginDate);
  const baseBen = belowBens.length > 0 ? belowBens[0] : benchmarkNav[0];
  if (endDate) benchmarkNav = benchmarkNav.filter(nav => nav.date <= endDate);
  return {
    benchmarkNav: benchmarkNav.filter(na => na.date >= beginDate),
    baseBen,
  };
}

export function getBackTestReturnSeries(portfolio, benchmark, childPortfolio, benchmarkName) {
  const { benchmarkNav, baseBen } = getBenchmarkNav(benchmark, portfolio[0].date);
  const baseValue = portfolio[0].value;
  const series = [
    {
      name: '目标方案',
      data: portfolio.map(item => [moment(item.date).valueOf(), item.value / baseValue - 1]),
    },
    {
      name: benchmarkName,
      data: benchmarkNav.map(item => [moment(item.date).valueOf(), item.value / baseBen.value - 1]),
    },
  ];
  const childSeries = childPortfolio.map((child) => {
    const benNavs = _.map(child.nav, (val, key) => ({ date: key, value: val }));
    const { benchmarkNav: childNav, baseBen: childBaseBen } = getBenchmarkNav(
      benNavs,
      portfolio[0].date,
    );
    return {
      name: child.accountName,
      visible: false,
      data: childNav.map(cNav => [
        moment(cNav.date).valueOf(),
        cNav.value / childBaseBen.value - 1,
      ]),
    };
  });
  return series.concat(childSeries);
}
