"use strict"

// Database related
export const development = 'mongodb://localhost/misato-dev'
export const production  = 'mongodb://localhost/misato-prod'
export const test        = 'mongodb://localhost/misato-test'

// Recaptcha related
export const recaptcha_development = { key: '', secret: '' }
export const recaptcha_prodution   = { key: '', secret: '' }
export const recaptcha_test        = { key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' } //test key from https://developers.google.com/recaptcha/docs/faq