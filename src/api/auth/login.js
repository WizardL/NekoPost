"use strict"
import passport from 'koa-passport'

export default (router) => {

  router

    .get('/login', passport.authenticate('facebook', { scope: ['manage_pages', 'publish_pages'] }),
      function(req, res) {
        // Successful authentication, redirect home. 
        res.redirect('/');
      });

}

//TODO
