const fs = require('fs')
const { sassPlugin } = require('esbuild-sass-plugin')

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

exports.config = {
  plugins: [
    sassPlugin(),
    metafilePlugin,
  ],
  entryPoints: [
    './src/demo.tsx',
    './src/demo.sass',
  ],
  outdir: 'dist',
  metafile: true,
  bundle: true,
  format: 'iife',
}
