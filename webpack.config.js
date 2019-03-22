const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mireco.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new PeerDepsExternalsPlugin()
  ],
  resolve: {
    modules: [
      path.resolve('node_modules'),
      path.resolve('src'),
    ],
  }
};
