"use strict"

import shortid from 'shortid'

export default (router) => {

  router

    .post('/post', post_handler)

}

async function post_handler(ctx, next) {
  // TODO 
}
