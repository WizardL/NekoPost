import path from 'path'
import webpack from 'webpack'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'
import memfs from 'memory-fs'

const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

module.exports = function setupDevServer(app, onUpdate) {
  // setup on the fly compilation + hot-reload
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  app.use(devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stat: {
      colors: true,
      chunks: false
    }
  }))
  app.use(hotMiddleware(clientCompiler))

  // watch and update server renderer on the fly
  const serverCompiler = webpack(serverConfig)
  const mfs = new memfs()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(warn => console.warn(warn))
    onUpdate(mfs.readFileSync(outputPath, 'utf-8'))
  })
}
