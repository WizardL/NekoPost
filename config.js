"use strict"

//Site URL
export const siteUrl   = '' // eg: http://meow.com/
export const postUrl   = `${siteUrl}` // eg: http://meow.com/
export const reportUrl = `${siteUrl}abuse/` // eg: http://meow.com/abuse/

//Admin email
export const email = ["jonathan.goh333@gmail.com", "zypeh.geek@gmail.com"]

// Database related
export const development = 'mongodb://localhost/misato-dev'
export const production  = 'mongodb://localhost/misato-prod'
export const test        = 'mongodb://localhost/misato-test'

// Recaptcha related
export const recaptcha_development = { key: '', secret: '' }
export const recaptcha_prodution   = { key: '', secret: '' }
export const recaptcha_test        = { key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' } //test key from https://developers.google.com/recaptcha/docs/faq

// Facebook related
export const appId         = ''
export const appSecret     = ''
export const page_username = ''
export const need_approve  = false //Post need admin to approve before posted.

//Bitly related
export const bitly_enabled  = true //Enable bitly or not.
export const bitly_username = ''   //Bitly username
export const bitly_apikey   = ''   //Bitly API KEY