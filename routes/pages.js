'use strict';

exports.index = function *() {
  
};

exports.abuse = function *(id) {
  this.render('abuse', { post_id : id });
};
