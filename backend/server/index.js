'use strict'

import fs from 'fs'
import path from 'path'
import lruCache from 'lru-cache'
import compose from 'koa-compose'
import convert from 'koa-convert'
import favicon from 'serve-favicon'
import serialize from 'serialize-javascript'

export default function server(app) {
  return compose([

    // favicon
    convert(favicon(resolve('../../frontend/assets/logo.png'))),

    // SSR
    SSR,

  ])

}

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

const resolve = (file) => path.resolve(__dirname, file)

const html = (() => {
  const template = fs.readFileSync(resolve('../../frontend/index.html'), 'utf-8')
  const i = template.indexOf('{{ APP }}')

  // Styles are indjected dynamically via vue-style-loader in development
  const style = (process.env.NODE_ENV == 'production') ? '<link rel="stylesheet" href="/dist/styles.css">' : ''

  return {
    head: template.slice(0, i).replace('{{ STYLE }}', style),
    tail: template.slice(i + '{{ APP }}'.length)
  }
})()

const createRenderer = (bundle) => {
  return createBundleRenderer(bundle, {
    cache: lruCache({ max: 1000, maxAge: 1000 * 60 * 15 })
  })
}

// Setup the server renderer
let renderer
if (process.env.NODE_ENV == 'production') {
  const bundlePath = resolve('../../dist/server-bundle.js')
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
  require('../../build/dev-server')(app, bundle => {
    renderer = createRenderer(bundle)
  })
}

async function SSR(ctx) {

  if (!renderer) {
    ctx.body = 'Loading....'
    return
  }

  const s = Date.now()
  const context = { url: ctx.request.url }
  const renderStream = renderer.renderToStream(context)
  let firstChunk = true

  ctx.body += html.head

  renderStream.on('data', chunk => {
    if (firstChunk) {
      if (context.initialState)
        ctx.body += `<script>window.__INITIAL_STATE__=${serialize (context.initialState, { isJson: true })}</script>`
      firstChunk = false
    }
    ctx.body += chunk
  })

  renderStream.on('end', () => {
    ctx.body += html.tail
    console.log(`whole request took ${Data.now() - s}ms`)
  })

  renderStream.on('error', err => {
    throw err
  })

}
