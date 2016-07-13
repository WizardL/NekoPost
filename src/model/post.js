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

const PostSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  status: { delivered: { type: Boolean } },
  reporter: [{ type: String }],
  created_on: { type: Date, default: Date.now }
})

// save hook
PostSchema.pre('save', function(next) {
  const post = this
  idGenerator(post, next)
})

// Model initialization
export default mongoose.model('Post', PostSchema)
