"use strict"

// Dependencies
import FB from 'fb'
import shorten from '../../shorten'

// FB
import FBNotify from '../../fb/notify'
import { PostToFB, PostImageToFB } from '../../fb/post'

// Check authenication.
import { isAdmin, isAuthenticated } from '../../auth'

// Models
import { IDModel, PostModel } from '../../model/post'

// Configurations
import { siteConf, fbConf, shortenConf } from '../../../config'

export default (router) => {

  router

    .post('/getPost',
         isAuthenticated(),
         isAdmin(),
         getPost)
  
    .get('/post/:postid/accept',
         isAuthenticated(),
         isAdmin(),
         postAccepted)

    .get('/post/:postid/reject',
         isAuthenticated(),
         isAdmin(),
         postRejected)
}

async function getPost(ctx, next) {
  // Verify Content
  if(!ctx.request.fields["delivered"] || !ctx.request.fields["need_approve"] || !ctx.request.fields["pages"] || !ctx.request.fields['sort'])
    ctx.throw('Some parameters are missing.')

  const sort = (ctx.request.fields['sort'] === 'descending') ? "-" : "+"
  const pages = ctx.request.fields["pages"]
  const delivered = (ctx.request.fields["delivered"] === "false") ? false : true
  const need_approve = (ctx.request.fields["delivered"] === "false") ? false : true
  const limitPageResult = ctx.request.fields["limitPageResult"] ? ctx.request.fields["limitPageResult"] : 20

  const post = await PostModel.find({ status: {
    delivered: delivered,
    need_approve: need_approve
  }})
  .sort(`${sort}created_on`)
  .skip(pages > 0 ? ((pages - 1) * limitPageResult) : 0)
  .limit(limitPageResult)
  .exec()

  ctx.body = {
    success: true, 
    results: post
  }

}

async function postAccepted(ctx, next) {
  // TODO

  // Find post by id.
  const post = await PostModel.findById(ctx.params.postid).exec()

  // Check post.
  checkPost(ctx, post)

  // Add format to post content
  const id = await getCount()
  let post_url, report_url
  [post_url, report_url] = await Promise.all([shorten(siteConf.postUrl()), shorten(`${siteConf.reportUrl()}${id}`)]) // shorten url

  const format = `#${fbConf.page.name}${id}\n`+
    `📢发文请至 ${post_url}\n`+
    `👎举报滥用 ${report_url}\n\n`
  const content = `${format}${post.content}`

  await PostModel.findByIdAndUpdate(ctx.params.postid, 
    { $set: { content: content } }, { 
      safe: true, 
      upsert: true 
    }).exec()

  const IDEntity = new IDModel({ postKey: ctx.params.postid })
  IDEntity.save()

  // Post to facebook
  try {
    const postKey = ctx.params.postid
    // Check post got image or not.
    if(!post.imgLink) {
      // TODO

      // URL Matching
      const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
      const link = urlregex.exec(post.content) ? urlregex.exec(post.content)[0] : ''
      
      // The following code is for posting a post to a Facebook page
      await PostToFB(postKey, content, link, true)

    } else {
      // TODO
      // The following code is for posting a image to a Facebook page
      await PostImageToFB(postKey, content, picture, true)

    }

  } catch(error) {
    ctx.throw(error)
  }

  ctx.body = { success: true }
}

async function postRejected(ctx, next) {
  // Check post exists or not.
  const post = await PostModel.find({ _id: ctx.params.postid })

  if(!post[0])
    ctx.throw(404, 'Post not found.')
  else
    await PostModel.find({ _id: ctx.params.postid }).remove().exec()

  ctx.body = { success: true }

}

const getCount = () => {
  return new Promise((resolve, reject) => {
    IDModel.nextCount((err, count) => { resolve(count) })
  })
}

const checkPost = (ctx, post) => {
  // Check post exists or not.
  if(post === null)
    ctx.throw(404, 'Post not found.')

  // Check this post need approve or not.
  if(post.status.need_approve === false)
    ctx.throw('This post don\'t need approve.')
  
  // Check this post has posted or not.
  if(post.status.delivered === true)
    ctx.throw('The post has been posted.')
}
