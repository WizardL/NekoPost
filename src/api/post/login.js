"use strict"

import passport from 'koa-passport'

export default (router) => {

  router

    .get('/auth/facebook',
         passport.authenticate('facebook'))

    .get('/auth/facebook/callback',
         passport.authenticate('facebook'))

  
}

//TODO
