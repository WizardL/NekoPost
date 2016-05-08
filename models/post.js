"use strict";

// Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Model 'User'
var PostSchema = new Schema({
  post_id: { type: Schema.ObjectId },
  status: { delivered: { type: Boolean } },
  reporter: [{ type: String }],
  created_on: { type: Date, default: Date.now }
});

mongoose.model('Post', PostSchema);
