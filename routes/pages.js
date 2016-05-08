'use strict';

exports.index = function* () {
  this.render('index');
};

exports.abuse = function* (id) {
  this.render('abuse', { post_id: id });
};
