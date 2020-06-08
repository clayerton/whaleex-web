export default function(data) {
  let yAxis = [
    {
      scale: true,
      position: 'right',
      axisLine: {
        lineStyle: {
          opacity: 0.2,
        },
      },
      axisTick: {
        lineStyle: {
          opacity: 0.2,
        },
      },
      axisLabel: { color: 'rgba(0, 0, 0, 0.5)', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.05)' } },
    },
    {
      scale: true,
      gridIndex: 1,
      position: 'right',
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ];
  const yAxisExtends = [
    {
      scale: true,
      gridIndex: 2,
      position: 'right',
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ];
  return { yAxis, yAxisExtends };
}
