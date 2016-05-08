"use strict";
// Dependencies
var passport = require('koa-passport')
<<<<<<< HEAD
    , mongoose = require('mongoose')
    , colors = require('colors')
    , http = require('http')
    , koa = require('koa')
    , fs = require('fs')
    ;
=======
  , mongoose = require('mongoose')
  , colors = require('colors')
  , http = require('http')
  , koa = require('koa')
  , fs = require('fs')
  ;
>>>>>>> 5cc228d629e8d7658792aaf385b7e401f0a20025

// Koa app
const app = koa();

// Configs
const config = require('./config');

// Database
mongoose.connect(config.mongo.url);

mongoose.connection.on('error', function () {
  console.error.bind('[ ! ] Connection error: '.red);
});

mongoose.connection.once('open', function () {
  console.log('[ * ] Database connection open.'.green);
});

// Models
<<<<<<< HEAD
require('models/post');
=======
const modelsPath = config.app.root + "./models";
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf("js")) {
    require(modelsPath + '/' + file);
  }
});
>>>>>>> 5cc228d629e8d7658792aaf385b7e401f0a20025

// Module
// require('./lib/passport')(passport, config);
require('./lib/koa')(app, config, passport);

// Routes
require('./routes/routes')(app, passport);

// HTTP Server Instance
<<<<<<< HEAD
http.createServer(app.callback()).listen(3003);
=======
http.createServer(app.callback()).listen(3000);
>>>>>>> 5cc228d629e8d7658792aaf385b7e401f0a20025
