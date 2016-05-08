"use strict";

// Dependencies
var path = require('path')
  , _ = require('lodash')
  ;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var base = {
  app: {
    root: path.normalize(path.join(__dirname, './')),
    env: env
  }
};

var specific = {

  // development configuration
  development: {
    app: {
      port: 3000,
      name: "misato-test",
      SITEURL: "http://localhost",
      keys: ['secret']
    },
    mongo: {
      url: "mongodb://localhost/misato-test",
    },
    auth: {
      fb_clientid: "",
      fb_secret: ""
    }
  },

  // production configuration
  production: {
    app: {
      port: process.env.PORT || 80,
      name: "misato-production",
      SITEURL: "http://localhost",
      keys: ['deep secret']
    },
    mongo: {
      url: "mongodb://localhost/misato-prod"
    },
    auth: {
      fb_clientid: "",
      fb_secret: ""
    }
  },
};

module.exports = _.merge(base, specific[env]);
