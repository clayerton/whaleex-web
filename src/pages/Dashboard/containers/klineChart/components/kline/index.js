import React from 'react';
import PropTypes from 'prop-types';

import echarts from 'echarts';
import U from 'whaleex/utils/extends';
import F from './func.js';
import getgrid from './grid.js';
import getTooltip from './tooltip.js';
import getxAxis from './xAxis.js';
import getyAxis from './yAxis.js';
import getseries from './series.js';
import color from './color.js';
import { Spin } from 'antd';
const { upColor, downColor } = color;
export default class Kline extends React.Component {
  shouldComponentUpdate(nextProps) {
    const isChanged = U.isObjDiff([nextProps, this.props], ['loading', 'data']);
    if (isChanged) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    // var myChart = echarts.init(this.echarts);
    var myChart = echarts.init(document.getElementById('chart-div'));
    let toogleIndex = 0;

    var data = F.splitData(this.props.data);
    const { categoryData, values } = data;
    const MA5 = F.calculateMA(5, data);
    const MA10 = F.calculateMA(10, data);
    const MA20 = F.calculateMA(20, data);
    const MA30 = F.calculateMA(30, data);
    const dataList = {
      MA5,
      MA10,
      MA20,
      MA30,
    };
    let { series, seriesExtends } = getseries(data, dataList);
    let { grid, gridExtends } = getgrid(data);
    let { xAxis, xAxisExtends } = getxAxis(data);
    let { yAxis, yAxisExtends } = getyAxis(data);

    let dataZoomIndex = [0, 2];
    if (!!seriesExtends) {
      series = series.concat(seriesExtends);
      grid = grid.concat(gridExtends);
      xAxis = xAxis
        .map(i => {
          i.axisLabel.show = false;
          const pre = i.axisPointer || {};
          i.axisPointer = { ...pre, label: { show: false } };
          return i;
        })
        .concat(xAxisExtends);
      yAxis = yAxis.concat(yAxisExtends);
      dataZoomIndex = [0, 2, 4];
    }
    myChart.setOption(
      {
        backgroundColor: '#fff',
        animation: false,
        legend: {
          top: 10,
          left: 'center',
          data: ['Kline', 'MA5', 'MA10', 'MA20', 'MA30'],
        },
        tooltip: getTooltip(myChart, dataList),
        axisPointer: {
          link: { xAxisIndex: 'all' },
          label: {
            backgroundColor: '#777',
            fontSize: 10,
            padding: [4, 0, 4, 0],
          },
        },
        visualMap: {
          show: false,
          seriesIndex: [7, 9], //映射到哪个series
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: downColor,
            },
            {
              value: -1,
              color: upColor,
            },
          ],
        },
        grid,
        xAxis,
        yAxis,
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: dataZoomIndex,
            start: 98,
            end: 100,
          },
        ],
        series,
      },
      true
    );
    const resetToolTip = a => {
      myChart.setOption({
        xAxis: [
          {
            axisLabel: {
              show: false,
            },
          },
          {},
          {},
          {
            axisLabel: {
              show: false,
            },
          },
          {},
          {
            axisLabel: {
              show: false,
            },
          },
        ],
      });
    };
    // myChart.on('mouseout', () => resetToolTip(1));
    myChart.on('globalout', () => {
      setTimeout(resetToolTip, 100);
    });
    myChart.on('click', a => {
      if (a.seriesName !== 'macd') {
        return;
      }
      let splitLine = { show: false };
      if (!toogleIndex) {
        splitLine = { show: true };
      }
      myChart.setOption({
        xAxis: [{}, {}, {}, {}, { splitLine }],
      });
      toogleIndex = (toogleIndex + 1) % 2;
    });
    window.addEventListener('resize', myChart.resize);
  }
  render() {
    const { loading } = this.props;
    return (
      <div
        id="chart-div"
        style={{ width: '100%', height: '100%', minHeight: '300px' }}
        ref={c => {
          this.echarts = c;
        }}
      />
    );
  }
}

Kline.PropTypes = {};
