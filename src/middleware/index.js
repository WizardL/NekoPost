"use strict"

import bodyParser from 'koa-better-body'
import ratelimit from 'koa2-rate-limit'
import compose from 'koa-compose'
import convert from 'koa-convert'
import serve from 'koa-static'

export default function middleware(app) {
  return compose([

    // X-Powered-By
    misato,

    // Error handling
    errorhandling,

    // Ratelimiting
    /* TODO  Routes */
    //ratelimit(),

    // static page
    serve('public'),

    // Body Parser
    convert(bodyParser()),

    // Echo
    verbose,

  ])
}

async function misato(ctx, next) {
  ctx.set('X-Written-By', 'Wizard-League')
  ctx.set('X-Powered-By', 'Wizard-Engine')
  await next()
}

async function verbose(ctx, next) {
  console.log('  Request Header: '.yellow, ctx.header)
  console.log('  Request Body: '.yellow, ctx.body)
  await next()
}

async function errorhandling(ctx, next) {
  try {
    await next()
  } catch (err) {
    let status = err.status || 500
    let message = err.message || 'Internal Error'

    ctx.status = status
    ctx.body = {
      success: false,
      message: message
    }

    if (status == 500)
      ctx.app.emit('error', err, ctx)
  }
}
