const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
  ],
};
