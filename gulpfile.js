var gulp = require('gulp');

// utilities
var del = require('del');
var filter = require('gulp-filter');
var sequence = require('gulp-sequence');

// local preview
var browserSync = require('browser-sync').create();

// html templating
var pug = require('gulp-pug');

// css processing
var postcss = require('gulp-postcss');

// js processing
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

// asset hashing/cache busting
var rev = require('gulp-rev');
var revreplace = require('gulp-rev-replace');
var revdel = require('gulp-rev-delete-original');
var revcssurl = require('gulp-rev-css-url');



/*
 * Constants
 */


const BUILD_DIR = './build';
const ASSET_MANIFEST= 'asset-manifest.json';



/*
 * General purpose tasks
 */


gulp.task('clean', function (done) {
  return del([BUILD_DIR], done);
});


gulp.task('serve', function () {
  browserSync.init({
    open: false,
    port: 8080,
    server: { baseDir: BUILD_DIR },
    files: BUILD_DIR
  });
});



/*
 * Asset generation
 */


gulp.task('css', function () {
  return gulp.src('./src/styles/resume.css', { base: './src' })
    .pipe(postcss())
    .pipe(gulp.dest(BUILD_DIR))
  ;
});


gulp.task('images', function () {
  return gulp.src('./src/images/**/*.{png,jpg,gif,svg,ico}', { base: './src' })
    .pipe(gulp.dest(BUILD_DIR))
  ;
});


gulp.task('js', function () {
  return gulp.src('./src/scripts/**/*.js', { base: './src' })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_DIR))
  ;
});


gulp.task('pages', function () {
  return gulp.src('./src/pages/**/*.pug', { base: './src/pages/' })
    .pipe(pug())
    .pipe(gulp.dest(BUILD_DIR))
  ;
});



/*
 * Asset management
 */


gulp.task('assets:build', ['css', 'images', 'js']);


gulp.task('assets:tag', function () {
  var asset_paths = [ BUILD_DIR + '/**/*.{css,js,png,jpg,gif,svg,ico}' ];

  return gulp.src(asset_paths, { base: BUILD_DIR })
    .pipe(rev())
    .pipe(revcssurl())
    .pipe(revdel())
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(rev.manifest(ASSET_MANIFEST))
    .pipe(gulp.dest(BUILD_DIR))
  ;
});


gulp.task('assets:replace', function () {
  return gulp.src([BUILD_DIR + '/**/*.html'])
    .pipe(revreplace({ manifest: gulp.src(BUILD_DIR + '/' + ASSET_MANIFEST) }))
    .pipe(gulp.dest(BUILD_DIR))
  ;
});



/*
 * Bringing it all together
 */



gulp.task('watch', function () {
  gulp.watch(
    [
      './src/pages/**/*',
      './src/scripts/**/*',
      './src/styles/**/*',
      './src/images/**/*'
    ],
    [
      'pages',
      'js',
      'css',
      'images'
    ]
  );
});


gulp.task('build', sequence(
  'clean',
  ['assets:build', 'pages'],
  'assets:tag',
  'assets:replace'
));


gulp.task('preview', sequence(
  'clean',
  ['assets:build', 'pages'],
  ['serve', 'watch']
));
