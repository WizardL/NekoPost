"use strict"

import { isAuthenticated } from '../../auth'

// Models
import PostModel from '../../model/post'

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
  const acceptResult = await PostModel.findByIdAndUpdate(ctx.params.postid, { $set: { status: { delivered: true } } }, { safe: true, upsert: true }).exec()
  // Check post exists or not.
  if(acceptResult === null) {
    await PostModel.find({ _id: ctx.params.postid }).remove().exec()
    ctx.throw('Post not found.')
  }
  // Check this post need approve or not.
  if(acceptResult.status.need_approve === false) {
    ctx.throw('This post don\'t need approve.')
    await PostModel.findByIdAndUpdate(ctx.params.postid, { $set: { status: { delivered: acceptResult.status.delivered } } }, { safe: true, upsert: true }).exec()
  }
  // Post to facebook
  try {
    if(!acceptResult.status.imgLink) { //Check post type is image or not.
      // TODO
      const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
      const link = urlregex.exec(ctx.body["content"]) ? urlregex.exec(ctx.body["content"]) : ''
      response = await FB.api(`${fbconf.page.page_username}/feed`, 'post', { message: content, link: link })
      await PostModel.findOneAndUpdate({ _id: id }, { postid: response.postid, status: { delivered: true } }).exec();
    } else {
      // TODO
      response = await FB.api(`${fbconf.page.page_username}/photos`, 'post', { message: content, url: acceptResult.status.imgLink })
      await PostModel.findOneAndUpdate({ _id: id }, { imgLink: pic, postid: response.postid, status: { delivered: true } }).exec();
    }
  } catch(error) {
    if(error.response.error.code === 'ETIMEDOUT') {
      console.log('request timeout')
      ctx.throw('request timeout')
    } else {
      console.log('error', error.message)
      ctx.throw(error.message)
    }
  }

  ctx.body = { success: true }
}

async function post_rejected(ctx, next) {
  // TODO
}
