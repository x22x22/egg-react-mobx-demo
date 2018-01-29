const assetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const paths = require('./paths');

module.exports = {
  context: paths.appSrc,
  devtool: 'cheap-module-source-map',
  entry: [
    'webpack-hot-middleware/client?path=http://127.0.0.1:8080/__webpack_hmr&reload=true',
    './index',
  ],
  output: {
    filename: 'bundle.js',
    path: paths.appBuild + '/',
    // publicPath mube be consistent to path
    // because of a bug in egg-webpack of parsing the path
    publicPath: '/app/public/',
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.css' ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: paths.appSrc,
        options: { cacheDirectory: true },
      },
      {
        test: /\.css$/,
        loader: extractTextPlugin.extract({
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9',
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        }),
        include: paths.appSrc,
      },
    ],
  },
  plugins: [
    new assetsPlugin({ filename: 'assets.json', path: paths.appBuild }),
    new extractTextPlugin({ filename: 'bundle.css' }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('development') },
    }),
    new CaseSensitivePathsPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
};
