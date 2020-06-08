/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HashedChunkidsPlugin = require('webpack-hashed-chunkids');
const appConfig = require('./config');
const themeVar = require('./themeVariable');
// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

const themeOptions = {
  stylesDir: path.join(__dirname, '../../../src'),
  antDir: path.join(__dirname, '../../../node_modules/antd'),
  varFile: path.join(__dirname, '../../../src/style/theme/variables.less'),
  mainLessFile: path.join(__dirname, '../../../src/style/theme/index.less'),
  themeVariables: themeVar,
  indexFileName: 'index.html',
};

const themePlugin = new AntDesignThemePlugin(themeOptions);
const getRootPath = p => path.join(process.cwd(), p);

module.exports = options => ({
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(
        process.cwd(),
        appConfig.isCard ? 'build/cards' : 'build'
      ),
      publicPath: appConfig.isCard
        ? `/${appConfig.appName}/${appConfig.version}/`
        : '',
      libraryTarget: appConfig.isCard ? 'umd' : 'var',
    },
    options.output
  ), // Merge with env dependent settings
  module: {
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        include: path.resolve('node_modules/antd'),
        use: [
          'style-loader',
          'css-loader',
          {
            loader: require.resolve('less-loader'),
            options: {
              modifyVars: appConfig.theme,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[local]__[hash:base64:5]',
            },
          },
          'less-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2|mp3|ogg|wav)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ].concat(
      appConfig.isContainer
        ? appConfig.common.map(c => ({
            test: require.resolve(c.resolve),
            use: {
              loader: 'expose-loader',
              options: c.name,
            },
          }))
        : []
    ),
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      {
        from: appConfig.root, // copy root files
        to: '.',
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: appConfig.static, // copy static files
        to: 'web-static',
      },
    ]),
    new HashedChunkidsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
    // themePlugin,
  ]),
  resolve: {
    alias: {
      moment$: 'moment/moment.js',
      [appConfig.appName]: getRootPath(appConfig.appDir),
      appLoadable: getRootPath(appConfig.appLoadable),
      dyc: getRootPath(`${appConfig.fwPath}/src`),
    },
    modules: ['src', `${appConfig.fwPath}/src`, 'node_modules'],
    extensions: (options.isDev ? ['.dev.js'] : [])
      .concat(['.js', '.jsx', '.react.js'])
      .reduce(
        (re, item) =>
          re
            .concat(appConfig.appName ? [`.${appConfig.appName}${item}`] : [])
            .concat([item]),
        []
      ),
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  externals: options.externals || {},
});
