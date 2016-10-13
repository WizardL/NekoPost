"use strict"

// Dependencies
import colors from 'colors'

// FB
import { getPostFromFB } from './fb/post'

// Configurations
import { fbConf } from '../config'

// Models
import { HotModel } from './model/hot'
import { PostModel } from './model/post'

/**
 * Hot posts Daily.
 */

export const updateHotPosts = async () => {
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const post = await PostModel.find({
    "created_on": {
      "$gte": today.getTime(), 
      "$lt": Date.now()
    },
    'status.delivered': true
  }).exec()

  await Promise.all(post.map(async obj => {

    try {
      await HotModel.remove()

      const postData = await getPostFromFB(obj.postid)
      
      const regex = new RegExp(`^#${fbConf.page.name}(\\d+)`)
      const id = regex.exec(obj.content)[1]

      const HotEntity = new HotModel({
        _id: id,
        postid: obj.postid,
        likes: postData.likes,
        shares: postData.shares,
        comments: postData.comments,
        totalScore: postData.totalScore
      })

      await HotEntity.save()

    } catch(error) {
      console.log(`[${'!'.red}]  updateHotPosts failed.\n\n Details: ${error}\n`)
    }

  }))
}
