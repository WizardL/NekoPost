'use strict'

import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

// Use native promises
mongoose.Promise = global.Promise

const PostSchema = new mongoose.Schema({
  _id: { type: String },
  postid: { type: String },
  content: { type: String },
  imgLink: { type: String },
  reporter: [{ type: String }],
  status: { delivered: { type: Boolean }, need_approve: { type: Boolean }, deleted: { type: Boolean } },
  ip: { type: String },
  notify: { type: String }, // user id
  created_on: { type: Date, default: Date.now }
})

const IDSchema = new mongoose.Schema({  // Record Post ID (Post to facebook.)
  _id: { type: mongoose.Schema.Types.ObjectId },
  postKey: { type: String } //_id in PostSchema
})

// Initialize auto increment
autoIncrement.initialize(mongoose.connection)

// ID increment
IDSchema.plugin(autoIncrement.plugin, 'ID')

// Model initialization
export const IDModel = mongoose.model('ID', IDSchema)
export const PostModel = mongoose.model('Post', PostSchema)
