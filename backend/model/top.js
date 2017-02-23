'use strict'

import mongoose from 'mongoose'

// Use native promises
mongoose.Promise = global.Promise

const TopSchema = new mongoose.Schema({
  _id: { type: String },
  postid: { type: String },
  likes: { type: Number },
  shares: { type: Number },
  comments: { type: Number },
  totalScore: { type: Number }
})

export const TopModel = mongoose.model('Top', TopSchema)
