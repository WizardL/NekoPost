import path from 'path'
import webpack from 'webpack'
import memfs from 'memory-fs'

import { clientConfig } from './webpack.client.config'
import { serverConfig } from './webpack.server.config'

export function setupDevServer(app, onUpdate) {
  // setup on the fly compilation + hot-reload
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  app.use(require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stat: {
      colors: true,
      chunks: false
    }
  }))
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // watch and update server renderer on the fly
  const serverCompiler = webpack(serverConfig)
  const mfs = new memfs()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.error.map(err => console.error(err))
    stats.warnings.map(warn => console.warn(warn))
    onUpdate(mfs.readFileSync(outputPath, 'utf-8'))
  })
}
