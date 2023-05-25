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
    { out: 'index', in: './src/index.ts' },
    { out: 'layout', in: './src/layout.styl' },
    { out: 'theme', in: './src/theme.styl' },
  ],
  outdir: 'dist',
  metafile: true,
  bundle: true,
  format: 'esm',
  target: ['esnext'],
  external,
}
