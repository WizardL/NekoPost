"use strict";
// Dependencies
var passport = require('koa-passport')
    , mongoose = require('mongoose')
    , colors = require('colors')
    , http = require('http')
    , koa = require('koa')
    , fs = require('fs')
    ;

// Koa app
const app = koa();

// Configs
const config = require('./config');

// Database
mongoose.connect(config.mongo.url);

mongoose.connection.on('error', function() {
  console.error.bind('[ ! ] Connection error: '.red);
});

mongoose.connection.once('open', function() {
  console.log('[ * ] Database connection open.'.green);
});

// Models
require('models/post');

// Module
// require('./lib/passport')(passport, config);
require('./lib/koa')(app, config, passport);

// Routes
require('./routes/routes')(app, passport);

// HTTP Server Instance
http.createServer(app.callback()).listen(3003);
