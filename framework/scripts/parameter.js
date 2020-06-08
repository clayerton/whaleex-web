const getParameter = () =>
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => arg.substring(2).split('='))
    .reduce((re, [name, value]) => ({ ...re, [name]: value }), {});
module.exports = { getParameter };
