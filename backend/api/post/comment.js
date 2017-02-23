'use strict'

// FB
import { CommentOnPost } from '../../fb/post'

// Config
import { fbConf } from '../../../config'

// Recaptcha check.
import { recaptchaCheck } from '../../auth'

export default (router) => {
  router

    .post('/comment/:postid',
          recaptchaCheck(),
          comment_handler)
}

async function comment_handler(ctx, next) {
  CommentOnPost(ctx.params.postid, ctx.request.fields['content'], fbConf.commentPage[ctx.request.fields['identity']])
}
