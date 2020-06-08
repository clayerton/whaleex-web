const fs = require('fs');
const path = require('path');

const { getParameter } = require('./parameter');
const { merge } = require('./tools');
const root = process.cwd();
const appPkgPath = path.join(root, 'package.app.json');
let appPkg = {};
if (fs.existsSync(appPkgPath)) {
  console.log('warn');
  appPkg = require(appPkgPath);
} else {
  appPkg = { config: { framework: 'framework' } };
}
const params = getParameter();
appPkg = merge(appPkg, params);
const content = JSON.stringify(appPkg, null, 2);
fs.writeFileSync(appPkgPath, content, 'utf8');
setTimeout(() => require('./generate'));
