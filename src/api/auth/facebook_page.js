"use strict"

//Dependencies
import shortid from 'shortid'
import sleep from 'sleep-promise'
import FB from 'fb';
import * as recaptcha from 'recaptcha-validator'

//Config
import { recaptcha_development, recaptcha_test, recaptcha_production } from '../../../config' //Recaptcha Config
import { fbconf } from '../../../config' //Facebook Config
const RecaptchaConfig = (process.env.NODE_DEV == 'production') ? recaptcha_production : ((process.env.NODE_DEV == 'development') ? recaptcha_development : recaptcha_test)

//Models
import PostModel from '../../model/post'

export default (router) => {

  router

    .post('/post', post_handler)

}

async function post_handler(ctx, next) {
  //Verify Content
  if(!ctx.body["content"] || !ctx.body["type"])
    ctx.throw(500, 'Please type the content you want to post.')
  
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

  PostModel.findOne({ type: 'post' }, 'created_on', { sort: { 'created_on' : -1 } }, (function(err, post){ var oldtime = post.created_on }))
  setTimeout((async function (){ 
    try {
      const format = `#告白独中${id}\n发文请至\n举报 ${report_link}\n`
      const content = `${format} ${ctx.body["content"]}`
  
      if (ctx.body["type"] == 'image') {
        response = await FB.api(`${fbconf.page.page_username}/photos`, 'post', { message: content, url: pic })

      } else {
        const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
        const link = urlregex.exec(ctx.body["content"]) ? urlregex.exec(ctx.body["content"]) : ''
        response = await FB.api(`${fbconf.page.page_username}/feed`, 'post', { message: content, link: link })
      }

      const PostEntity = new PostModel({ _id: id, type: 'post', postid: response.postid, ip: ctx.request.ip })
      PostEntity.save()

    } catch(error) {
      if(error.response.error.code === 'ETIMEDOUT') {
        console.log('request timeout')
      } else {
        console.log('error', error.message)
      }
    }
  }), oldtime + 120000)
}
