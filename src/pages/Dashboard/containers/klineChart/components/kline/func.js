function splitData(rawData) {
  var categoryData = [];
  var values = [];
  var volumes = [];
  var close = [];
  var closeLast = [];
  const lastClose = rawData[rawData.length - 1][2];
  for (var i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
    volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    close.push(rawData[i][1]);
    closeLast.push(lastClose);
  }

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
    close,
    closeLast,
  };
}

function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}
export default { splitData, calculateMA };
