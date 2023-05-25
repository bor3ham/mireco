const fs = require('fs')
const { build } = require('esbuild')

const { config } = require('./esbuild-base.js')

build({
  ...config,
  minify: true,
  sourcemap: true,
}).then(result => {
  fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile))
})
