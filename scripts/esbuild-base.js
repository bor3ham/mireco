const path = require('path')
const pkg = require(path.resolve('./package.json'))
const { stylusLoader } = require('esbuild-stylus-loader')

exports.config = {
  plugins: [
    stylusLoader({
      stylusOptions: {
        includeCss: true,
      },
    }),
  ],
  entryPoints: [
    './demo.ts',
    './demo.styl',
  ],
  outdir: 'dist',
  metafile: true,
  bundle: true,
  format: 'iife',
}
