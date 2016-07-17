"use strict"

import Koa from 'koa'

import middleware from './middleware'

const app = new Koa()

app
  .use(middleware())
  .use(ctx => ctx.status = 404)

export default app
