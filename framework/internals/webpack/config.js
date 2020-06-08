const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));
const { config: pkgConfig, version } = pkg;
const {
  framework: fwPath,
  appName,
  appDir,
  appLoadable,
  cards,
  indexDevHtml,
} = pkgConfig;

let { theme = {} } = pkgConfig;

const isCard = process.env.CARD === 'true';
const isContainer = !isCard;
const bundle = path.join(
  process.cwd(),
  isCard ? 'src/main' : 'framework/src/app'
);

if (typeof theme === 'string') {
  let cfgPath = theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = path.resolve(process.cwd(), cfgPath);
  }
  const getThemeConfig = require(cfgPath); // eslint-disable-line global-require
  theme = getThemeConfig();
}

const defaults = {
  version,
  root: path.join(process.cwd(), 'src', 'root'),
  static: path.join(process.cwd(), 'src', 'web-static'),
  indexHtml: path.join(fwPath, 'src', 'index.html'),
  indexDevHtml: indexDevHtml || path.join(fwPath, 'src', 'index.html'),
  bundle,
  isCard,
  isContainer,
  fwPath,
  appName,
  appDir,
  appLoadable,
  cards,
  common: [
    { resolve: 'react', name: 'React' },
    { resolve: 'react-dom', name: 'ReactDom' },
  ],
  theme,
};
module.exports = defaults;
