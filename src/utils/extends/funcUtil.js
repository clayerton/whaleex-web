math.config({
  number: 'BigNumber',
  precision: 20,
});
import Cookies from 'js-cookie';
function getTime(date, force) {
  if (!date) {
    return '--';
  }
  if (force) {
    return moment(date).format('YYYY/MM/DD HH:mm');
  }
  var timeFormat1 = 'MM/DD HH:mm'; //今年
  var timeFormat2 = 'HH:mm:ss'; //今日
  var timeFormat3 = 'YYYY/MM/DD HH:mm'; //其它
  let now = Date.now();
  let curYear = moment(now).year();
  let curMonth = moment(now).month() + 1;
  let curDay = moment(now).date();
  let preYear = moment(date).year();
  let preMonth = moment(date).month() + 1;
  let preDay = moment(date).date();
  let returnTime = moment(date).format(timeFormat3);
  if (curYear === preYear) {
    returnTime = moment(date).format(timeFormat1);
  }
  if (curYear === preYear && curMonth === preMonth && curDay === preDay) {
    returnTime = moment(date).format(timeFormat2);
  }
  // if (
  //   curYear === preYear &&
  //   curMonth === preMonth &&
  //   curDay === preDay &&
  //   now - date < 24 * 60 * 60 * 1000
  // ) {
  //   returnTime = moment(date).fromNow();
  // }
  return returnTime;
}
function getLastSelectSymbol() {
  let lastSelectSymbol = Cookies.get(`lastSelectSymbol`) || 'WAL_EOS';
  const symbolArr = lastSelectSymbol.split('_');
  return symbolArr.join('_');
}
function noJumpPage() {
  //在未登录时不会跳转的页面
  const pages = [
    'login',
    'register',
    'forgetPwd',
    'homePage',
    'download-web',
    'trade',
    'notFound',
    'maintenance',
    'eosworld',
    'minePage',
    'market',
    '',
  ];
  const curPage = _.get(window.location, 'pathname', '/')
    .split('/')
    .pop();
  const pathname = _.get(window.location, 'pathname', '/');
  return pages.includes(curPage) || pathname.includes('/trade');
}
function convertTime(time, formatMessage) {
  let unit = 'sec';
  let _time = time;
  if (_time > 60) {
    unit = '1min';
    _time = _time / 60;
  } else {
    return [formatMessage({ id: 'tradingView.sec' }, { data: _time })];
  }
  if (_time > 60) {
    unit = '1hour';
    _time = _time / 60;
  } else {
    return [formatMessage({ id: 'tradingView.xmin' }, { data: _time })];
  }
  return [formatMessage({ id: 'tradingView.1hour' }, { data: _time })];
}
function getPercentFormat(num) {
  if (num === '--') {
    return num;
  }
  return (num && `${(num * 100).toFixed(2)}%`) || '--';
}
function getPercentFormatWithPlus(num) {
  if (num > 0) {
    return '+' + getPercentFormat(num);
  } else {
    return getPercentFormat(num);
  }
}
function percentNumber(number, base = 10000) {
  let unit = '%';
  let _number = number / 100;
  if (_number > 900) {
    unit = '‰';
    _number = _number / 100;
  } else {
    return [_number, unit];
  }
  if (_number > 900) {
    unit = '/10000';
    _number = _number / 100;
  } else {
    return [_number, unit];
  }
  return [_number, unit];
}
function calc(mathStr) {
  // console.log(mathStr);
  return math.eval(mathStr.replace(/undefined/g, '0')) + '';
}
function isNotEmpty(obj, pathArr) {
  return pathArr.every(path => {
    return !_.isEmpty(_.get(obj, path));
  });
}
function getSearch(key) {
  const {
    location: { search = '' },
  } = window;
  const keyValue =
    search
      .slice(1)
      .split('&')
      .filter(i => i.includes(`${key}=`))[0] || '';
  const splits = keyValue.split('=');
  return splits[1] || '';
}
function isObjDiff(objArr, keysArr) {
  return keysArr.some(i => {
    const tmpArr = objArr.map(obj => {
      return _.get(obj, i);
    });
    if (!_.isEqual(tmpArr[0], tmpArr[1])) {
      //不同
      return true;
    }
    return false;
  });
}
function cutNumber(num, length) {
  let _num = +num;
  const pow = Math.pow(10, length);
  const tmp = Math.floor(_num * pow) / pow;
  return tmp.toFixed(length);
}
function formatInsertData(value, precision = 3) {
  //仿照逻辑 他人的在输入多个小数点时失效
  const number = `${scientificToNumber(value)}`.replace(/[^\d.]/g, '');
  const regExp2 = new RegExp(
    `[1-9]\\d*\\.\\d{0,${precision}}|0*\\.\\d{0,${precision}}|[1-9]\\d*|^0$`
  );
  const r = regExp2.exec(number);
  if (r) {
    return r[0];
  }
  return number;
}
function formatMathPow(a, b) {
  const tmp = math.pow(math.bignumber(a), math.bignumber(b)) + '';
  return scientificToNumber(tmp);
}
function formatTimeDuration(time, type, format = ['天', '小时', '分', '秒']) {
  let tmp = time;
  const day = Math.floor(tmp / (1000 * 60 * 60 * 24));
  tmp = tmp % (1000 * 60 * 60 * 24);
  const hours = Math.floor(tmp / (1000 * 60 * 60));
  tmp = tmp % (1000 * 60 * 60);
  const minutes = Math.floor(tmp / (1000 * 60));
  tmp = tmp % (1000 * 60);
  const seconds = Math.floor(tmp / 1000);
  if (type === 'arr') {
    return [day, hours, minutes, seconds];
  }
  const r = [day, hours, minutes, seconds].reduce((pre, cur, idx) => {
    if (cur === 0) {
      return pre;
    }
    pre.push(cur + format[idx]);
    return pre;
  }, []);
  return r.slice(0, 2).join('');
}
function diffTime(time1 = moment(), time2 = moment(), type) {
  return formatTimeDuration(moment(time2).diff(moment(time1)), type);
}
function throttle(delay, action, T = {}) {
  let last = T.timer || 0;
  return function() {
    const cur = +new Date();
    if (cur - last > delay) {
      action.apply(this, arguments);
      T.timer = cur;
    } else {
      T.actions = [
        () => {
          action.apply(this, arguments);
        },
      ];
      setTimeout(() => {
        if (+new Date() - T.timer >= 1000) {
          T.actions[0] && T.actions[0]();
        }
        T.actions = [];
      }, 1000);
    }
  };
}
function sortByArr(list, key, keyArr) {
  if (_.isEmpty(list)) {
    return [];
  }
  let preList = keyArr.map(i => {
    return _.find(list, [key, i]);
  });
  let afterList = list.filter(i => {
    const value = i[key];
    return !keyArr.includes(value);
  });
  return preList.concat(afterList);
}
/*
对象数组根据mergeByKeys来merge
 */
