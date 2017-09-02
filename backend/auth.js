'use strict'

// Configurations
import { fbConf, adminEmail } from '../config'

import compose from 'koa-compose'
import convert from 'koa-convert'
import passport from 'koa-passport'
import session from 'koa-session-minimal'
import MongoStore from 'koa-generic-session-mongo'
import { Strategy as FacebookStrategy } from 'passport-facebook'

// Recaptcha
import {
  recaptchaDev,
  recaptchaTest,
  recaptchaProd } from '../config'

import recaptcha from 'recaptcha-validator'

const RecaptchaConfig =
          (process.env.NODE_ENV == 'production') ? recaptchaProd
        : (process.env.NODE_ENV == 'development') ? recaptchaDev
        : recaptchaTest

passport.use(new FacebookStrategy({
  clientID: fbConf.appId,
  clientSecret: fbConf.appSecret,
  callbackURL: `http://localhost:${process.env.PORT || 3000}/api/auth/fb/callback`,
  profileFields: ['id', 'displayName', 'email'],
  enableProof: true
}, (token, tokenSecret, profile, cb) => {
  // retrieve user ...
  profile.accessToken = token
  return cb(null, profile)
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export default function auth() {
  return compose([

    // session
    session({
      store: new MongoStore()
    }),

    // passport initialization
    passport.initialize(),

    // passport session initialization
    passport.session()

  ])
}

export function recaptchaCheck() {
  return async (ctx, next) => {
    if (process.env.NODEDEV == 'development') {
      console.log('Dev mode, skipping recaptcha')
      await next()
    }

    if (!ctx.request.fields['g-recaptcha-response'])
      ctx.throw(500, `Please remember to complete the human test.`)

    try {
      await recaptcha.promise(
        RecaptchaConfig.secret,
        ctx.request.fields['g-recaptcha-response'],
        ctx.request.ip
      )
    } catch (err) {
      if (typeof err === 'string')
        ctx.throw(500, err)
      else
        ctx.throw(500, err)
    }
  }
}
export function isAuthenticated() {
  return async (ctx, next) => {
    if (ctx.isAuthenticated())
      await next()
    else
      ctx.throw(401)
  }
}

export function isAdmin() {
  return async (ctx, next) => {
    if (adminEmail.includes(ctx.state.user.emails[0].value))
      await next()
    else
      ctx.throw(401)
  }
}
