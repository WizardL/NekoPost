"use strict"

// Dependencies
import mongoose from 'mongoose'

// Models
import { IDModel, PostModel } from '../../model/post'

export default (router) => {

  router

    .get('/post/new',
          new_handler)

}

async function new_handler(ctx, next) {

  let post = []
  const postID = await IDModel.find().exec()

  await Promise.all(postID.map((value) => {
    post.push(value.id)
  }))
  
  const pages = ctx.query["pages"]
  const limitPageResult = ctx.query["limitPageResult"] ? ctx.query["limitPageResult"] : 20

  post = await PostModel.find({
    _id: { $in: post },
    'status.delivered' : true
  })
  .sort('-created_on')
  .skip(pages > 0 ? ((pages - 1) * limitPageResult) : 0)
  .limit(limitPageResult)
  .select('content created_on postid')
  .exec()

  await Promise.all(postID.map((value) => {
    const id = value['_id']
    post.map((object) => {
      return object.id = id
    })
  }))
  ctx.body = { success: true, results: post }
}
