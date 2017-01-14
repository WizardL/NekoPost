'use strict'

// FB
import {} from '../../fb/post'

// Recaptcha check.
import { recaptchaCheck } from '../../auth'

export default (router) => {
  router

    .post('/comment/:id',
          recaptchaCheck(),
          comment_handler)
}

async function comment_handler(ctx, next) {
  // TODO
}
