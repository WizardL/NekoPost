'use strict';

<<<<<<< HEAD
exports.index = function *() {
  
=======
exports.index = function* () {
  this.render('index');
>>>>>>> 5cc228d629e8d7658792aaf385b7e401f0a20025
};

exports.abuse = function* (id) {
  this.render('abuse', { post_id: id });
};
