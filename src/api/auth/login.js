"use strict"
import passport from 'koa-passport'

export default (router) => {

  router

    .get('/login', passport.authenticate('facebook', { scope: ['manage_pages', 'publish_pages'] }))
    .get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home. 
        res.redirect('/');
      });

}

//TODO
