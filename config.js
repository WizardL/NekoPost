"use strict"

//URL Related
export const siteConf = {
   siteUrl  : 'http://localhost:3000/'                     , // eg: http://meow.com/
   postUrl  : function() { return `${this.siteUrl}` }      , // eg: http://meow.com/
   reportUrl: function() { return `${this.siteUrl}abuse/` }, // eg: http://meow.com/abuse/
 }

// Admin email
export const adminEmail = [
  "jonathan.goh333@gmail.com",
  "zypeh.geek@gmail.com"     ,
]

// Database related
export const development = 'mongodb://localhost/misato-dev'
export const production  = 'mongodb://localhost/misato-prod'
export const test        = 'mongodb://localhost/misato-test'

// Recaptcha related
export const recaptcha_development = { key: '', secret: '' }
export const recaptcha_prodution   = { key: '', secret: '' }
export const recaptcha_test        = { key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' } //test key from https://developers.google.com/recaptcha/docs/faq

// Facebook related
export const fbConf = {
  appId    : 'facebook-app-id-here'    ,
  appSecret: 'facebook-app-secret-here',
  accessToken: '',
  page: {
    name    : '匿名独中', //Facebook Page Name eg: 靠北工程师
    username: 'AnonChungHwa'     , //Facebook Page Username eg: kobeengineer
  },
  need_approve: false, //Post need admin to approve before posted. 
}

// Bitly related
export const bitlyConf = {
  enabled : true, //Enable bitly or not.
  apikey  : '',   //Bitly API KEY
}
