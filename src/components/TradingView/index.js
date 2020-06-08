import React from 'react';
import PropTypes from 'prop-types';
import U from 'whaleex/utils/extends';
import M from 'whaleex/components';
import { injectIntl } from 'react-intl';
import * as TradingView from 'web-static/charting_library/charting_library.min.js';
import 'web-static/datafeeds/udf/dist/polyfills.js';
import * as Datafeeds from 'web-static/datafeeds/udf/dist/bundle.js';
const windowDatafeeds = Datafeeds;
const windowTradingView = TradingView;
let staticApi = _config.app_sapi || _config.app_api;
const isLocal = window.location.hostname === 'localhost';
class TradingKline extends React.Component {
  static defaultProps = {
    symbol: 'WALETH',
    interval: '1D',
    containerId: 'tv_chart_container',
    datafeedUrl: staticApi + '/BUSINESS/api/public',
    libraryPath:
      (isLocal && '/web-static/localTV/charting_library/') ||
      '/web-static/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const isChanged = U.isObjDiff(
      [nextProps, this.props],
      ['symbol', 'tabIdx', 'MINEING']
    );
    if (isChanged) {
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      clearInterval(window.tvtimer);
      this.createTv(nextProps);
    } else if (nextProps.MINEING !== this.props.MINEING) {
      clearInterval(window.tvtimer);
      if (nextProps.MINEING) {
        this.createTv(nextProps, 1);
      } else {
        this.createTv(nextProps);
      }
    }
  }
  componentDidMount() {
    this.createTv(this.props);
  }
  componentWillUnmount() {
    clearInterval(window.tvtimer);
  }
  createTv = (props, _resolution) => {
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const {
      intl: { formatMessage, locale },
    } = props;
    const disabled_features = [
      'use_localstorage_for_settings', //用户本地存储
      'header_saveload', //header save saveload
      'header_chart_type', //指针等等类型
      'header_screenshot', //截屏
      'header_undo_redo', //撤销 重做按钮
      'header_compare', //header 对比
      'border_around_the_chart', //边框
      'volume_force_overlay', //成交量分离
      'header_symbol_search',
      'symbol_search_hot_key',
      'header_resolutions',
      'source_selection_markers', //线上的点
      'show_chart_property_page', //弹出的属性框
      'adaptive_logo',
      'timeframes_toolbar', //底部工具栏  跳转等
      'property_pages', //图线的样式弹框
      'context_menus', //鼠标右击 显示属性
      // 'header_fullscreen_button',
      // 'pane_context_menu',
      // 'scales_context_menu',
      // 'legend_context_menu',

      // 'display_market_status',
      // 'chart_property_page_style',
      // 'timezone_menu',
      // 'source_selection_markers',
      // 'dont_show_boolean_study_arguments',
      // 'symbol_info',
      // 'edit_buttons_in_legend',
      // 'control_bar',
    ];
    const enabled_features = ['hide_left_toolbar_by_default'];
    const timrList = [
      { resolution: '1', label: formatMessage({ id: 'tradingView.minute' }) },
      {
        resolution: '1',
        label: formatMessage({ id: 'tradingView.1min' }, { data: '1' }),
      },
      {
        resolution: '5',
        label: formatMessage({ id: 'tradingView.5min' }, { data: '5' }),
      },
      {
        resolution: '15',
        label: formatMessage({ id: 'tradingView.15min' }, { data: '15' }),
      },
      {
        resolution: '30',
        label: formatMessage({ id: 'tradingView.30min' }, { data: '30' }),
      },
      {
        resolution: '60',
        label: formatMessage({ id: 'tradingView.1hour' }, { data: 1 }),
      },
      // { resolution: '120', label: '2hour' },
      {
        resolution: '240',
        label: formatMessage({ id: 'tradingView.4hour' }, { data: 4 }),
      },
      // { resolution: '360', label: '6hour' },
      // { resolution: '720', label: '12hour' },
      { resolution: '1D', label: formatMessage({ id: 'tradingView.day' }) },
      // { resolution: '3D', label: '3day' },
      { resolution: '1W', label: formatMessage({ id: 'tradingView.week' }) },
      { resolution: '1M', label: formatMessage({ id: 'tradingView.mon' }) },
    ];
    const _datafeed = new windowDatafeeds.UDFCompatibleDatafeed(
      props.datafeedUrl,
      5000
    );

    const widgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: _datafeed,
      interval: _resolution || props.interval,
      container_id: props.containerId,
      library_path: props.libraryPath,
      locale: locale,
      disabled_features: disabled_features,
      enabled_features: enabled_features,
      charts_storage_url: props.chartsStorageUrl,
      charts_storage_api_version: props.chartsStorageApiVersion,
      client_id: props.clientId,
      user_id: props.userId,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      custom_css_url: '/web-static/customStyle/index.css',
      theme: 'Dark',
      timezone: timeZone,
      overrides: {
        // 'mainSeriesProperties.areaStyle.color1': 'rgba(71, 78, 112, 0.1)',
        // 'mainSeriesProperties.areaStyle.color2': 'rgba(71, 78, 112, 0.02)',
        // 'mainSeriesProperties.areaStyle.linecolor': '#9194a4',
        'mainSeriesProperties.areaStyle.linewidth': 1,
        'mainSeriesProperties.areaStyle.priceSource': 'close',
        'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.barStyle.dontDrawOpen': false,
        'mainSeriesProperties.barStyle.downColor': '#ef5555',
        'mainSeriesProperties.barStyle.upColor': '#03c087',
        'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.candleStyle.borderColor': '#9194a4',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef5555',
        'mainSeriesProperties.candleStyle.borderUpColor': '#03c087',
        'mainSeriesProperties.candleStyle.downColor': '#ef5555',
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.upColor': '#03c087',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef5555',
        'mainSeriesProperties.candleStyle.wickUpColor': '#03c087',
        'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.haStyle.borderColor': '#9194a4',
        'mainSeriesProperties.haStyle.borderDownColor': '#ef5555',
        'mainSeriesProperties.haStyle.borderUpColor': '#03c087',
        'mainSeriesProperties.haStyle.downColor': '#ef5555',
        'mainSeriesProperties.haStyle.drawBorder': true,
        'mainSeriesProperties.haStyle.drawWick': true,
        'mainSeriesProperties.haStyle.upColor': '#03c087',
        'mainSeriesProperties.haStyle.wickColor': '#9194a4',
        'mainSeriesProperties.hollowCandleStyle.borderColor': '#9194a4',
        'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#ef5555',
        'mainSeriesProperties.hollowCandleStyle.borderUpColor': '#03c087',
        'mainSeriesProperties.hollowCandleStyle.downColor': '#ef5555',
        'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
        'mainSeriesProperties.hollowCandleStyle.drawWick': true,
        'mainSeriesProperties.hollowCandleStyle.upColor': '#03c087',
        'mainSeriesProperties.lineStyle.color': '#9194a4',
        'mainSeriesProperties.lineStyle.linewidth': 1,
        'mainSeriesProperties.lineStyle.priceSource': 'close',
        'mainSeriesProperties.showCountdown': false,
        'mainSeriesProperties.style': 1,
        'paneProperties.background': '#ffffff',
        'paneProperties.crossHairProperties.color': '#23283D',
        'paneProperties.horzGridProperties.color': '#f7f8fa',
        'paneProperties.legendProperties.showLegend': false,
        'paneProperties.legendProperties.showSeriesOHLC': true,
        'paneProperties.legendProperties.showSeriesTitle': true,
        'paneProperties.legendProperties.showStudyArguments': true,
        'paneProperties.legendProperties.showStudyTitles': true,
        'paneProperties.legendProperties.showStudyValues': true,
        'paneProperties.vertGridProperties.color': '#f7f8fa',
        'scalesProperties.lineColor': '#9194a4',
        'scalesProperties.textColor': '#9194a4',
        volumePaneSize: 'medium',
        'paneProperties.rightMargin': 40,
        'paneProperties.topMargin': 12,
        // 'paneProperties.legendProperties.showLegend': false,
        // 'scalesProperties.fontSize': 12,
        'mainSeriesProperties.areaStyle.color1': '#99e4e9',
        'mainSeriesProperties.areaStyle.color2': '#fff',
        'mainSeriesProperties.areaStyle.linecolor': '#7ed1d6', //分时线
        // 'mainSeriesProperties.areaStyle.linestyle': 1,
        // 'mainSeriesProperties.areaStyle.linewidth': 1,
        // 'mainSeriesProperties.areaStyle.priceSource': 'close',
        // 'mainSeriesProperties.areaStyle.priceSource': 'close',
        // 'scalesProperties.lineColor': '#658697', //分割线
        // 'scalesProperties.textColor': '#658697', //坐标数字
        // 'mainSeriesProperties.candleStyle.upColor': '#44cb9c', //k线柱涨的颜色
        // 'mainSeriesProperties.candleStyle.downColor': '#f27762', //k线柱跌的颜色
        // 'mainSeriesProperties.candleStyle.wickUpColor': '#44cb9c', //k线颜色（涨） 上下线
        // 'mainSeriesProperties.candleStyle.wickDownColor': '#f27762', //k线颜色（跌） 上下线
        // 'mainSeriesProperties.candleStyle.borderUpColor': '#44cb9c', //蜡烛块的边框颜色（涨）
        // 'mainSeriesProperties.candleStyle.borderDownColor': '#f27762', //蜡烛块的边框颜色（跌）
      },
      studies_overrides: {
        'volume.volume.color.0': '#f27762',
        'volume.volume.color.1': '#44cb9c',
        'volume.show ma': false,
        // 'volume.inputs'
      },
      // debug: true
    };
    const that = this;
    // windowTradingView.onready(() => {
    const widget = new windowTradingView.widget(widgetOptions);
    widget.onChartReady(() => {
      timrList.forEach(function(v, idx) {
        const { resolution, label } = v;
        var button = widget.createButton();
        button.attr('title', label);
        button.addClass('resolution-btn');
        button.append(label);
        if (resolution === that.props.interval) {
          button.addClass('active-button');
        }
        button.on('click', function(a) {
          widget.chart().removeAllStudies();
          widget.chart().createStudy('Volume', false, false, [false, 20]);
          let curV = resolution;
          if (resolution === '1' && idx === 0) {
            //显示分时线
            widget.chart().setChartType(3);
          } else if (widget.chart().chartType() !== 1) {
            widget.chart().setChartType(1);
          }
          if (resolution !== '1' || idx === 1) {
            widget
              .chart()
              .createStudy('Moving Average', false, false, [5, 'close'], null, {
                'plot.color': '#965fc4',
              });
            widget
              .chart()
              .createStudy(
                'Moving Average',
                false,
                false,
                [10, 'close'],
                null,
                {
                  'plot.color': '#84aad5',
                }
              );
            widget
              .chart()
              .createStudy(
                'Moving Average',
                false,
                false,
                [30, 'close'],
                null,
                {
                  'plot.color': '#55b263',
                }
              );
            widget
              .chart()
              .createStudy(
                'Moving Average',
                false,
                false,
                [60, 'close'],
                null,
                {
                  'plot.color': '#b7248a',
                }
              );
          }
          const activeBtns = a.target.parentNode.parentNode.getElementsByClassName(
            'active-button'
          );
          for (var i = 0, l = activeBtns.length; i < l; i++) {
            activeBtns[i].classList.remove('active-button');
          }
          a.target.classList.add('active-button');
          widget.chart().setResolution(curV);
        });
      });
      const klineMap = {
        key: 'klineMap',
        label: formatMessage({ id: 'tradingView.klineMap' }),
      };
      const deepMap = {
        key: 'deepMap',
        label: formatMessage({ id: 'tradingView.deepMap' }),
      };
      [deepMap, klineMap].forEach(function(v, idx) {
        const { key, label } = v;
        const tabIdx = idx;
        var button = widget.createButton({ align: 'right' });
        button.attr('title', key);
        button.addClass('tab-btn');
        button.append(label);
        if (key === 'klineMap') {
          button.addClass('tab-active');
        }
        button.on('click', function(a) {
          const tabButtons = a.target.parentNode.parentNode.getElementsByClassName(
            'tab-active'
          );
          for (var i = 0, l = tabButtons.length; i < l; i++) {
            tabButtons[i].classList.remove('tab-active');
          }
          a.target.classList.add('tab-active');
          that.props.setTabIdx(tabIdx);
          if (tabIdx === 0) {
            const rBtns = a.target.parentNode.parentNode.parentNode.getElementsByClassName(
              'left'
            );
            for (var i = 0, l = rBtns.length; i < l; i++) {
              rBtns[i].classList.add('hide-it');
            }
          } else {
            const rBtns = a.target.parentNode.parentNode.parentNode.getElementsByClassName(
              'left'
            );
            for (var i = 0, l = rBtns.length; i < l; i++) {
              rBtns[i].classList.remove('hide-it');
            }
          }
        });
      });
      widget
        .chart()
        .createStudy('Moving Average', false, false, [5, 'close'], null, {
          'plot.color': '#965fc4',
        });
      widget
        .chart()
        .createStudy('Moving Average', false, false, [10, 'close'], null, {
          'plot.color': '#84aad5',
        });
      widget
        .chart()
        .createStudy('Moving Average', false, false, [30, 'close'], null, {
          'plot.color': '#55b263',
        });
      widget
        .chart()
        .createStudy('Moving Average', false, false, [60, 'close'], null, {
          'plot.color': '#b7248a',
        });
    });
    // });
  };
  getLanguageFromURL = () => {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null
      ? null
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  render() {
    // const { history, match, baseRoute, prefix, symbol } = this.props;
    const { className, MINEING } = this.props;
    let klinestyle = {};
    if (MINEING) {
      klinestyle = {
        width: '0',
        height: '0',
        overflow: 'hidden',
      };
    }
    return (
      <div
        style={klinestyle}
        id="tv_chart_container"
        className={'TVChartContainer ' + className}
      />
    );
  }
}

TradingKline.PropTypes = {};
export default injectIntl(TradingKline);
