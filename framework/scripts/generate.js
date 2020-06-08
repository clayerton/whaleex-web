const fs = require('fs');
const path = require('path');
const { copy, touch } = require('./fs');
const { merge, sortByKey } = require('./tools');

// prepare root, pkg, basePath, appPkg,
const root = process.cwd();
const appPkgPath = path.join(root, 'package.app.json');
const pkgPath = path.join(root, 'package.json');
const pkgDefault = require('../package.json');
const basePath = path.resolve(__dirname, '../');
let appPkg = {};
let pkgBuffer = '';
let pkg = Object.assign({}, pkgDefault);
// Merge package.app.json && package.json
const dependecyKeys = ['dependencies', 'devDependencies'];
if (fs.existsSync(appPkgPath)) {
  appPkg = JSON.parse(fs.readFileSync(appPkgPath));
}
if (fs.existsSync(pkgPath)) {
  // 如果本地package.json存在, 使用本地的dependencies
  const pkgNow = JSON.parse(fs.readFileSync(pkgPath));
  dependecyKeys.forEach((k) => (appPkg[k] = pkgNow[k]));
}
pkg = merge(pkg, appPkg);
dependecyKeys.forEach((k) => (pkg[k] = sortByKey(pkg[k])));
// Copy files to app dir
const copyList = ['.gitignore', 'src/root'];
copyList.forEach((f) => {
  copy(path.join(basePath, f), path.join(root, f), (err) => {
    if (err) throw err;
  });
});
console.log('Copy finish');

// generate package.json
pkgBuffer = JSON.stringify(pkg, null, 2);
pkgBuffer = pkgBuffer.replace(
  /\$npm_package_config_framework/g,
  pkg.config.framework
);
fs.writeFile(pkgPath, pkgBuffer, 'utf-8', (err) => {
  if (err) throw err;
  console.log('Generate package.json finish');
});

// generate pom.xml
// eslint-disable-next-line no-shadow
const generatePomXml = (root, appPkg) => {
  console.log('Generate pom.xml start');
  const pomXml = path.join(root, 'pom.xml');
  const { name, version, group, config: { framework } } = appPkg;
  const pomOrigin = path.join(framework, 'pom.xml');
  const newPomStr = fs
    .readFileSync(pomOrigin, 'utf8')
    // version
    .replace(
      /<version>[^-]+-\${BUILD_NUMBER}<\/version>/,
      `<version>${version}-\${BUILD_NUMBER}</version>`
    )
    // name
    .replace(/<name>[^<]+<\/name>/, `<name>${name}</name>`)
    // artifactId use name
    .replace(
      /<artifactId>[^<]+<\/artifactId>/,
      `<artifactId>${name}</artifactId>`
    )
    // docker
    .replace(
      /<framework.dir>[^<]+<\/framework.dir>/,
      `<framework.dir>${framework}</framework.dir>`
    )
    // groupId use group
    .replace(/<groupId>[^<]+<\/groupId>/, `<groupId>${group}</groupId>`);
  fs.writeFile(pomXml, newPomStr, 'utf-8', (err) => {
    if (err) throw err;
    console.log('Generate pom.xml finish');
  });
};
generatePomXml(root, appPkg);

// docker/deploy dir is required by pom.xml
touch(path.join(root, ...'docker/deploy/placeholder'.split('/')));
