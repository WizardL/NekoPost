"use strict"

import Koa from 'koa'
import uuid from 'uuid'

import middleware from './middleware'
import server from './server'
import auth from './auth'
import api from './api'

const app = new Koa()

// Generate the keys on runtime, totally random
app.keys = [`${uuid.v4()}-${uuid.v4()}-${uuid.v4()}`]

app
  .use(server())
  .use(middleware())
  .use(auth())
  .use(api())
  .use(ctx => ctx.status = 404)

export default app
