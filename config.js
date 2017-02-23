'use strict'

// URL Related
export const siteConf = {
  siteUrl: 'http://localhost:3000/', // eg: http://meow.com/
  postUrl() {
    return `${this.siteUrl}` // eg: http://meow.com/
  },
  reportUrl() {
    return `${this.siteUrl}abuse/` // eg: http://meow.com/abuse/
  }
}

// Admin email
export const adminEmail = [
  'zypeh.geek@gmail.com',
  'jonathan.goh333@gmail.com'
]

// Database related
export const dbDev = 'mongodb://localhost/misato-dev'
export const dbProd = 'mongodb://localhost/misato-prod'
export const dbTest = 'mongodb://localhost/misato-test'

// Recaptcha related
export const recaptchaDev = { key: '', secret: '' }
export const recaptchaProd = { key: '', secret: '' }
export const recaptchaTest = { key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' } // test key from https://developers.google.com/recaptcha/docs/faq

// Facebook related
export const fbConf = {
  appId: 'facebook-app-id-here',
  appSecret: 'facebook-app-secret-here',
  accessToken: '',
  page: {
    name: '匿名独中', // Facebook Page Name eg: 靠北工程师
    username: 'AnonChungHwa' // Facebook Page Username eg: kobeengineer
  },
  commentPage: { // Write/Post an anonymous comment as a page
    'EXAMPLE PAGE': 'EXAMPLE PAGE TOKEN'
  },
  need_approve: false // Post need admin to approve before posted.
}

// Shorten related
export const shortenConf = {
  enabled: true, // Enable google short url or not.
  apiKey: 'google-short-url-api-here' // Google Short Url API https://code.google.com/apis/console
}
