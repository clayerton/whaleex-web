module.exports = (() => {
  const base = process.env.BASE_ROUTE;
  const wrap = (path) =>
    base + (path.charAt(0) === '/' ? path.substring(1) : path);
  return {
    base,
    wrap,
  };
})();
