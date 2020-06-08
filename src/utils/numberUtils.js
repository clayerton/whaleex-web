/** Copyright © 2013-2017 DataYes, All Rights Reserved. */



export function isNumber(value) {
  if (!(`${value}`).length || (`${value}`) === 'null') return false;
  let nValue = Number(value);
  if (_.isNaN(nValue) || !_.isFinite(nValue)) {
    return false;
  }
  return true;
}


export function getUnit(res) {
  if (!res || !res.length) {
    return {
      num: 1,
      label: ''
    };
  }
  let maxNum = _.maxBy(res, d => (isNumber(d) ? d : 0));
  if (maxNum > 1000000000000) {
    return {
      num: 100000000000,
      label: '万亿'
    };
  }
  if (maxNum > 100000000) {
    return {
      num: 10000000,
      label: '亿'
    };
  }
  if (maxNum > 10000) {
    return {
      num: 10000,
      label: '万'
    };
  }
  return {
    num: 1,
    label: ''
  };
}
