"use strict"

import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

// Use native promises
mongoose.Promise = global.Promise

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

const IDSchema = new mongoose.Schema({  // Record Post ID (Post to facebook.)
  _id: { type: mongoose.Schema.Types.ObjectId },
  id: { type: Number } //_id in PostSchema
})

// Initialize auto increment
autoIncrement.initialize(mongoose.connection)

// ID increment
IDSchema.plugin(autoIncrement.plugin, 'ID')
PostSchema.plugin(autoIncrement.plugin, 'Post')

// Model initialization
export const IDModel = mongoose.model('ID', IDSchema)
export const PostModel = mongoose.model('Post', PostSchema)
