"use strict"

// Dependencies
import FB from 'fb'

//Models
import { PostModel } from '../model/post'

// Configs
import { fbConf } from '../../config'

FB.options('v2.8') // using latest facebook api
FB.setAccessToken(fbConf.accessToken) // set page access token.

export const PostToFB = (id, content, link, need_approve) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const response = await FB.api(`${fbConf.page.username}/feed`,
        'post', {
        message: content, 
        link: link
      })
      // Puts the PostID into the database after the post is posted to Facebook.
      await PostModel.findOneAndUpdate({ _id: id }, {
        postid: response.id,
        status: { delivered: true, need_approve: need_approve }
      }).exec()

      resolve(response)

    } catch (error) {
      reject(error)
    }
  })
}

export const PostImageToFB = (id, content, picture, need_approve) => {
  return new Promise(async (resolve, reject) => {
    try {

      const response = await FB.api(`${fbConf.page.username}/photos`,
        'post', {
        message: content,
        url: picture
      })
      
      // Puts the PostID and Image into the database after the post is posted to Facebook.
      await PostModel.findOneAndUpdate({ _id: id }, {
        imgLink: picture,
        postid: response.id,
        status: { delivered: true, need_approve: need_approve }
      }).exec()

      resolve(response)

    } catch(error) {
      reject(error)
    }
  })
}
