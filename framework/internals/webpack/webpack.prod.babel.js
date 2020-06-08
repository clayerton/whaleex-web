// Important modules this config uses
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const appConfig = require('./config');

const config = {
  // In production, we skip all hot-reloading stuff
  entry: (appConfig.isCard
    ? []
    : [
        'babel-polyfill',
        'element-closest', // textEditor 富文本编辑需支持closest属性
        'whatwg-fetch',
      ]
  ).concat([
    `${appConfig.bundle}.js`, // Start with js/app.js
  ]),

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: `[name]${appConfig.isCard ? '' : '.[chunkhash]'}.js`,
    chunkFilename: `[name]${appConfig.isCard ? '' : '.[chunkhash].chunk'}.js`,
    publicPath: 'https://cdn.whaleex.com.cn/',
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      minChunks: 2,
      async: true,
    }),
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
};
if (appConfig.isContainer) {
  config.plugins = config.plugins.concat([
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: appConfig.indexHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    // new OfflinePlugin({
    //   relativePaths: false,
    //   publicPath: '/',
    //
    //   // No need to cache .htaccess. See http://mxs.is/googmp,
    //   // this is applied before any match in `caches` section
    //   excludes: ['.htaccess'],
    //
    //   caches: {
    //     main: [':rest:'],
    //
    //     // All chunks marked as `additional`, loaded after main section
    //     // and do not prevent SW to install. Change to `optional` if
    //     // do not want them to be preloaded at all (cached only when first loaded)
    //     additional: ['*.chunk.js'],
    //   },
    //
    //   // Removes warning for about `additional` section usage
    //   safeToUseOptionalCaches: true,
    //
    //   AppCache: false,
    // }),
  ]);
}
if (appConfig.isCard) {
  config.externals = appConfig.common.reduce(
    (re, c) => ({
      ...re,
      [c.resolve]: {
        root: c.name,
        commonjs2: c.resolve,
        commonjs: c.resolve,
        amd: c.resolve,
      },
    }),
    {}
  );
}
module.exports = require('./webpack.base.babel')(config);
