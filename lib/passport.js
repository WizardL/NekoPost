"use strict";

// Dependencies
var FacebookStrategy = require('passport-facebook').Strategy
  , User = require('mongoose').model('User')
  ;

var serializer = function(user, done) {
  done(null, user._id);
};

var deserializer = function(id, done) {
  User.findById({ _id: id }), function(err, profile) {
    if (err) done(err);
    done(null, profile);
  })
};

module.exports = function(passport, config) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializer);
  passport.use(new FacebookStrategy({
    clientID: config.auth.fb_clientid,
    clientSecret: config.auth.fb_secret,
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback',
    profileFields: ['id', 'email']
  }, function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id': profile.id }, function(err, user) {
      if (err) return done(err);
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'facebook',
          facebook: profile._json
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, null);
        });
      } else {
        return done(err, user);
      }
    })
  }));
};
