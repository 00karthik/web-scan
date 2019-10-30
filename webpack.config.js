const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    popup: './popup/popup.js',
    'content-script': './content-scripts/inject.js',
    detect: './content-scripts/detect.js',
    background: './background-scripts/background.js',
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './popup/popup.html',
      filename: 'popup.html',
      inject: false,
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'icons', to: 'icons' },
      { from: './popup/popup.css', to: 'popup.css' },
    ]),
  ],
};
