/**
 * Merge multiple objects.
 * Replace attribute directly if attribute is not object(exclude array)
 * @param {*} sources
 * @returns Object
 */
function merge(...sources) {
  return sources.reduce((src1, src2) => {
    const rs = Object.assign({}, src1);
    const keys = Object.keys(src2);

    keys.forEach((k) => {
      const v = src2[k];

      if (typeof v === 'object' && !Array.isArray(v) && rs[k]) {
        rs[k] = merge(rs[k], src2[k]);
      } else {
        rs[k] = v;
      }
    });

    return rs;
  }, {});
}
const sortByKey = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((re, k) => Object.assign(re, { [k]: obj[k] }), {});

module.exports = {
  merge,
  sortByKey,
};
