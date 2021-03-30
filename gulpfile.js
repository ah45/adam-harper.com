var fs = require('fs');
var gulp = require('gulp');

// utilities
var del = require('del');
var filter = require('gulp-filter');

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


gulp.task('well-known', function () {
  return gulp.src('./src/well-known/**/*', { base: './src/well-known' })
    .pipe(gulp.dest(BUILD_DIR + '/.well-known/'))
  ;
});

gulp.task('cname', function () {
  return gulp.src('./src/CNAME', { base: './src' })
    .pipe(gulp.dest(BUILD_DIR + '/'))
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


gulp.task('nojekyll', function (cb) {
  fs.writeFile(BUILD_DIR + '/.nojekyll', 'contents', cb);
});



/*
 * Asset management
 */


gulp.task('assets:build', gulp.series('css', 'images', 'js'));


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
  gulp.watch('./src/pages/**/*', gulp.series('pages'));
  gulp.watch('./src/scripts/**/*', gulp.series('js'));
  gulp.watch('./src/css/**/*', gulp.series('css'));
  gulp.watch('./src/images/**/*', gulp.series('images'));
  gulp.watch('./src/well-known/**/*', gulp.series('well-known'));
  return;
});


gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('assets:build', 'pages', 'well-known', 'cname'),
  'assets:tag',
  'assets:replace',
  'nojekyll'
));


gulp.task('preview', gulp.series(
  'clean',
  gulp.parallel('assets:build', 'pages', 'well-known'),
  'nojekyll',
  gulp.parallel('serve', 'watch')
));
