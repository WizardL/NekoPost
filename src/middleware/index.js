"use strict"

import bodyParser from 'koa-better-body'
import ratelimit from 'koa2-rate-limit'
import compose from 'koa-compose'
import convert from 'koa-convert'
import serve from 'koa-static'
import passport from 'koa-passport'
import FacebookStrategy from 'passport-facebook'

import { appId, appSecret, siteUrl } from '../../config'

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

    passportinit,

  ])
}

async function misato(ctx, next) {
  ctx.set('X-Written-By', 'Unistay-Dev-Team')
  ctx.set('X-Powered-By', 'Unistay-Engine')
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

async function passportinit(ctx, next) {
  passport.use(new FacebookStrategy({
    clientID: appId,
    clientSecret: appSecret,
    callbackURL: `${siteUrl}login/callback`,
    profileFields: ['id', 'displayName', 'email']
  },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));
  passport.initialize()
}
