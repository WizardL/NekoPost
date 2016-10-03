"use strict"

import { isAuthenticated } from '../../auth'

// Models
import { IDModel, PostModel } from '../../model/post'

export default (router) => {

  router

    .get('/dashboard',
         isAuthenticated(),
         postDashboard)
  
    .get('/post/:postid/accept',
         isAuthenticated(),
         postAccepted)

    .get('/post/:postid/reject',
         isAuthenticated(),
         postRejected)
}

async function postDashboard(ctx, next) {
  // TODO
}

async function postAccepted(ctx, next) {
  // TODO
  const post = await PostModel.findByIdAndUpdate(ctx.params.postid, 
    { $set: { status: { delivered: true } } }, { 
      safe: true, 
      upsert: true 
    }).exec()

  // Check post exists or not.
  if(post === null) {
    // Even post is not exist, mongoose findByIdAndUpdate will add a new record. So I need to remove it.
    await PostModel.find({ _id: ctx.params.postid }).remove().exec()
    ctx.throw('Post not found.')
  }

  // Check this post need approve or not.
  if(post.status.need_approve === false) {
    // If post is no need to approve, set the post to original value.
    await PostModel.findByIdAndUpdate(ctx.params.postid,
      { $set: { status: { delivered: post.status.delivered } } }, { 
        safe: true,
        upsert: true 
      }).exec()

    ctx.throw('This post don\'t need approve.')
  }
  
  const IDEntity = new IDModel({ id: ctx.params.postid })
  IDEntity.save()

  // Post to facebook
  try {
    // Check post got image or not.
    if(!post.status.imgLink) {
      // TODO
      const id = await getCount()

      // URL Matching
      const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
      const link = urlregex.exec(ctx.body["content"]) ? urlregex.exec(ctx.body["content"])[0] : ''
      
      // The following code is for posting a post to a Facebook page
      const response = await FB.api(`${fbconf.page.page_username}/feed`,
        'post', {
          message: content,
          link: link
        })
      
      // Puts the PostID into the database after the post is posted to Facebook.
      await PostModel.findOneAndUpdate({ _id: id }, { 
        postid: response.postid, 
        status: { delivered: true }
      }).exec()

    } else {
      // TODO
      // The following code is for posting a image to a Facebook page
      const response = await FB.api(`${fbconf.page.page_username}/photos`, 
        'post', {
          message: content, 
          url: post.status.imgLink 
        })

      // Puts the PostID and Image into the database after the post is posted to Facebook.
      await PostModel.findOneAndUpdate({ _id: id }, { 
        imgLink: pic,
        postid: response.postid, 
        status: { delivered: true } 
      }).exec()

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

async function postRejected(ctx, next) {
  // TODO
}

const getCount = () => {
  return new Promise((resolve, reject) => {
    IDModel.nextCount((err, count) => { resolve(count) })
  })
}
