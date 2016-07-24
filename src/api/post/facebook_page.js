"use strict"

// Dependencies
import shortid from 'shortid'
import sleep from 'sleep-promise'
import FB from 'fb';

import { recaptchaCheck } from '../../auth'

// Models
import PostModel from '../../model/post'

export default (router) => {

  router

    .post('/post',
          recaptchaCheck(),
          post_handler)

}

async function post_handler(ctx, next) {
  
  //Verify Content
  if(!ctx.body["content"] || !ctx.body["type"])
    ctx.throw(500, 'Please type the content you want to post.')
  
  FB.setAccessToken(access_token)

  PostModel.findOne({ type: 'post' }, 'created_on', { sort: { 'created_on' : -1 } }, 
    (function(err, post){ 
      if(post.created_on < 120000) {
        var time = (Date.now() - post.created_on) + 120000
      } else {
        var time = 120000
      }
    }))
  
  const PostEntity = new PostModel({ _id: id, type: 'post', status: { delivered: false }, ip: ctx.request.ip })
  PostEntity.save()

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

      PostModel.findOneAndUpdate({ _id: id }, { postid: response.postid, status: { delivered: true } });

    } catch(error) {
      if(error.response.error.code === 'ETIMEDOUT') {
        console.log('request timeout')
      } else {
        console.log('error', error.message)
      }
    }
  }), time)
}
