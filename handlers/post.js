"use strict";

//Dependencies
var mongoose = require('mongoose')
  , recaptcha = require('recaptcha-validator')
  ;

const config = require('../config');
//Models
const PostModel = require('../models/post');

module.exports = function* (next) {
  //Verify Recatpcha
  try {
    if (!this.request.body["g-recaptcha-response"]) {
      this.body = { error: true, msg: 'Please remember to complete the human verification.' };
      return;
    }
    yield recaptcha.promise(config.recaptcha.site_secret, this.request.body["g-recaptcha-response"], request.ip);
    this.body = { error: false, msg: 'Good!' };
  } catch (ex) {
    if (typeof ex === 'string')
      this.body = { error: true, msg: 'Error from google: ' + ex };
    else
      this.body = { error: true, msg: 'General exception: ' + ex };
  }
  
  return yield next;
};
