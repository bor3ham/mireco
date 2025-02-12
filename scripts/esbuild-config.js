const fs = require('fs')
const { exec } = require('child_process')
const path = require('node:path')
const { sassPlugin } = require('esbuild-sass-plugin')
const svgPlugin = require('esbuild-svg')

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
    sassPlugin(),
    svgPlugin(),
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
    { out: 'layout', in: './src/layout.sass' },
    { out: 'theme', in: './src/theme.sass' },
  ],
  outdir: 'dist',
  external,
}
