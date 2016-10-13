// Models
import { HotModel } from '../../model/hot'

export default (router) => {

  router

    .get('/post/hot', // hot posts daily
         hot_handler)

}


async function hot_handler(ctx, next) {
  const pages = ctx.query["pages"]
  const limitPageResult = ctx.query["limitPageResult"] ? ctx.query["limitPageResult"] : 20

  const hot = await HotModel.find({
    _id: { $in: postKey },
    'status.delivered' : true
  })
  .sort('-totalScore')
  .skip(pages > 0 ? ((pages - 1) * limitPageResult) : 0)
  .limit(limitPageResult)
  .select('postid')
  .exec()

  ctx.body = { success: true, results: hot }
}
