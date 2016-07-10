"use strict"

export default (router) => {

  router

    .get('/abuse/:postid',
         complain_handler)

}

async function complain_handler (ctx, next) {
  // TODO
}
