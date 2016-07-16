"use strict"

import mongoose from 'mongoose'
import shortid from 'shortid'

// Will check if the unique id `_id` is used in database or not
const idGenerator = (ctx, callback) => {
  let newId = shortid.generate()
  ctx.constructor.findOne({ _id: newId }).then((course) => {
    if (course)
      idGenerator(ctx, callback)
    else {
      ctx._id = newId
      next()
    }
  }, (err) => {
    next(err)
  })
}

const Postid = new mongoose.Schema({
  next: { type: Number, default: 1 }
})

const PostSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  postid: { type: String },
  reporter: [{ type: Array }],
  status: { delivered: { type: Boolean } },
  ip: { type: String },
  created_on: { type: Date, default: Date.now }
})

// save hook
PostSchema.pre('save', function(next) {
  const post = this
  idGenerator(post, next)
  Postid.findById(postid_id, { $inc: { next: 1} }, (err, postid) => {
    if (err)
      next(err)
    post.post_id = postid.next - 1 
    next()
  })
  return next()
})

// Model initialization
export default mongoose.model('Post', PostSchema)
