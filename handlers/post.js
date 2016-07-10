"use strict";

//Dependencies
import mongoose from 'mongoose'
import * as recaptcha from 'recaptcha-validator'
import { recaptcha_development, recaptcha_test, recaptcha_production } from '../config'
const RecaptchaConfig = (process.env.NODE_DEV == 'production') ? recaptcha_production : ((process.env.NODE_DEV == 'development') ? recaptcha_development : recaptcha_test)

//Models
import { Post } from '../models/post'

export async function (ctx,next) {
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
  
  await next();
};
