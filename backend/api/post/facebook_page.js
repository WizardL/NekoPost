'use strict'

// Dependencies
import uuid from 'uuid'
import shorten from '../../shorten'

// FB
import FBNotify from '../../fb/notify'
import { PostToFB, PostImageToFB } from '../../fb/post'

// Recaptcha check.
import { recaptchaCheck } from '../../auth'

// Configurations
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
  // Verify Content
  if (!ctx.request.fields['content'] || !ctx.request.fields['type'])
    ctx.throw('Please type the content you want to post.')

  // Check text length.
  checkLength(ctx, ctx.request.fields['content'])

  if (fbConf.need_approve === false) {
    // Get timeout time.
    const time = await getTimeout()

    const postKey = `${uuid.v4()}-${uuid.v4()}`
    const id = await getCount('ID')

    let post_url, report_url
    [post_url, report_url] = await Promise.all([shorten(siteConf.postUrl()), shorten(`${siteConf.reportUrl()}${id}`)]) // shorten url

    // Post format.
    const format = `#${fbConf.page.name}${id}\n` +
    `📢发文请至 ${post_url}\n` +
    `👎举报滥用 ${report_url}\n\n`
    const content = `${format}${ctx.request.fields['content']}`

    // Puts the content into database.
    const PostEntity = new PostModel({ _id: postKey,
      content: content,
      status: {
        delivered: false,
        need_approve: false
      },
      ip: ctx.request.ip
    })
    await PostEntity.save()

    setTimeout((async () => {
      try {
        // If post got image.
        if (ctx.request.fields['type'] == 'image' && ctx.request.files['image']) {
          const fileName = ctx.request.files['image'].name
          if (!checkFileExt(fileName))
            ctx.throw('File is not supported.')

          const picture = `${siteConf.siteUrl}public/temp/upload_${ctx.request.files['images'].path.split('upload_')}`
          // The following code is for posting a image to a Facebook page
          await PostImageToFB(postKey, content, picture, false)

          // Save the hashtag id into database.
          const IDEntity = new IDModel({ postKey: postKey })
          await IDEntity.save()

          // Notify user the post is posted successfully
          if (ctx.isAuthenticated() && ctx.request.fields['notify'] == 'true')
            FBNotify(ctx.state.user.id, 'Your post is posted successfully.', `/post/${id}`)
        } else {
          // If post don't have image.

          // URL Matching
          const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
          const link = urlregex.exec(ctx.request.fields['content']) ? urlregex.exec(ctx.request.fields['content'])[0] : ''

          // The following code is for posting a post to a Facebook page
          await PostToFB(postKey, content, link, false)

          // Save the hashtag id into database.
          const IDEntity = new IDModel({ postKey: postKey })
          await IDEntity.save()

          // Notify user the post is posted successfully
          if (ctx.isAuthenticated() && ctx.request.fields['notify'] == 'true')
            await FBNotify(ctx.state.user.id, 'Your post is posted successfully.', `/post/${id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }), time)

    ctx.body = {
      success: true,
      data: {
        id: id,
        countdown: msToTime(time)
      }
    }
  } else {
    // If post need approve.

    const postKey = `${uuid.v4()}-${uuid.v4()}`
    const content = `${ctx.request.fields['content']}`

    const notify = (ctx.isAuthenticated() && ctx.request.fields['notify'] == 'true') ? ctx.state.user.id : '0'

    if (ctx.request.fields['type'] == 'image' && ctx.request.files['image']) {
      const fileName = ctx.request.files['image'].name
      if (!checkFileExt(fileName))
        ctx.throw('Not supported file.')

      const picture = `${siteConf.siteUrl}public/temp/upload_${ctx.request.files['images'].path.split('upload_')}`

      // Puts the content and image into database.
      const PostEntity = new PostModel({ _id: postKey,
        content: content,
        imgLink: picture,
        status: {
          delivered: false,
          need_approve: true
        },
        ip: ctx.request.ip,
        notify: notify
      })

      await PostEntity.save()
    } else {
      // Puts the content into database.
      const PostEntity = new PostModel({ _id: postKey,
        content: content,
        status: {
          delivered: false,
          need_approve: true
        },
        ip: ctx.request.ip,
        notify: notify
      })

      await PostEntity.save()
    }

    ctx.body = {
      success: true,
      data: {
        postKey: postKey,
        need_approve: true
      }
    }
  }
}

const getCount = (model) => {
  return new Promise((resolve, reject) => {
    if (model === 'ID')
      IDModel.nextCount((err, count) => {
        if (err)
          reject(err)
        resolve(count)
      })
    else
      PostModel.nextCount((err, count) => {
        if (err)
          reject(err)
        resolve(count)
      })
  })
}

const getTimeout = () => {
  return new Promise((resolve, reject) => {
    PostModel.findOne().sort('-created_on').exec((err, post) => {
      if (err)
        reject(err)

      if (post === null) {
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
        if (err)
          reject(err)

        if ((Date.now() - millisecond) < 120000)
          resolve(120000 * (count + 1))
        else
          resolve(120000)
      })
    })
  })
}

const checkFileExt = (fileName) => {
  const acceptExt = [
    'jpg',
    'jpeg',
    'png',
    'pneg',
    'bmp',
    'gif'
  ]
  if (!acceptExt.includes(fileName.split('.')[fileName.split('.').length - 1].toLowerCase()))
    return false
  return true
}

const checkLength = (ctx, text) => {
  if (text.length > 1024)
    ctx.throw('You have reached your maximum limit of characters allowed.')
}

const msToTime = (s) => {
  const addZ = (n) => {
    return (n < 10 ? '0' : '') + n
  }

  const ms = s % 1000
  s = (s - ms) / 1000
  const secs = s % 60
  s = (s - secs) / 60
  const mins = s % 60
  const hrs = (s - mins) / 60

  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms
}
