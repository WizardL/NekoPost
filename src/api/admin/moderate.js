"use strict"

// Dependencies
import FB from 'fb'
import shorten from '../../shorten'
import FBNotify from '../../fb/notify'
import { isAuthenticated } from '../../auth'

// Models
import { IDModel, PostModel } from '../../model/post'

// Configs
import { siteConf, fbConf, shortenConf } from '../../../config'

export default (router) => {

  router

    .post('/getPost',
         isAuthenticated(),
         getPost)
  
    .get('/post/:postid/accept',
         isAuthenticated(),
         postAccepted)

    .get('/post/:postid/reject',
         isAuthenticated(),
         postRejected)
}

/**
 * [post] getPost
 * Moderator can get post from database.
 * 
 * @param {String} sort
 * @param {String} pages
 * @param {Boolean} delivered
 * @param {Boolean} need_approve
 * @param {Integer} limitPageResult
 */
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
  const post = await PostModel.findById(ctx.params.postid).exec()

  // Check post exists or not.
  if(post === null)
    ctx.throw(404, 'Post not found.')

  // Check this post need approve or not.
  if(post.status.need_approve === false)
    ctx.throw('This post don\'t need approve.')
  
  if(post.status.delivered === true)
    ctx.throw('The post has been posted.')
  
  //Add format to post content
  const formatID = await getCount()
  let post_url, report_url
  [post_url, report_url] = await Promise.all([shorten(siteConf.postUrl()), shorten(`${siteConf.reportUrl()}${formatID}`)]);

  const format = `#${fbConf.page.name}${formatID}\n`+
    `📢发文请至 ${post_url}\n`+
    `👎举报滥用 ${report_url}\n\n`
  const content = `${format}${post.content}`

  await PostModel.findByIdAndUpdate(ctx.params.postid, 
    { $set: { content: content } }, { 
      safe: true, 
      upsert: true 
    }).exec()

  const IDEntity = new IDModel({ id: ctx.params.postid })
  IDEntity.save()

  FB.options('v2.8') // using latest facebook api
  FB.setAccessToken(fbConf.accessToken)

  // Post to facebook
  try {
    // Check post got image or not.
    if(!post.status.imgLink) {
      // TODO
      const id = ctx.params.postid

      // URL Matching
      const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
      const link = urlregex.exec(post.content) ? urlregex.exec(post.content)[0] : ''
      
      // The following code is for posting a post to a Facebook page
      const response = await FB.api(`${fbConf.page.username}/feed`,
        'post', {
          message: content,
          link: link
        })
      // Puts the PostID into the database after the post is posted to Facebook.
      await PostModel.findOneAndUpdate({ _id: id }, {
        content: content,
        postid: response.postid,
        status: { delivered: true, need_approve: true }
      }).exec()

    } else {
      // TODO
      // The following code is for posting a image to a Facebook page
      const response = await FB.api(`${fbConf.page.username}/photos`, 
        'post', {
          message: content, 
          url: post.status.imgLink 
        })

      // Puts the PostID and Image into the database after the post is posted to Facebook.
      await PostModel.findOneAndUpdate({ _id: id }, {
        content: content,
        imgLink: pic,
        postid: response.postid,
        status: { delivered: true, need_approve: true } 
      }).exec()

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
