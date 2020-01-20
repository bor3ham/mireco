const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CircularDependencyPlugin = require('circular-dependency-plugin')

const devCfg = require('./webpack.dev.js');

module.exports = {
  ...devCfg,
  mode: 'production',
  plugins: [
    ...devCfg.plugins,
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(__dirname, 'report.html'),
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  ],
};
