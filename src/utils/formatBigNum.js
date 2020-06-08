/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import { isNumber } from './numberUtils';

export default function (data, str) {
  if (isNumber(data)) {
    data = Math.round(Number(data));
  } else {
    return str === '' ? '' : '--';
  }
  let n = data.toString().length;
  if (n >= 9) {
    data = Math.round(data / 100000000 * 100) / 100;
    data += '亿';
  } else {
    data = Math.round(data / 10000 * 100) / 100;
    data += '万';
  }

  return data;
}
