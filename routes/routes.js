"use strict";

// Dependencies
var Router = require('koa-router')
, pages = require('./pages')
;

// Handlers
var post = require('../handlers/post');

// Secured path middleware
var secured = function* (next) {
  if (!this.isAuthenticated()) this.status = 401;
  yield next;
};

// Routes
module.exports = function (app, passport) {
  // Register router
  var route = new Router();
  route
    //GET REQUEST
    //Facebook Auth
    .get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }))
    .get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/authed/',
      failureRedirect: '/'
    }))
  //Index
    .get('/', pages.index)
  //Abuse Reporting Page
    .get('/abuse/:postid', secured, pages.abuse)
    
  //POST REQUEST
  //Confession Post
    .post('/post', post)
  ;
  
  app.use(route.routes()); 

};
