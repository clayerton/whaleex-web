import React from 'react';
import PropTypes from 'prop-types';
import U from 'whaleex/utils/extends';
import M from 'whaleex/components/FormattedMessage';
import Highcharts from 'highcharts/highstock';
import { Spin } from 'antd';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import './style.less';

class DeepView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps) {
    const isChanged = U.isObjDiff([nextProps, this.props], ['asks', 'bids']);
    if (isChanged) {
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    const isAskChanged = U.isObjDiff([nextProps, this.props], ['asks']);
    if (isAskChanged) {
      Highcharts.zdy_chart.series[1].setData(this.accumulation(nextProps.asks));
    }
    const isBidChanged = U.isObjDiff([nextProps, this.props], ['bids']);
    if (isBidChanged) {
      Highcharts.zdy_chart.series[0].setData(this.accumulation(nextProps.bids));
    }
  }
  componentDidMount() {
    var chartTheme = {
      colors: ['rgba(79,157,97,0.7)', 'rgba(217,108,75,0.7)'],
      xAxis: {
        gridLineWidth: 1,
        lineColor: '#fff',
        // endOnTick: true,
        showLastLabel: true,
        tickColor: '#fff',
        tickPixelInterval: 100,
        labels: {
          style: {
            color: '#4e6a79',
          },
        },
        title: {
          style: {
            color: '#333',
          },
        },
      },
      yAxis: {
        gridLineWidth: 1,
        lineColor: '#fff',
        lineWidth: 1,
        tickWidth: 1,
        opposite: true,
        labels: {
          style: {
            color: '#4e6a79',
          },
        },
        title: null,
      },
      plotOptions: {
        series: {
          fillOpacity: 0.8,
        },
      },
      credits: {
        enabled: false,
      },
    };
    Highcharts.setOptions(chartTheme);
    this.loadChart(this.props);
  }
  accumulation = (arrObj = []) => {
    let _arrObj = (!!arrObj && arrObj) || [];
    const { symbol } = this.props;
    let sum = 0;
    return _arrObj.reduce((pre, cur) => {
      const { price, quantity } = cur;
      pre.push([+price, +(+quantity + sum).toFixed(symbol.lotSize.length - 2)]);
      sum = +quantity + sum;
      return pre;
    }, []);
  };
  loadChart = props => {
    const {
      intl: { formatMessage },
    } = this.props;
    let { asks, bids } = props;
    if (_.isEmpty(asks) && _.isEmpty(bids)) {
      this.setState({ noData: true });
      this.forceUpdate();
      return;
    }
    asks = asks || [];
    bids = bids || [];
    let price1 = _.get(props, 'asks[0].price', 0);
    let price2 = _.get(props, 'bids[0].price', 0);
    let middlePrice = (Number(price1) + Number(price2)) / 2;
    asks = asks
      .slice(0, 5)
      .concat(asks.slice(5).filter(({ price }) => price < middlePrice * 1.1));
    bids = bids
      .slice(0, 5)
      .concat(bids.slice(5).filter(({ price }) => price > middlePrice * 0.9));
    const series = [
      {
        name: formatMessage({ id: 'components.buy' }),
        data: this.accumulation(bids),
      },
      {
        name: formatMessage({ id: 'components.sell' }),
        data: this.accumulation(asks),
      },
    ];
    Highcharts.zdy_chart = new Highcharts.Chart(this.chart, {
      chart: {
        type: 'area',
      },
      legend: {
        align: 'left',
        verticalAlign: 'top',
        x: 10,
        y: 20,
        floating: true,
        symbolRadius: 0,
      },
      title: null,
      xAxis: {
        title: null,
        labels: {
          formatter: function() {
            return this.value;
          },
        },
      },
      yAxis: {
        title: null,
        labels: {
          formatter: function() {
            return this.value;
          },
        },
      },
      tooltip: {
        shared: !0,
        formatter: function() {
          return (
            this.points[0].series.name +
            '<br/>' +
            formatMessage({ id: 'components.price' }) +
            '' +
            this.points[0].x +
            '<br/>' +
            formatMessage({ id: 'components.measurement' }) +
            this.points[0].y
          );
          // return "委 托 价 ：" + '￥'+ this.points[0].x + "<br>" + this.points[0].series.name + "：" + '累计数量' + Math.round(this.points[0].y)
        },
      },
      plotOptions: {
        area: {
          pointStart: 0,
          marker: {
            enabled: !1,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: !0,
              },
            },
          },
        },
      },
      series: series,
      // series: [
      //   {
      //     name: '买盘',
      //     data: [
      //       [214, 99],
      //       [289, 78],
      //       [305, 59],
      //       [458, 36],
      //       [500, 45],
      //       [900, 12],
      //     ],
      //   },
      //   {
      //     name: '卖盘',
      //     data: [
      //       [910, 8],
      //       [1000, 14],
      //       [1100, 29],
      //       [1200, 45],
      //       [1300, 59],
      //       [1400, 81.2],
      //     ],
      //   },
      // ],
    });
  };
  render() {
    const { className } = this.props;
    const { noData } = this.state;
    if (noData) {
      return (
        <div className={`${className} spin-center`}>
          <M id="warning.noData" />
        </div>
      );
    }
    return <div ref={cur => (this.chart = cur)} className={className} />;
  }
}

DeepView.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(DeepView);
