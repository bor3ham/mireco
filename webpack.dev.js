const path = require('path');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve('src', 'index.js'),
    constants: path.resolve('src/utilities', 'constants.js'),
    'prop-types': path.resolve('src/utilities/prop-types', 'index.js'),
    components: path.resolve('src/components', 'index.js')
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'mireco',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new PeerDepsExternalsPlugin(),
  ],
  resolve: {
    modules: [
      path.resolve('node_modules'),
      path.resolve('src'),
    ],
  },
};
