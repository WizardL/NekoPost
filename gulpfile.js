'use strict';

// Dependencies
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var named = require('vinyl-named');

var appList = ['app'];

/**
 * @private
 */
function mapFiles(list, extname) {
  list.map(function(app) {
    return 'app/' + app + '.' + extname
  })
};

/**
 * @private
 */
function Config(opt) {
  var config = {
    module: {
      loaders: [{ loader: 'vue'}]
    }
  }
  if (!opt) return config
  for (var i in opt) {
    config[i] = opt
  }
  return config
}

gulp.task('default', ['bundle'], function() {
  return gulp.src(mapFiles(appList, 'js'))
    .pipe(named())
    .pipe(webpack(Config()))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  return gulp.src(mapFiles(appList, 'js'))
    .pipe(named())
    .pipe(webpack(Config({watch: true})))
    .pipe(gulp.dest('dist/'));
})
