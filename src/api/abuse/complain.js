"use strict"

export default (router) => {

  router

    .get('/abuse/:postid',
         complain_handler)

}

async function complain_handler (ctx, next) {
  //Verify Recatpcha
  try {
    if (!ctx.body["g-recaptcha-response"]) {
      ctx.throw(500, 'Please remember to complete the human verification.')
      return;
    }
    await recaptcha.promise(RecaptchaConfig.secret, this.body["g-recaptcha-response"], ctx.request.ip);
    ctx.body = { msg: 'Good!' };
  } catch (err) {
    if (typeof err === 'string')
      ctx.throw(500, err);
    else
      ctx.throw(500, err);
  }
  
  // TODO
}
