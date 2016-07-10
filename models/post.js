"use strict";

// Dependencies
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// Model 'User'
const PostSchema = new Schema({
  post_id: { type: Schema.ObjectId },
  status: { delivered: { type: Boolean } },
  reporter: [{ type: String }],
  created_on: { type: Date, default: Date.now }
});

export const Post mongoose.model('Post', PostSchema);
