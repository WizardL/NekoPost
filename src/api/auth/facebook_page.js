"use strict"

import shortid from 'shortid'
import * as recaptcha from 'recaptcha-validator'
import { recaptcha_development, recaptcha_test, recaptcha_production } from '../../../config'
const RecaptchaConfig = (process.env.NODE_DEV == 'production') ? recaptcha_production : ((process.env.NODE_DEV == 'development') ? recaptcha_development : recaptcha_test)

export default (router) => {

  router

    .post('/post', post_handler)

}

async function post_handler(ctx, next) {
  //Verify Recatpcha
  try {
    if (!ctx.body["g-recaptcha-response"]) {
      ctx.throw(500, 'Please remember to complete the human verification.')
      return;
    }
    await recaptcha.promise(RecaptchaConfig.secret, ctx.body["g-recaptcha-response"], ctx.request.ip);
    ctx.body = { msg: 'Good!' };
  } catch (err) {
    if (typeof err === 'string')
      ctx.throw(500, err);
    else
      ctx.throw(500, err);
  }
  
  // TODO 
}
