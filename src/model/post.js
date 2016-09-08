"use strict"

import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const PostSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  postid: { type: String },
  content: { type: String },
  imgLink: { type: String },
  reporter: [{ type: String }],
  status: { delivered: { type: Boolean }, need_approve: { type: Boolean }, deleted: { type: Boolean } },
  ip: { type: String },
  created_on: { type: Date, default: Date.now }
})

// Initialize auto increment
autoIncrement.initialize(mongoose.connection)
// ID increment
PostSchema.plugin(autoIncrement.plugin, 'Post')

// Model initialization
export default mongoose.model('Post', PostSchema)
