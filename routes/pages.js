"use strict";

// Index page
exports.index = function* (next) {
  yield this.render('index_page.html');
  return yield next;
};

// Abuse page
// Need to login first
exports.abuse = function* (next) {
  var id = this.params.postid;
  yield this.render('abuse_page.html', { post_id: id });
  return yield next;
};
