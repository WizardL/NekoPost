'use strict'

import Koa from 'koa'
import uuid from 'uuid'

// import Renderer from './server/renderer'
import middleware from './middleware'
// import server from './server'
import auth from './auth'
import api from './api'

const app = new Koa()

// const renderer = Renderer(app)

// Generate the keys on runtime, totally random
app.keys = [`${uuid.v4()}-${uuid.v4()}-${uuid.v4()}`]

app
  // .use(ctx => ctx.renderer = renderer)
  // .use(server())
  .use(middleware())
  .use(auth())
  .use(api())
  .use((ctx) => ctx.status = 404)

export default app
