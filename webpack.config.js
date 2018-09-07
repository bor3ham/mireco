var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './demo.js',
  output: {
    path: __dirname + '/dist',
    filename: 'demo.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                'env',
                'react',
                'stage-0',
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
  },
};