function mergeArray(arr, arr2, mergeByKeys) {
  return arr.map(i => {
    const findObj = _.find(arr2, [mergeByKeys[1], i[mergeByKeys[0]]]);
    if (findObj) {
      return Object.assign({}, i, findObj);
    }
    return i;
  });
}
/*
科学计数法变成小数字符串形式
 */
function scientificToNumber(num) {
  if (num === undefined) {
    return '';
  }
  var str = num.toString();
  var reg = /^(\d+)(e)([\-]?\d+)$/;
  var arr,
    len,
    zero = '';
  /*6e7或6e+7 都会自动转换数值*/
  if (!reg.test(str)) {
    return num;
  } else {
    /*6e-7 需要手动转换*/
    arr = reg.exec(str);
    len = Math.abs(arr[3]) - 1;
    for (var i = 0; i < len; i++) {
      zero += '0';
    }
    return '0.' + zero + arr[1];
  }
}
function symbolNumber(num = 0, precision = 2) {
  // let numStr = scientificToNumber(num || 0); //抵消掉undefined或者NaN
  // console.log(numStr, typeof numStr);
  if (num === 0 || num === '0') {
    return '0';
  }
  return (+num || 0).toFixed(precision);
}
function getPagination(obj, arr = ['page', 'size', 'total']) {
  const p = _.mapValues(
    _.mapKeys(_.pick(obj, arr), (v, k) => {
      const keysMap = {
        [arr[0]]: 'current',
        [arr[1]]: 'pageSize',
        [arr[2]]: 'total',
      };
      return keysMap[k];
    }),
    (v, k) => {
      if (k === 'current') {
        // ant table index 从1开始
        return v + 1;
      }
      return v;
    }
  );
  return p;
}
function infoMosaic(info) {
  if (!info) {
    return '';
  }
  //主要用于电话号码的隐藏 ****
  //该方法不支持中文， 中文需要新实现
  let l = 2;
  let lMosaic = '**';
  if (info.length > 9) {
    return `${info.slice(0, 3)}****${info.slice(-4)}`;
  } else if (info.length > 4) {
    l = 3;
    lMosaic = '***';
  }
  let _info = info.split('');
  _info.splice(1, l, lMosaic);
  return _info.join('');
}
function mergeFetcher(mergeConfig) {
  async function mergeRequest(
    requestList,
    { mergePath, curPage, pageSize, uniqKey }
  ) {
    //不能分页 是因为我无法知道总量 除非2个接口在一开始就都请求一遍
    //requestList 请求数组；[24h内，24h外]
    //mergePath merge的数组变量路径
    if (mergeConfig && curPage > mergeConfig.mergePage) {
      let { data: data_out24 } = await requestList[1]({
        page:
          curPage - mergeConfig.mergePage - 1 > 0
            ? curPage - mergeConfig.mergePage - 1
            : 0,
      });
      // console.log('data_out24', data_out24);
      return data_out24;
    }
    let curTime = +new Date();
    let { data } = await requestList[0]({});
    // console.log('data_in24', data);
    const totalElements = _.get(
      data,
      'totalElements',
      _.get(data, 'result.totalElements', 0)
    );
    mergeConfig.mergePage = parseInt(totalElements / pageSize);
    let arrayPick = _.get(data, mergePath, []);
    if (arrayPick.length < pageSize) {
      //小于pageSize则需要补足
      let { data: data2 } = await requestList[1]({});
      // console.log('data_merge24', data2);
      let arraySuffixPick = _.get(data2, mergePath, []);
      arrayPick = arrayPick.concat(arraySuffixPick);
      if (uniqKey) {
        arrayPick = _.uniqBy(arrayPick, uniqKey);
      }
      arrayPick = arrayPick.slice(0, pageSize);
    }
    _.set(data, 'page', curPage + 1);
    _.set(data, mergePath, arrayPick);
    return data;
  }
  return mergeRequest;
}

