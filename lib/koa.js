"use strict";

// Dependencies
var errorHandler = require('koa-error')
  , bodyParser = require('koa-bodyparser')
  , serve  = require('koa-static')
  , datastore = require('koa-redis')
  , ratelimit = require('koa-ratelimit')
  , compress = require('koa-compress')
  , session = require('koa-generic-session')
  , redis = require('redis')
  ;

const config = require('../config');

module.exports = function(app, config, passport) {
  if (!config.app.keys) {
    throw new Error('* Please add session key in the config file');
  }
  if (!config.app.fbToken) {
    throw new Error('* Please add ');
  }

  app

    // X-Powered-By
    .use(function *(next) {
      this.set('X-Powered-By', 'Misato');
      yield next;
    })

    // 404 functions
    .use(function *(next) {
      yield next;
      if (404 != this.status) return;
      this.status = 404;
      switch (this.accepts('html', 'json')) {
        case 'html':
          this.type = 'html';
          this.body = '<p>Page Not Found</p>';
          break;
        case 'json':
          this.body = {message: 'Page Not Found'};
          break;
        default:
          this.type = 'text';
          this.body = 'Page Not Found';
      }
    })

    // Static serving
    .use(serve(app.config.root + '/public'))

    // Error handling
    .use(errorHandler())

    // Generic session based on Redis
    .use(session({ key: 'misato.sid', store: datastore() }))

    // Ratelimit
    .use(ratelimit({ db.redis.createClient(), duration: 1000 * 8, max: 100 }))

    .use(bodyParser({
      onerror: function(err, ctx) {
        ctx.throw('Body Parse Error', 422);
      }
    }))

    // PassportJS
    .use(passport.initialize())
    .use(passport.session())

    // Compress
    .use(compress())
    ;
}
