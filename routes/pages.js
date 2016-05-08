'use strict';

// Index page
exports.index = function* (next) {
  this.render('index_page');
  return yield next;
};

exports.abuse = function* (next) {
  var id = this.params.postid;
  this.render('abuse_page', { post_id: id });
  return yield next;
};
