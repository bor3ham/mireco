const path = require('path')
const pkg = require(path.resolve('./package.json'))
const { stylusLoader } = require('esbuild-stylus-loader')

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

exports.config = {
  plugins: [
    stylusLoader(),
  ],
  entryPoints: [
    './src/utilities/constants.js',
    './src/utilities/prop-types',
    './src/components',
    './src/inputs',
    './src/mireco-layout.styl',
    './src/mireco-theme.styl',
  ],
  outdir: '.',
  metafile: true,
  bundle: true,
  format: 'esm',
  external,
}
