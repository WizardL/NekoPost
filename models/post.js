"use strict";

// Dependencies
var Schema = require('mongoose').Schema;

// Model 'User'
var PostSchema = new Schema({
  post_id: { type: Schema.ObjectId },
  status:  { delivered: { type: Boolean },
             report:  [ { userid: { type: String }}],
           },
  created_on: { type: Date, default: Date.now }
});

mongoose.model('Post', PostSchema);
