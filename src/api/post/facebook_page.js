"use strict"

// Dependencies
import shortid from 'shortid'
import FB from 'fb';

import { recaptchaCheck } from '../../auth'
import { siteConf, fbConf } from '../../../config'

// Models
import PostModel from '../../model/post'

export default (router) => {

  router

    .post('/post',
          recaptchaCheck(),
          post_handler)

}

async function post_handler(ctx, next) {
  
  //Verify Content
  if(!ctx.body["content"] || !ctx.body["type"])
    ctx.throw(500, 'Please type the content you want to post.')
  
  FB.setAccessToken(fbConf.accessToken)
  
  const id = await getCount()

  if(fbConf.need_approve === false) {

    const postQuery =  PostModel.findOne(null, 'created_on', { sort: { 'created_on' : -1 } })
    const post = await postQuery.exec()
    if(post === null) {
      var time = 120000
    } else {
      if ((Date.now() - post.created_on) < 120000)
        var time = ((Date.now() - post.created_on) + 120000)
      else
        var time = 120000
    }

    const format = `#${fbConf.page.name}${id}\n📢发文请至 ${siteConf.postUrl()}\n👎举报滥用 ${siteConf.reportUrl()}\n`
    const content = `${format} ${ctx.body["content"]}`

    const PostEntity = new PostModel({ content: content, status: { delivered: false }, ip: ctx.request.ip })
    PostEntity.save()

    setTimeout((async function () { 
      try {
        if (ctx.body["type"] == 'image') {
          //TODO
          response = await FB.api(`${fbconf.page.page_username}/photos`, 'post', { message: content, url: pic })
          PostModel.findOneAndUpdate({ _id: id }, { imgLink: pic, postid: response.postid, status: { delivered: true } }).exec();
        } else {
          const urlregex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/)
          const link = urlregex.exec(ctx.body["content"]) ? urlregex.exec(ctx.body["content"]) : ''
          response = await FB.api(`${fbconf.page.page_username}/feed`, 'post', { message: content, link: link })
          PostModel.findOneAndUpdate({ _id: id }, { postid: response.postid, status: { delivered: true } }).exec();
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

    ctx.body = { success: true, id: id, countdown: msToTime(time)}

  } else {

    const format = `#${fbConf.page.name}${id}\n📢发文请至 ${siteConf.postUrl()}\n👎举报滥用 ${siteConf.reportUrl()}\n`
    const content = `${format} ${ctx.body["content"]}`
    
    const PostEntity = new PostModel({ content: content, status: { delivered: false, need_approve: true }, ip: ctx.request.ip })
    PostEntity.save()

    ctx.body = { success: true, id: id, need_approve: true }

  }
}

function getCount() {
  return new Promise((resolve, reject) => {
    PostModel.nextCount((err, count) => { resolve(count) })
  });
}

function msToTime(s) {

  function addZ(n) {
    return (n<10? '0':'') + n;
  }

  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms;
}