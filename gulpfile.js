'use strict';

var argv = require('yargs').argv;
var connect = require('gulp-connect');
var cssmin = require('gulp-cssmin');
var data = require('gulp-data');
var del = require('del');
var env = require('gulp-env');
var imagemin = require('gulp-imagemin');
var fs = require('fs');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gulpkss = require('gulp-kss');
var gulpWebpack = require('webpack-stream');
var gutil = require("gulp-util");
var jshint = require('gulp-jshint');
var jsonSass = require('json-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var pngquant = require('imagemin-pngquant');
var prettify = require('gulp-prettify');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var CONFIG = require('./build-config.js');

var SHOULD_WATCH = false;
var USE_SERVER = argv[CONFIG.SERVE_FLAG];
var IS_PROD = argv[CONFIG.PROD_FLAG];

gulp.task('sass', ['distributeConfig'], function () {
  del(['web/styles/*']);
  return gulp
    .src(CONFIG.SASS.INPUT)
    .pipe(plumber({
        errorHandler: function (err) {
            gutil.log(err);
            gutil.beep();
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(CONFIG.SASS.OPTIONS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(CONFIG.SASS.OUTPUT))
    .pipe(gulpif(USE_SERVER,connect.reload()));
});

// @TODO: This sass lint plugin throws errors in indentor.
// Try this out down the road and see if the error has been fixed
//
// gulp.task('trySassLint', function () {
//   if (!IS_PROD) {
//     gulp.src(CONFIG.SASS.INPUT)
//       .pipe(sassLint())
//       .pipe(sassLint.format())
//       .pipe(sassLint.failOnError())
//     }
// });

gulp.task('webpack', ['distributeConfig', 'tryJsHint'], function(callback) {
  del(['web/js/*']);
  var webpackconfig = require('./webpack-config.js');
  var callback = function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
        // output options
    }));
  }
  // run webpack
  return gulp.src(CONFIG.JS.INPUT)
    .pipe(gulpWebpack(webpackconfig, webpack, callback))
    .pipe(gulp.dest(CONFIG.JS.OUTPUT_DIR))
    .pipe(gulpif(USE_SERVER, connect.reload()));
});

gulp.task('tryJsHint', function() {
  if (!IS_PROD) {
    return gulp.src(CONFIG.JS.INPUT_GLOB)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  }
});

gulp.task('templates', ['distributeConfig'], function () {
  nunjucksRender.nunjucks.configure(['src/'], {watch: false});
  del(['web/*.html']);
  var env = 'DEV';
  if (IS_PROD) {
    env = 'PROD';
  }
  delete require.cache[require.resolve(CONFIG.DATA.INPUT)]; // clear the json from cache before loading
  return gulp.src('src/pages/*.html')
    .pipe(data(function() {
        return require(CONFIG.DATA.INPUT);
    }))
    .pipe(data(function() {
        return {
          "CSS_BUNDLE_MODERN": CONFIG.TEMPLATE_PATHS.CSS.MODERN[env],
          "CSS_BUNDLE_LEGACY": CONFIG.TEMPLATE_PATHS.CSS.LEGACY[env],
          "JS_BUNDLE": CONFIG.TEMPLATE_PATHS.JS[env]
        };
    }))
    .pipe(nunjucksRender())
    .pipe(prettify({indent_size: 4}))
    .pipe(gulp.dest('web'))
    .pipe(gulpif(USE_SERVER, connect.reload()));
});

gulp.task('setWatchToTrue', function() {
  SHOULD_WATCH = true;
});

gulp.task('copyMedia', function() {
  del([CONFIG.MEDIA.OUTPUT]).then(function() {
    gulp.src(CONFIG.MEDIA.INPUT)
      .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
      .pipe(gulp.dest(CONFIG.MEDIA.OUTPUT))
      .pipe(gulpif(USE_SERVER, connect.reload()));
  });
});

gulp.task('distributeConfig', function() {
  // output scss variables
  fs.createReadStream(CONFIG.SHARED_CONFIG.INPUT)
  .pipe(jsonSass({
    prefix: '$SHARED_CONFIG: ',
  }))
  .pipe(fs.createWriteStream(CONFIG.SHARED_CONFIG.OUTPUT.SCSS.DIR+CONFIG.SHARED_CONFIG.OUTPUT.SCSS.FILE));
  // output js variables
  gulp.src(CONFIG.SHARED_CONFIG.INPUT)
    .pipe(rename(CONFIG.SHARED_CONFIG.OUTPUT.JS.FILE))
    .pipe(gulp.dest(CONFIG.SHARED_CONFIG.OUTPUT.JS.DIR));
});

gulp.task('tryConnect', function () {
  if (USE_SERVER) {
      connect.server({
        root: ['web'],
        port: CONFIG.CONNECT.PORT_NUMBER,
        livereload: CONFIG.CONNECT.LIVE_RELOAD
      });
    }
});

gulp.task('watch', ['setWatchToTrue', 'build', 'tryConnect'], function() {
  // setup up watches
  gulp.watch(CONFIG.SASS.INPUT, ['sass']);
  gulp.watch(CONFIG.JS.INPUT_GLOB, ['webpack']);
  gulp.watch(CONFIG.HTML.INPUT_ALL, ['templates']);
  gulp.watch(CONFIG.DATA.INPUT, ['templates']);
  gulp.watch(CONFIG.MEDIA.INPUT, ['copyMedia']);
  gulp.watch(CONFIG.SHARED_CONFIG.INPUT, ['distributeConfig', 'sass', 'webpack', 'templates']);
});

gulp.task('build', ['tryJsHint', 'distributeConfig', 'sass', 'webpack', 'templates', 'copyMedia', 'tryConnect'], function() {
  if (IS_PROD) {
    // uglify js
    gulp
      .src(CONFIG.JS.OUTPUT_DIR + CONFIG.JS.OUTPUT_FILE)
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(CONFIG.JS.OUTPUT_DIR));
    // minify css
    gulp.src(CONFIG.SASS.OUTPUT + '/*.css')
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(CONFIG.SASS.OUTPUT));
    }
});

gulp.task('default', ['build']);