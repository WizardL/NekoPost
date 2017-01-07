'use strict'

// Dependencies
import FB from 'fb'

// Models
import { PostModel } from '../model/post'

// Configurations
import { fbConf } from '../../config'

FB.options('v2.8') // using latest facebook api
FB.setAccessToken(fbConf.accessToken) // set page access token.

/**
 * Post text to FB.
 * @function
 * @param {number} id - Post No.
 * @param {string} content - The content you want to post.
 * @param {string} link - External link on post.
 * @param {boolean} need_approve - The post need to moderate by admin or not.
 */
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

/**
 * Post Text & Image to FB.
 * @function
 * @param {number} id - Post No.
 * @param {string} content - The content you want to post.
 * @param {string} picture - Link of picture.
 * @param {boolean} need_approve - The post need to moderate by admin or not.
 */
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
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Comment on Post.
 * @function
 * @param {number} postid - ID of FB Post.
 * @param {string} content - The content you want to post.
 * @param {string} pageToken - FB Page Access Token
 */
export const CommentOnPost = (postid, content, pageToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      FB.setAccessToken(pageToken)
      await FB.api(`${postid}/comments`,
        'post', {
          message: content
        })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get the amount of the likes, comments, reactions and shares in the post
 * @function
 * @param {number} postid - ID of Facebook Post.
 */
export const getPostFromFB = (postid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await FB.api(`${postid}?fields=shares, likes.summary(true), comments.summary(true), reactions.summary(true)`)

      const post = {
        likes: (response.likes.summary.total_count + response.reactions.summary.total_count),
        shares: (response.shares) ? response.shares.count : 0,
        comments: response.comments.summary.total_count
      }

      post.totalScore = post.likes + (post.comments * 2) + post.shares

      resolve(post)
    } catch (error) {
      reject(error)
    }
  })
}
