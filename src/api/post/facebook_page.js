"use strict"

// Dependencies
import FB from 'fb'
import shorten from '../../shorten'
import FBNotify from '../../fb/notify'

import { recaptchaCheck } from '../../auth'
import { siteConf, fbConf, shortenConf } from '../../../config'

// Models
import { IDModel, PostModel } from '../../model/post'

export default (router) => {

  router

    .post('/post',
          //recaptchaCheck(),
          post_handler)

}

async function post_handler(ctx, next) {
  
  // Verify Content
  if(!ctx.request.fields["content"] || !ctx.request.fields["type"])
    ctx.throw('Please type the content you want to post.')

  FB.options('v2.8') // using latest facebook api
  FB.setAccessToken(fbConf.accessToken)

  if(fbConf.need_approve === false) {

    const time = await getTimeout()
    const id = await getCount('Post')

    const formatID = await getCount('ID')

    let post_url, report_url
    [post_url, report_url] = await Promise.all([shorten(siteConf.postUrl()), shorten(`${siteConf.reportUrl()}${formatID}`)])

    const format = `#${fbConf.page.name}${formatID}\n`+
    `📢发文请至 ${post_url}\n`+
    `👎举报滥用 ${report_url}\n\n`
    const content = `${format}${ctx.request.fields["content"]}`

    const PostEntity = new PostModel({ content: content,
      status: { 
        delivered: false,
        need_approve: false 
      },
      ip: ctx.request.ip
    })
    await PostEntity.save()

    const IDEntity = new IDModel({ id: id })
    await IDEntity.save()

    setTimeout((async () => { 
      try {
        // If post got image.
        if (ctx.request.fields["type"] == 'image') {
          // The following code is for posting a image to a Facebook page
          const response = await FB.api(`${fbConf.page.username}/photos`,
            'post', {
              message: content,
              url: pic
            })
          
          const IDEntity = new IDModel({ id: id })
          await IDEntity.save()
          
          // Puts the PostID and Image into the database after the post is posted to Facebook.
          await PostModel.findOneAndUpdate({ _id: id }, {
            imgLink: pic,
            postid: response.postid,
            status: { delivered: true }
          }).exec()

        } else { // If post don't have image.

          // URL Matching
          const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
          const link = urlregex.exec(ctx.request.fields["content"]) ? urlregex.exec(ctx.request.fields["content"])[0] : ''

          // The following code is for posting a post to a Facebook page 
          const response = await FB.api(`${fbConf.page.username}/feed`,
             'post', {
              message: content, 
              link: link
            })

          // Puts the PostID into the database after the post is posted to Facebook.
          await PostModel.findOneAndUpdate({ _id: id }, {
            postid: response.postid,
            status: { delivered: true }
          }).exec()
          
        }

      } catch(error) {
        console.log(error)
      }
    }), time)

    ctx.body = {
      success: true, 
      id: id,
      countdown: msToTime(time) 
    }

  } else {

    const id = await getCount('Post')
    const content = `${ctx.request.fields["content"]}`
    
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

      if(post === null) {
        resolve(120000)
        return
      }

      const postDate = new Date(post.created_on)
      const millisecond = postDate.getTime()

      PostModel.find({ status: {
        delivered: false,
        need_approve: false
      }})
        .count((err, count) => {

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
