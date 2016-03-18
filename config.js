"use strict";
var path = require('path')
  , _ = require('lodash')
  ;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var base = {
  app: {
    root: path.normalize(path.join(__dirname, '/..')),
    env: env,
  },
};

var specific = {
  development: {
    app: {
      port: 3000,
      name: "misato-test",
      keys: ['secret'],
    },
    mongo: {
      url: "mongodb://localhost/misato-test",
    }
  },

  production: {
    app: {
      port: process.env.PORT || 80,
      name: "misato-production",
      keys: ['deep secret'],
    },
    mongo: {
      url: "mongodb://localhost/misato-prod",
    },
  },
};

module.exports = _.merge(base, specific[env]);
