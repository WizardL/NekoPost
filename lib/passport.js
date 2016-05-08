"use strict";

// Config
const config = require('../config');

// Dependencies
var FacebookStrategy = require('passport-facebook').Strategy
  , Post = require('mongoose').model('Post')
  ;

var serializer = function (post, done) {
  done(null, post._id);
};

var deserializer = function (id, done) {
  Post.findById({ _id: id }, function (err, profile) {
    if (err) done(err);
    done(null, profile);
  })
};

module.exports = function (passport, config) {
  passport.serializeUser(serializer);
  passport.deserializeUser(deserializer);

  if ('' === config.auth.fb_clientid) {
    console.log("[ ! ] Please add the faceook clientID".red);
    process.exit(0);
  }
  
  if ('' === config.auth.fb_secret) {
    console.log("[ ! ] Please add the faceook secret".red);
    process.exit(0);
  }

  passport.use(new FacebookStrategy({
    clientID: config.auth.fb_clientid,
    clientSecret: config.auth.fb_secret,
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback',
    profileFields: ['id', 'email']
  }, function (accessToken, refreshToken, profile, done) {
    Post.findOne({ 'reporter': profile.id }, function (err, post) {
      if (err) return done(err);
      if (!post) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'facebook',
          facebook: profile._json
        });
        user.save(function (err) {
          if (err) console.log(err);
          return done(err, null);
        });
      } else {
        return done(err, user);
      }
    })
  }));
};
