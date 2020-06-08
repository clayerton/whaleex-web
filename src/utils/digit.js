/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import React from 'react';
import {
    isNumber
} from './numberUtils';


/*
 * 数值格式化
 *
 * @param   value           Number/String
 * @param   formatString    String
 *
 * formatString 格式:
 * `0` - 不保留小数
 * `0.0` - 保留1位小数
 * `0.00` - 保留2位小数
 * `0,000` - 千分位，不保留小数
 * `0,000.000` - 千分位，保留3位小数
 * `0,0.000` - 千分位的简写形式，保留3位小数
 * `0.###` - 最多保留3位小数，小数末尾不补0
 * `0.0%` - 使用百分比，保留1位小数
 * `^0.00` - 使用涨跌箭头，保留2位小数
 * `~0.00` - 根据数值自动标记红绿，保留2位小数
 * `+0.00` - 强制标红，保留2位小数
 * `-0.00` - 强制标绿，保留2位小数
 *
 */

function format(value, formatString, compare) {
    // 验证格式化字符串
  let re = /^(\^)?[~+-]?0(,(0|0{3}))?(\.(0+|#+))?%?$/;
  if (!re.test(formatString)) {
    console.error(`Invalid format string: ${formatString}`);
    return false;
  }
  if (!isNumber(value)) {
    return '';
  }

    // 将参数 value 转换为数值型
  if (typeof value !== 'number') {
    value = Number(value);
    if (isNaN(value)) {
      console.error('format(): 1st parameter should be a number(or string of number)!');
      return false;
    }
  }

  let output;

    // 处理百分比格式，数值乘以100
  let suffix = '';
  if (formatString[formatString.length - 1] === '%') {
    value *= 100;
    suffix = '%';
    formatString = formatString.substr(0, formatString.length - 1);
  }

    // 处理小数精确度
  let precision = formatString.length - formatString.indexOf('.') - 1;
  if (precision !== formatString.length) {
    output = value.toFixed10(precision);
    if (formatString.indexOf('#') !== -1) {
            // 小数位数不足精确位数，不补0
      if (value.toString().length < output.length) {
        output = value.toString();
      }
    }
  } else {
    output = value.toFixed10(0);
  }

    // 添加千分位
  let valueParts;
  if (formatString.indexOf(',') !== -1) {
    valueParts = output.split('.');
    valueParts[0] = valueParts[0].replace(/(\d{1,3})(?=(\d{3})+(?:$|\D))/g, '$1,');
    output = valueParts.join('.');
  }

    // 添加后缀(百分比符号%)
  output += suffix;

    // 添加涨跌样式
  let cls = '';
  let prefix = formatString.split('0')[0];

  if (compare) {
    prefix = 'cp';
  }
  switch (prefix) {
    case '~':
      cls = value < 0 ? 'state-fall' : 'state-rise';
      break;
    case '+':
      cls = 'state-rise';
      break;
    case '-':
      cls = 'state-fall';
      break;
    case '^':
      if (value < 0) {
        cls = 'icon-fall';
                // 使用涨跌箭头时去掉负号
                // output = output.replace(/^-/, '');
      } else {
        cls = 'icon-rise';
      }
      break;
    case '^~':
      if (value < 0) {
        cls = 'icon-fall state-fall';
                // output = output.replace(/^-/, '');
      } else {
        cls = 'icon-rise state-rise';
      }
      break;
    case '^+':
      cls = 'icon-rise state-rise';
      break;
    case '^-':
      cls = 'icon-fall state-fall';
      break;
    case 'cp':
      if (value < compare) {
        cls = 'state-fall';
      } else if (value > compare) {
        cls = 'state-rise';
      } else {
        cls = '';
      }
      break;
    default:
  }
  if (cls.length) {
    output = <span className={`${cls}`}>{output}</span>;
  }

  return output;
}

/*
 * Currying function, 复用 formatter
 *
 * eg:
 *      var myFormatter = formatter('0.00');
 *      var a = myFormatter(123.456);
 *      var b = myFormatter(10.0123);
 *
 */
function formatter(formatString, compare) {
  return function (value) {
    return format(value, formatString, compare);
  };
}

export default {
  format,
  formatter,
};
