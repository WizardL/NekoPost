"use strict";

// Dependencies
var Router = require('koa-router')
, pages = require('./pages')
;

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
    //Facebook Auth
    .get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }))
    .get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/magic',
      failureRedirect: '/'
    }))
    //Index
    .get('/', pages.index)
    //Abuse Reporting Page
    .get('/abuse/:postid', pages.abuse)
  ;
  
  app.use(route.routes()); 

};
