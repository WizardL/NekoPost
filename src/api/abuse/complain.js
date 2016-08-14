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
  
  const complainResult = await PostModel.findByIdAndUpdate(ctx.params.postid, { $addToSet: { reporter: ctx.state.user.id } }, { safe: true, upsert: true }).exec()
  if(complainResult === null) {
    await PostModel.find({ _id: ctx.params.postid }).remove().exec()
    ctx.throw('Post not found.')
  }
  ctx.body = { success: true }

}
