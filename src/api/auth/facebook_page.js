"use strict"

//Dependencies
import shortid from 'shortid'
import FB from 'fb';
import * as recaptcha from 'recaptcha-validator'

//Config
import { recaptcha_development, recaptcha_test, recaptcha_production } from '../../../config' //Recaptcha Config
import { access_token, page_username, need_approve } from '../../../config' //Facebook Config
const RecaptchaConfig = (process.env.NODE_DEV == 'production') ? recaptcha_production : ((process.env.NODE_DEV == 'development') ? recaptcha_development : recaptcha_test)

//Models
import PostModel from '../../model/post'

export default (router) => {

  router

    .post('/post', post_handler)

}

async function post_handler(ctx, next) {
  //Verify Recatpcha
  try {
    if (!ctx.body["g-recaptcha-response"]) {
      ctx.throw(500, 'Please remember to complete the human verification.')
    }
    await recaptcha.promise(RecaptchaConfig.secret, ctx.body["g-recaptcha-response"], ctx.request.ip)
    ctx.body = { msg: 'Good!' }
  } catch (err) {
    if (typeof err === 'string')
      ctx.throw(500, err)
    else
      ctx.throw(500, err)
  }

  FB.setAccessToken(access_token)
  /*TODO*/
  try {
    const content = ctx.body["content"]
    if (ctx.body["type"] == 'image')
      response = await FB.api(`${page_username}/photos`, 'post', { message: content, link: link })
    else
      response = await FB.api(`${page_username}/feed`, 'post', { message: content, url: pic })

    PostModel.findOne().sort('-_id').exec(function(err, item) {
      var id = item.id + 1
    });

  } catch(error) {
    if(error.response.error.code === 'ETIMEDOUT') {
      console.log('request timeout')
    } else {
      console.log('error', error.message)
    }
  }
  /*TODO*/
}
