"use strict"

import goorl from 'goorl'
import { shortenConf } from '../config'

export default (url) => {
  return new Promise((resolve, reject) => {
    if(!shortenConf.enabled)
      resolve(url)

    const options = {
      key: shortenConf.apiKey,
      url: url
    }
    goorl(options, (error, url) => {
      if (error) {
        reject(error)
      } else {
        resolve(url)
      }
    })
  })
}
