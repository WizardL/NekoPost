"use strict"

// Dependencies
import mongoose from 'mongoose'

// Models
import { IDModel, PostModel } from '../../model/post'

// Configurations
import { fbConf } from '../../../config'

export default (router) => {

  router

    .get('/post/new',
          new_handler)

}

async function new_handler(ctx, next) {

  let postKey = []
  const postID = await IDModel.find().exec()

  await Promise.all(postID.map((value) => {
    postKey.push(value.postKey)
  }))
  
  const pages = ctx.query["pages"]
  const limitPageResult = ctx.query["limitPageResult"] ? ctx.query["limitPageResult"] : 5

  const post = await PostModel.find({
    _id: { $in: postKey },
    'status.delivered' : true
  })
  .sort('+created_on')
  .skip(pages > 0 ? ((pages - 1) * limitPageResult) : 0)
  .limit(limitPageResult)
  .select('postid')
  .exec()

  await Promise.all(Object.keys(post).map((key) => {
    const regex = new RegExp(`#${fbConf.page.name}(\d+)`)
    const id = regex.exec(post[key].content)[1]
    post[key]['_id'] = id
  }))
  
  ctx.body = { success: true, results: post.reverse() }
}
