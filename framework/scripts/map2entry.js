const path = require('path');
const fs = require('fs-extra');

// const mappingPath = path.join(process.cwd(), 'src/config/mapping.js');
const mappingPath = path.join(process.cwd(), 'src/cards/config.js');
const entryDir = path.join(process.cwd(), 'src/entry');
fs.removeSync(entryDir);
fs.mkdirsSync(entryDir);

const reg = /import\s+(.*)\s+from\s+'(.*)';/g;
const mapStr = fs.readFileSync(mappingPath, 'utf8');
let rs = reg.exec(mapStr);

while (rs) {
  const filename = rs[1];
  const configPath = rs[2];

  if (filename.indexOf('cardMappingFromDyc') === -1) {
    // configPath = configPath.replace('./', '../cards/');
    createEntry(filename, configPath);
    modifyConfigFile(configPath);
  }

  rs = reg.exec(mapStr);
}

// Create card entry file
function createEntry(filename, configPath) {
  const exist = /const name = '([^']+)'/.exec(fs.readFileSync(`src/cards/${configPath}.js`));
  filename = exist[1];
  configPath = configPath.replace('./', '../cards/');
  const content = `export { default } from '${configPath}';`;
  fs.writeFileSync(path.join(entryDir, `${filename}.js`), content, 'utf8');
}

function modifyConfigFile(configPath) {
  configPath = configPath.replace('./', 'rrp/cards/');
  const p = path.join(process.cwd(), `${console.log(configPath) || configPath.replace('rrp', 'src/')}.js`);
  let str = fs.readFileSync(p, 'utf8');

  str = str.replace(
    "import doImportDelegate from 'utils/imports';",
    "import * as imports from './imports';"
  );
  str = str.replace(
    /const doImport[^;]*\);/,
`const importConfig = {
  imports,
  componentName,
  componentType,
};`
  );
  str = str.replace('doImport', 'importConfig');
  fs.writeFileSync(p, str, 'utf8');
}
