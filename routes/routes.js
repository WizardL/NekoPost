"use stric";

// Dependencies
var Router = require('koa-router')
  , Mount = require('koa-mount')
  , pages = require('./pages')
  , handlers = require('./handlers')
  ;

// Secured path middleware
var secured = function* (next) {
  if (!this.isAuthenticated()) this.status = 401;
  yield next;
};

// Routes
module.exports = function (app, passport) {
  const route = new Router();

  route
    .get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }))
    .get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/magic',
      failureRedirect: '/'
    }))

    .get('/', pages.index)
    .get('/abuse/:id', pages.abuse)

    .post('/upload', handlers.upload);
<<<<<<< HEAD
    ;

  app.use(route.routes());
  app.use(mount())
=======
  ;
>>>>>>> 5cc228d629e8d7658792aaf385b7e401f0a20025
}
