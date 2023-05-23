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
    './src/demo.ts',
    './src/demo.styl',
  ],
  outdir: 'dist',
  metafile: true,
  bundle: true,
  format: 'iife',
}
