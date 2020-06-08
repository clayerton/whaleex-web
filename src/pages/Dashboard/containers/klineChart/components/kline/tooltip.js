var last;
const debounceSetOption = (idle = 50, action) => {
  return function() {
    var ctx = this,
      args = arguments;
    clearTimeout(last);
    last = setTimeout(function() {
      action.apply(ctx, args);
    }, idle);
  };
};
export default (myChart, { MA5, MA10, MA20, MA30 }) => ({
  trigger: 'axis',
  axisPointer: {
    type: 'cross',
  },
  backgroundColor: 'rgba(245, 245, 245, 0.8)',
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  hideDelay: 500,
  textStyle: {
    color: '#4e6a79',
  },
  formatter: (params, ticket, b, c) => {
    const { data, axisValue } =
      params.filter(
        ({ componentSubType }) => componentSubType === 'candlestick'
      )[0] || {};
    if (!data) {
      return null;
    }
    const [index, open, close, lowest, highest, volume] = data;
    debounceSetOption(undefined, () => {
      myChart.setOption({
        xAxis: [
          {
            axisLabel: {
              align: 'left',
              show: true,
              formatter: (v, idx, b, c, d) => {
                if (idx === 0) {
                  return `{a|MA5:${MA5[index]}} MA10:${MA10[index]} {b|MA20:${
                    MA20[index]
                  }} MA30:${MA30[index]}`;
                }
                return '';
              },
              showMinLabel: true,

              rich: {
                a: {
                  color: 'red',
                },
                b: {
                  color: 'blue',
                },
              },
            },
          },
          {},
          {},
          {
            axisLabel: {
              show: true,
              align: 'left',
              formatter: (v, idx) => {
                if (idx === 0) {
                  return `{a|成交量: ${data[5]}}`;
                }
                return '';
              },
              showMinLabel: true,
              position: 'top',
              rich: {
                a: {
                  color: 'red',
                },
                b: {
                  color: 'blue',
                },
              },
            },
          },
          {},
          {
            axisLabel: {
              show: true,
              align: 'left',
              formatter: (v, idx) => {
                if (idx === 0) {
                  return `{a|成交量: ${data[5]}}`;
                }
                return '';
              },
              showMinLabel: true,
              position: 'top',
              rich: {
                a: {
                  color: 'red',
                },
                b: {
                  color: 'blue',
                },
              },
            },
          },
        ],
      });
    })();
    return `<span>${axisValue}<br/><M id='klineChart.open' />: ${open}<br/><M id='klineChart.off' />: ${close}<br/><M id='klineChart.min' />: ${lowest}<br/><M id='klineChart.max' />: ${highest}<br/><M id='klineChart.suc' />: ${volume}</span>`;
  },
  position: function(pos, params, el, elRect, size) {
    var obj = { top: 80 };
    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 80;
    return obj;
  },
  // extraCssText: 'width: 170px'
});
