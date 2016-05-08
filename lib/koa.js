"use strict";

// Dependencies
var session = require('koa-generic-session')
, bodyParser = require('koa-bodyparser') 
, ratelimit = require('koa-ratelimit')
, errorHandler = require('koa-error')
, compress = require('koa-compress')
, redis = require('redis')
;

const config = require('../config');

module.exports = function (app, config, passport) {

  app
  // X-Powered-By
    .use(function* (next) {
      this.set('X-Powered-By', 'Misato');
      yield next;
    })

  // 404 functions
    .use(function* (next) {
      yield next;
      if (404 != this.status) return;
      this.status = 404;
      switch (this.accepts('html', 'json')) {
      case 'html':
        this.type = 'html';
        this.body = '<p>Page Not Found</p>';
        break;
      case 'json':
        this.body = { message: 'Page Not Found' };
        break;
      default:
        this.type = 'text';
        this.body = 'Page Not Found';
      }
    })

  // Error handling
    .use(errorHandler())

  // Ratelimit
    .use(ratelimit({ db: redis.createClient(), duration: 1000 * 8, max: 100 }))

    .use(bodyParser({
      onerror: function (err, ctx) {
        ctx.throw('Body Parse Error', 422);
      }
    }))

  // PassportJS
    .use(passport.initialize())
    .use(passport.session())

  // Compress
    .use(compress())
  ;

};
