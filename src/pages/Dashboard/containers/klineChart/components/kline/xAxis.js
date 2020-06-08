export default function(data) {
  let xAxis = [
    {
      //show tips
      type: 'category',
      data: data.categoryData,
      min: 'dataMin',
      max: 'dataMax',
      position: 'top',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: false,
      },
      axisPointer: {
        label: { show: false },
      },
    },
    {
      type: 'category',
      data: data.categoryData,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        show: false,
        inside: true,
      },
      min: 'dataMin',
      max: 'dataMax',
      position: 'top',
      axisPointer: {
        show: false,
      },
    },
    {
      type: 'category',
      gridIndex: 1,
      data: data.categoryData,
      axisLine: { onZero: false, lineStyle: { opacity: 0.2 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: 'rgba(0, 0, 0, 0.2)', fontSize: 10 },
      min: 'dataMin',
      max: 'dataMax',
    },
    {
      //show tips
      type: 'value',
      gridIndex: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        show: false,
        inside: true,
      },
      min: 'dataMin',
      max: 'dataMax',
      position: 'top',
      axisPointer: {
        show: false,
      },
    },
  ];
  // toogle change
  const xAxisExtends = [
    {
      type: 'category',
      gridIndex: 2,
      data: data.categoryData,
      axisLine: { onZero: false, lineStyle: { opacity: 0.2 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: 'rgba(0, 0, 0, 0.2)', fontSize: 10 },
      min: 'dataMin',
      max: 'dataMax',
    },
    {
      type: 'value',
      gridIndex: 2,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        show: false,
        inside: true,
      },
      min: 'dataMin',
      max: 'dataMax',
      position: 'top',
      axisPointer: {
        show: false,
      },
    },
  ];
  return { xAxis, xAxisExtends };
}
