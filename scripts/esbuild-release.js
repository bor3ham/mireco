const fs = require('fs')
const { build } = require('esbuild')

const { config } = require('./esbuild-base.js')

build({
  ...config,
  watch: false,
  minify: true,
  sourcemap: false,
}).then(result => {
  fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile))
})
