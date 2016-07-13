"use strict"

import mongoose from 'mongoose'
import shortid from 'shortid'

const AbuseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  postid: { type: String },
  status: { delivered: { type: Boolean } },
  ip: [{ type: String }],
  created_on: { type: Date, default: Date.now }
})

// Model initialization
export default mongoose.model('Abuse', PostSchema)
