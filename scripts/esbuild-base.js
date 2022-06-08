const { stylusLoader } = require('esbuild-stylus-loader')

const pkg = require('../package.json')

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

exports.config = {
  plugins: [
    stylusLoader(),
  ],
  entryPoints: [
    './src/prop-types',
    './src/components',
    './src/inputs',
    './src/constants.js',
    './src/mireco-layout.styl',
    './src/mireco-theme.styl',
  ],
  outdir: '.',
  metafile: true,
  bundle: true,
  format: 'esm',
  target: ['esnext'],
  external,
}
