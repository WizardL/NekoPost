const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const pkg = require('./package.json')
const favicon = path.resolve(__dirname, './frontend/assets/logo.png')

module.exports = {
  entry: './frontend/main.js',

  // will then output to `/dist` directory.
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: (process.env.NODE_ENV === 'production')
            ? 'build.[chunkhash:5].js'
            : 'build.js'
  },
  resolve: {
    alias: { 'vue$': 'vue/dist/vue.common.js' }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            require('autoprefixer')({
              browsers: ['last 3 versions']
            })
          ],
          loaders: {
            scss: 'style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[chunkhash:5]'
          }
        }
      }
    ],

    // exclude
    noParse: [
      /\.min\.js$/,
      /es6-promise\.js$/
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'frontend', 'template.html'),
      filename: 'index.html',
      favicon: favicon,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin({
      filename: (process.env.NODE_ENV === 'production')
              ? 'build.[chunkhash:5].css'
              : 'build.css',
      disable: false,
      allChunks: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    contentBase: 'dist/',
    host: '0.0.0.0'
  },
  devtool: (process.env.NODE_ENV === 'production') ? false : '#eval-source-map'
}

// Production configuration
if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    // add env info
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // minifying css
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // minifying JSON
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // extract vendor chunks for better caching
    // https://github.com/zypeh/memetwork
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // service worker precache
    new SWPrecachePlugin({
      cacheId: 'NekoPost',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  ])
}
