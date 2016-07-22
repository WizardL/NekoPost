"use strict"

// Facebook configurations
import { fbConf } from '../config'

import compose from 'koa-compose'
import convert from 'koa-convert'
import passport from 'koa-passport'
import session from 'koa-generic-session'
import { Strategy as FacebookStrategy } from 'passport-facebook'

passport.use(new FacebookStrategy({
  clientID:     fbConf.appId,
  clientSecret: fbConf.appSecret,
  callbackURL: `http://localhost:${process.env.PORT || 3000}/auth/facebook/callback`,
  enableProof: true
}, function(token, tokenSecret, profile, done) {
  // retrieve user ...
  done(null, user)
}))

export default function auth() {
  return compose([

    // session 
    convert(session()),

    // passport initialization
    passport.initialize(),

    // passport session initialization
    passport.session(),
    
  ])
}

