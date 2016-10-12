"use strict"

import FB from 'fb'
import passport from 'koa-passport'

// Check authenication.
import { isAdmin, isAuthenticated } from '../../auth'

// Configurations
import { fbConf } from '../../../config'

export default (router) => {

  router

    .get('/getPageToken',
         isAuthenticated(),
         isAdmin(),
         token_handler)

}

async function token_handler(ctx, next) {
  FB.options({ version: 'v2.8' })
  try {
    const long_lived_token = await FB.api('oauth/access_token', {
      client_id: fbConf.appId,
      client_secret: fbConf.appSecret,
      fb_exchange_token: ctx.state.user.accessToken,
      grant_type: 'fb_exchange_token'
    })

    FB.setAccessToken(long_lived_token.access_token)

    const accounts = await FB.api('me/accounts') // get all page token that never expired.
    ctx.body = { success: true, accounts }
  } catch(error) {
    ctx.throw(error)
  }
}