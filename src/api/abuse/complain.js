"use strict"

import { isAuthenticated, recaptchaCheck } from '../../auth'

// Models
import PostModel from '../../model/post'

export default (router) => {

  router

    .post('/abuse/:postid',
         isAuthenticated(),
         recaptchaCheck(),
         complain_handler)

}

async function complain_handler (ctx, next) {
  const post = await PostModel.findById(ctx.params.postid).exec()
  if(post === null)
    ctx.throw('Post not found.')
    
  const complainResult = await PostModel.findByIdAndUpdate(ctx.params.postid, { $addToSet: { reporter: ctx.state.user.id } }, { safe: true, upsert: true }).exec()
  ctx.body = { success: true }

}
