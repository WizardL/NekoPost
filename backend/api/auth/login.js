"use strict"

import passport from 'koa-passport'

export default (router) => {

  router

    .get('/auth/fb',
         passport.authenticate('facebook', { scope: ['email', 'publish_actions', 'manage_pages', 'publish_pages', 'pages_show_list'] }))

    .get('/auth/fb/callback',
         passport.authenticate('facebook'),
         callback_handler)
}

async function callback_handler(ctx, next) {
  ctx.body = { success: true }
}
