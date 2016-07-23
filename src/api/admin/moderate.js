"use strict"

import { isAuthenticated } from '../../auth'

import compose from 'koa-compose'
import convert from 'koa-convert'

export default (router) => {

  router

    .get('/dashboard',
         isAuthenticated(),
         post_dashboard)
  
    .get('/post/:postid/accept',
         isAuthenticated(),
         post_accepted)

    .get('/post/:postid/reject',
         isAuthenticated(),
         post_rejected)
}

async function post_dashboard(ctx, next) {
  // TODO
}

async function post_accepted(ctx, next) {
  // TODO
}

async function post_rejected(ctx, next) {
  // TODO
}
