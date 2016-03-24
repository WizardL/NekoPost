var views = require('koa-views');

module.exports = views(__dirname + '/../views', {
  map: {html: 'nunjucks'}
});
