const fs = require('fs')
const { stylusLoader } = require('esbuild-stylus-loader')
const { exec } = require('child_process')
const path = require('node:path')

const pkg = require('../package.json')

const metafilePlugin = {
  name: 'metafilePlugin',
  setup: (build) => {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile))
      }
    })
  },
}

const tscPath = path.resolve('./node_modules/.bin/tsc')
const typescriptPlugin = {
  name: 'typescriptPlugin',
  setup: (build) => {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        exec(tscPath, (err, stdout, stderr) => {
          console.log(stdout)
          console.log(stderr)
          if (err) {
            console.error(err)
          }
        })
      }
    })
  },
}

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
]

exports.config = {
  plugins: [
    stylusLoader(),
    metafilePlugin,
    typescriptPlugin,
  ],
  bundle: true,
  minify: true,
  sourcemap: true,
  metafile: true,
  format: 'esm',
  target: ['esnext'],
  entryPoints: [
    { out: 'index', in: './src/index.ts' },
    { out: 'layout', in: './src/layout.styl' },
    { out: 'theme', in: './src/theme.styl' },
  ],
  outdir: 'dist',
  external,
}
