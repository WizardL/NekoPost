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
  
  await PostModel.findByIdAndUpdate(ctx.params.postid, { $push: { reporter: ctx.state.user.id } }, { safe: true, upsert: true }).exec()

}
