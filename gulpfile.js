'use script';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var fs = require('fs');
var minimist = require('minimist');
var xmllint = require('xmllint');
var chalk = require('chalk');
var $ = require('gulp-load-plugins')({ lazy: true });
var del = require('del');
var runSequence = require('run-sequence');
var Xml2Js = require('xml2js');

var config = {
  release: './dist'
};

gulp.task('help', $.taskListing.withFilters(function (task) {
  var mainTasks = ['default', 'help', 'serve-static'];
  var isSubTask = mainTasks.indexOf(task) < 0;
  return isSubTask;
}));
gulp.task('default', ['help']);

/** +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ **/

/**
 * Startup static webserver.
 */
gulp.task('serve', function () {
  gulp.src(['app'])
    .pipe(webserver({
      https: true,
      port: '8443',
      host: 'localhost',
      livereload: true,
      open: true,
      directoryListing: false,
      fallback: 'index.html'
    }));
});

/**
 * Removes existing dist folder
 */
gulp.task('dist-remove', function () {
  return del(config.release);
});

/**
 * Copies files to the dist folder
 */
gulp.task('dist-copy-files', function() {
  return gulp.src([
    './app*/**/*',
    './bower_components/**/*',
    './content/**/*',
    './images/**/*',
    './scripts/**/*',
    './manifest-*.xml',
    './index.html',
    './package.json'
  ], { base: './' }).pipe(gulp.dest(config.release));
});

/**
 * Optimizes JavaScript and CSS files
 */
gulp.task('dist-minify', ['dist-minify-js', 'dist-minify-css'], function() {
});

/**
 * Minifies and uglifies JavaScript files
 */
gulp.task('dist-minify-js', function() {
  gulp.src([
    './app*/**/*.js',
    './scripts/**/*', '!./scripts/MicrosoftAjax.js'
  ], { base: './' })
    .pipe($.uglify())
    .pipe(gulp.dest(config.release));
});

/**
 * Minifies and uglifies CSS files
 */
gulp.task('dist-minify-css', function() {
  gulp.src([
    './app*/**/*.css',
    './content/**/*.css'
  ], { base: './' })
    .pipe($.minifyCss())
    .pipe(gulp.dest(config.release));
});

/**
 * Creates a release version of the project
 */
gulp.task('dist', function () {
  runSequence(
    ['dist-remove'],
    ['dist-copy-files'],
    ['dist-minify']
    );
});