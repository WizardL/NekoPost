"use strict"

// Dependencies
import shortid from 'shortid'
import Random from 'random-js'
import FB from 'fb'

import { recaptchaCheck } from '../../auth'
import { siteConf, fbConf } from '../../../config'

// Models
import { IDModel, PostModel } from '../../model/post'

export default (router) => {

  router

    .post('/post',
          recaptchaCheck(),
          post_handler)

}

async function post_handler(ctx, next) {
  
  //Verify Content
  if(!ctx.request.fields["content"] || !ctx.request.fields["type"])
    ctx.throw(500, 'Please type the content you want to post.')

  FB.setAccessToken(fbConf.accessToken)

  if(fbConf.need_approve === false) {

    const time = await getTimeout()
    const id = await getCount('Post')

    const formatID = await getCount('ID')

    const format = `#${fbConf.page.name}${formatID}\n`+
    `📢发文请至 ${siteConf.postUrl()}\n`+
    `👎举报滥用 ${siteConf.reportUrl()}\n`
    const content = `${format}${ctx.request.fields["content"]}`

    const PostEntity = new PostModel({ content: content,
      status: { delivered: false },
      ip: ctx.request.ip
    })
    PostEntity.save()

    setTimeout((async () => { 
      try {
        // If post got image.
        if (ctx.request.fields["type"] == 'image') {
          // The following code is for posting a image to a Facebook page
          const response = await FB.api(`${fbconf.page.page_username}/photos`,
          'post', {
            message: content,
            url: pic
          })
          
          const IDEntity = new IDModel({ id: id })
          await IDEntity.save()
          
          // Puts the PostID and Image into the database after the post is posted to Facebook.
          await PostModel.findOneAndUpdate({ _id: id },{
            imgLink: pic,
            postid: response.postid, 
            status: { delivered: true } 
          }).exec()

        } else { // If post don't have image.

          // URL Matching
          const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
          const link = urlregex.exec(ctx.request.fields["content"]) ? urlregex.exec(ctx.request.fields["content"]) : ''

          // The following code is for posting a post to a Facebook page 
          const response = await FB.api(`${fbconf.page.page_username}/feed`,
          'post', {
            message: content, 
            link: link 
          })

          const IDEntity = new IDModel({ id: id })
          await IDEntity.save()

          // Puts the PostID into the database after the post is posted to Facebook.
          await PostModel.findOneAndUpdate({ _id: id }, {
            postid: response.postid,
            status: { delivered: true }
          }).exec()
          
        }


      } catch(error) {
        if(error.response.error.code === 'ETIMEDOUT') {
          console.log('request timeout')
          ctx.throw('request timeout')
        } else {
          console.log('error', error.message)
          ctx.throw(error.message)
        }
      }
    }), time)

    ctx.body = {
      success: true, 
      id: id,
      countdown: msToTime(time) 
    }

  } else {

    const formatID = await getCount('ID')
    const format = `#${fbConf.page.name}${formatID}\n`+
    `📢发文请至 ${siteConf.postUrl()}\n`+
    `👎举报滥用 ${siteConf.reportUrl()}\n`
    const content = `${format}${ctx.request.fields["content"]}`
    
    const PostEntity = new PostModel({ content: content, 
      status: { 
        delivered: false, 
        need_approve: true 
      }, 
      ip: ctx.request.ip 
    })
    await PostEntity.save()

    ctx.body = {
      success: true, 
      id: id, 
      need_approve: true 
    }

  }
}

const getCount = (model) => {
  return new Promise((resolve, reject) => {
    if(model === 'ID')
      IDModel.nextCount((err, count) => { resolve(count) })
    else
      PostModel.nextCount((err, count) => { resolve(count) })
  })
}

const getTimeout = () => {
  return new Promise((resolve, reject) => {
    PostModel.findOne().sort('-created_on').exec((err, post) => {

      if(!post)
        resolve(120000)

      const postDate = new Date(post.created_on)
      const millisecond = postDate.getTime()

      PostModel.find({ status: { delivered: false } }).count((err, count) => {

        if((Date.now() - millisecond) < 120000)
          resolve(120000 * (count + 1))
        else
          resolve(120000)

      })

    })
  })
}

const msToTime = (s) => {

  const addZ = (n) => {
    return (n<10? '0':'') + n
  }

  const ms = s % 1000
  s = (s - ms) / 1000
  const secs = s % 60
  s = (s - secs) / 60
  const mins = s % 60
  const hrs = (s - mins) / 60

  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms

}
