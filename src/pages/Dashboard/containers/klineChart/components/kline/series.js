import { M } from 'whaleex/components';
import color from './color.js';
const { upColor, downColor } = color;
export default function(data, dataList) {
  const { MA5, MA10, MA20, MA30 } = dataList;
  let markPointData = [
    {
      name: <M id='klineChart.max' />,
      type: 'max',
      valueDim: 'highest',
      symbol: 'arrow',
      symbolSize: '8',
      symbolRotate: 270,
      label: {
        position: [-60, 0],
      },
      itemStyle: {
        color: 'rgba(0,0,0,0.6)',
      },
    },
    {
      name: <M id='klineChart.min' />,
      type: 'min',
      valueDim: 'lowest',
      symbol: 'arrow',
      symbolSize: '8',
      symbolRotate: 270,
      label: {
        position: [-60, 0],
      },
      itemStyle: {
        color: 'rgba(0,0,0,0.6)',
      },
    },
  ];
  const lastCloseMaker = [
    {
      name: <M id='klineChart.near' />,
      type: 'max',
      valueIndex: 0,
      symbol: 'rect',
      symbolSize: [50, 20],
      symbolOffset: [34, 0],
      symbolKeepAspect: true,
      itemStyle: {
        color: 'rgba(0,0,0,0.5)',
      },
      label: {
        formatter: item => {
          return item.data.coord[1];
        },
        fontSize: 10,
        textBorderWidth: 0,
      },
    },
  ];
  let series = [
    {
      name: 'Kline',
      type: 'candlestick',
      data: data.values,
      markPoint: {
        data: markPointData,
      },
      itemStyle: {
        normal: {
          color: upColor,
          color0: downColor,
          borderColor: null,
          borderColor0: null,
        },
      },
    },
    {
      name: 'Kline-close',
      type: 'line',
      data: data.close,
      symbol: 'none',
      lineStyle: {
        opacity: 0,
      },
      markPoint: {
        data: lastCloseMaker,
      },
    },
    {
      name: 'Kline-close-last',
      type: 'line',
      data: data.closeLast,
      symbol: 'none',
      xAxisIndex: 1,
      sampling: 'max',
      lineStyle: { width: 1, color: 'rgba(0,0,0,0.5)', type: 'dashed' },
    },
    {
      name: 'MA5',
      type: 'line',
      symbol: 'none',
      data: MA5,
      smooth: true,
      lineStyle: {
        normal: { opacity: 0.5 },
      },
    },
    {
      name: 'MA10',
      type: 'line',
      symbol: 'none',
      data: MA10,
      smooth: true,
      lineStyle: {
        normal: { opacity: 0.5 },
      },
    },
    {
      name: 'MA20',
      type: 'line',
      symbol: 'none',
      data: MA20,
      smooth: true,
      lineStyle: {
        normal: { opacity: 0.5 },
      },
    },
    {
      name: 'MA30',
      type: 'line',
      symbol: 'none',
      data: MA30,
      smooth: true,
      lineStyle: {
        normal: { opacity: 0.5 },
      },
    },
    {
      name: 'Volume',
      type: 'bar',
      xAxisIndex: 2,
      yAxisIndex: 1,
      data: data.volumes,
    },
    {
      name: 'label',
      type: 'line',
      xAxisIndex: 3,
      yAxisIndex: 1,
      symbol: 'none',
      data: [[0]],
    },
  ];
  // toogle change
  const seriesExtends = [
    {
      name: 'macd',
      type: 'bar',
      xAxisIndex: 4,
      yAxisIndex: 2,
      symbol: 'none',
      data: data.volumes,
    },
    {
      name: 'macd',
      type: 'line',
      xAxisIndex: 5,
      yAxisIndex: 2,
      symbol: 'rect',
      z: -1,
      symbolSize: [2000, 80],
      symbolOffset: [0, '-50%'],
      itemStyle: { color: 'transparent' },
      data: [[0, 0]],
    },
  ];
  return { series, seriesExtends };
}