function getSysLan() {
  var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符
  return lang;
}
function getUserLan() {
  return sessionStorage.getItem('userLan') || getSysLan();
}
function convert2Time(timeStr, format = 'HH:mm') {
  let timeNum = Number(timeStr);
  if (!timeNum) {
    return timeStr;
  }
  return moment(timeNum).format(format);
}
function waitAsync(arr = []) {
  return Promise.all(
    arr.map(i => {
      return new Promise(reslove => {
        let loop = (count = 0) => {
          setTimeout(() => {
            if (window['asyncWait-' + i] || count > 10) {
              //console.log('get ' + i);
              reslove();
            } else {
              loop(++count);
            }
          }, 1000);
        };
        loop();
      });
    })
  );
}
function setAsync(arr, dataArr = []) {
  arr.forEach((i, idx) => {
    //console.log('set ' + i);
    window['asyncWait-' + i] = dataArr[idx] || true;
  });
}
function getAsync(arr) {
  return arr.map((i, idx) => {
    return window['asyncWait-' + i];
  });
}
function facebookCodeSend(country, phone, callback) {
  function loginCallback(response) {
    if (response.status === 'PARTIALLY_AUTHENTICATED') {
      var code = response.code;
      var csrf = response.state;
      callback && callback({ code, response });
      // Send code to server to exchange for access token
    } else if (response.status === 'NOT_AUTHENTICATED') {
      console.log(response);
      // handle authentication failure
    } else if (response.status === 'BAD_PARAMS') {
      console.log(response);
      // handle bad parameters
    }
  }
  try {
    AccountKit.init({
      appId: _config.faceBookAppId,
      state: 'uuid',
      version: 'v1.1',
      // debug: true,
      fbAppEventsEnabled: true,
    });
  } catch (e) {
    console.log(
      'facebook sms network error. or AccountKit.init has already been called.'
    );
  }
  AccountKit.login(
    'PHONE',
    { countryCode: '+' + (country.callingCode || '86'), phoneNumber: phone }, // will use default values if not specified
    loginCallback
  );
}
function convertFromReal(num) {
  if (!num) {
    return num;
  }
  let numArr = `${num}`.split('');
  let decimalIdx = numArr.indexOf('.');
  let numRst = numArr.reduce((pre, cur, idx) => {
    if (cur === '.') {
      return pre;
    }
    if (idx === decimalIdx + 2) {
      return [...pre, cur, '.'];
    }
    return [...pre, cur];
  }, []);
  let isZero = true;
  numRst = numRst.reduce((pre, cur, idx) => {
    if (cur !== '0') {
      isZero = false;
    }
    if (pre[pre.length - 1] === '0' && isZero) {
      return pre;
    }
    return [...pre, cur];
  }, []);
  return numRst.join('');
}
function convert2Real(num) {
  if (!num) {
    return num;
  }
  let numStr = `${num}`;
  let numArr = numStr.split('');
  let strLength = numStr.length;
  let decimalIdx = numArr.indexOf('.');
  let fixedLength = strLength - decimalIdx - 1;
  let tmp = +calc(`${numStr} / 100`);
  return tmp.toFixed(fixedLength + 2);
}

function formatLegalTender(num) {
  if (isNaN(+num)) {
    return '--';
  }
  let arr = `${num}`.split('');
  let pointIdx = _.indexOf(arr, '.');
  let value19Idx = _.findIndex(arr, function(o) {
    return o > 0;
  });
  let fixLength = 2;
  if (pointIdx > value19Idx) {
    fixLength = 2;
  } else {
    fixLength = value19Idx + 1;
  }
  return num.toFixed(fixLength);
}

export default {
  setAsync,
  getAsync,
  waitAsync,
  isObjDiff,
  isNotEmpty,
  diffTime,
  formatTimeDuration,
  formatInsertData,
  throttle,
  mergeArray,
  scientificToNumber,
  symbolNumber,
  getPagination,
  cutNumber,
  calc,
  formatMathPow,
  infoMosaic,
  getSearch,
  percentNumber,
  convertTime,
  mergeFetcher,
  getSysLan,
  convert2Time,
  noJumpPage,
  getUserLan,
  facebookCodeSend,
  getPercentFormat,
  getPercentFormatWithPlus,
  convertFromReal,
  convert2Real,
  getTime,
  formatLegalTender,
  getLastSelectSymbol,
  sortByArr,
};
