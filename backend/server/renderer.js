'use strict'

import lruCache from 'lru-cache'

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

const createRenderer = (bundle) => {
  return createBundleRenderer(bundle, {
    cache: lruCache({ max: 1000, maxAge: 1000 * 60 * 15 })
  })
}

export default function renderer(app) {
  // Setup the server renderer
  if (process.env.NODE_ENV == 'production') {
    const bundlePath = resolve('../../dist/server-bundle.js')
    return createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
  } else {
    require('../../build/dev-server')(app, bundle => {
      return createRenderer(bundle)
    })
  }
}
