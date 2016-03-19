"use stric";

// Dependencies
var Router = require('koa-router')
  ;

// Secured path middleware
var secured = function *(next) {
  if (!this.isAuthenticated()) this.status = 401;
  yield next;
};

// Routes
module.exports = function(app, passport) {
  const route = new Router();

  route
    .get('/auth/facebook', passport.authenticate('facebook'))
    .get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/magic',
      failureRedirect: '/'
    }))
    ;
    // Views... TODO
}
