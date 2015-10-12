var _ = require('underscore');
var assets  = require('postcss-assets');
var autoprefixer = require('autoprefixer-core');
var es = require('event-stream');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var ngAnnotate = require('gulp-ng-annotate');
var postcss = require('gulp-postcss');
var rjs = require('gulp-requirejs');
var sass = require('gulp-sass');
var spawn = require('child_process').spawn;
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');

var handleError = function (err) {
  console.log(err.name, ' in ', err.plugin, ': ', err.message);
  console.log(err.getStack());
  process.exit(1);
};

var buildTarget = 'www';
var forRelease = false;

// Copy
gulp.task('copyjsDev', function () {
  return es.concat(
    gulp.src(['source/js/**/*.js', '!source/js/**/*.r.js', '!source/js/*.js' ])
      .pipe(gulp.dest(buildTarget + '/js/')),
    gulp.src(['source/js/config-require.js'])
      .pipe(  gulpif(forRelease, uglify().on('error', handleError) ) )
      .pipe(gulp.dest(buildTarget + '/js'))
  );
});


// Copy
gulp.task('copyConfig', function () {
  return es.concat(
    gulp.src(['source/js/config-require.js'])
      .pipe(gulp.dest(buildTarget + '/js/'))
  );
});

// Copy
gulp.task('copyjsVendor', function () {
  return es.concat(
    // copy vendor files
    gulp.src(['source/vendor/requirejs/require.js'])
      .pipe(gulp.dest(buildTarget + '/vendor/requirejs')),
    // copy locale files
    gulp.src(['source/vendor/angular-i18n/*.js'])
      .pipe(gulp.dest(buildTarget + '/vendor/angular-i18n/'))
  );
});

// Copy
gulp.task('copyMockAPI', function () {
  gulp.src(['source/mockAPI/**/*'])
    .pipe(gulp.dest(buildTarget + '/mockAPI'));
});

// Copy
gulp.task('share', function () {
  gulp.src(['source/js/**/*_SHARED/**/*'])
    .pipe(gulp.dest('_share'));
});


// Copy
gulp.task('copyHtml', function () {
  return es.concat(
    // update index.html to work when built
    gulp.src(['source/_index.html'])
      .pipe(rename('index.html'))
      .pipe(gulp.dest(buildTarget)),
    // copy template files
    gulp.src(['source/js/**/*.html'])
      .pipe(gulp.dest(buildTarget + '/js'))
  )
});

gulp.task('copyJson', function(){
  return es.concat(
    // copy json
    gulp.src(['source/js/**/*.json'])
      .pipe(gulp.dest(buildTarget + '/js'))
      );
});

// JavaScript
gulp.task('js', function () {
  var configRequire = require('./source/js/config-require.js');
  var configBuild = {
    baseUrl: 'source',
    insertRequire: ['js/main'],
    name: 'js/main',
    optimize: 'none',
    wrap: true
  };
  var config = _(configRequire).extend(configBuild);

  return gulp.src(['source/js/main.js'])
    .pipe(rjs(config).on('error', handleError))
    .pipe(gulpif( forRelease, ngAnnotate())  )
    .pipe(  gulpif(forRelease, uglify().on('error', handleError) ) )
    .pipe(gulp.dest(buildTarget + '/js/'));
});

gulp.task('copyAssets', function () {
  return es.concat(
    gulp.src(['source/js/_global-resources/assets/**/*'])
      .pipe(gulp.dest(buildTarget + '/assets')),
    gulp.src(['source/vendor/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eof,svg}'])
      .pipe(gulp.dest(buildTarget + '/assets/fonts')),
    gulp.src(['source/vendor/bootstrap/dist/css/bootstrap.css'])
      .pipe(gulp.dest(buildTarget + '/assets/css/'))

  )
});

gulp.task('sass', function () {
  var processors = [
    assets({
      basePath: 'source/js/_global-resources/',
      loadPaths: ['assets/fonts/', 'assets/images/']
    }),
    autoprefixer
  ];

  return gulp.src(['source/sass/*.scss', '!source/sass/_*.scss'])
    .pipe(gulpif( forRelease,  sass({
      outputStyle: 'compressed'
    }).on('error', handleError)) )
    .pipe(gulpif( !forRelease, sass()) )
    .pipe(postcss(processors).on('error', handleError))
    .pipe(gulp.dest('source/js/_global-resources/assets/css'));
});


gulp.task('browser-sync', function () {
    browserSync({
      open: gutil.env.open === 'true',
      port: 9955,
      server: {
        baseDir: buildTarget + ''
      }
    });
});


gulp.task('bs-reload', function () {
  browserSync.reload();
});


gulp.task('serve', ['copyAssets', 'sass', 'js', 'copyjsDev', 'copyMockAPI', 'copyjsVendor', 'copyHtml','copyJson'], function () {

  gulp.run('browser-sync');

  gulp.watch(
    'source/sass/**/*.scss', ['sass']);

  gulp.watch([
    'source/js/_global-resources/assets/**/*'
  ],['copyAssets','bs-reload']);

  gulp.watch([
    'source/js/**/*.json'
  ],['copyJson', 'bs-reload']);

  gulp.watch([
    'source/js/**/*.js',
    '!source/js/**/*.r.js',
    '!source/js/*.js',
  ],['copyjsDev', 'bs-reload']);

  gulp.watch([
    'source/js/config-require.js'
  ],['copyConfig','js', 'bs-reload']);

  gulp.watch([
    'source/js/*.js' , 'source/js/**/*.r.js'
  ],['js', 'bs-reload']);

  gulp.watch([
    'source/index.html',
    'source/js/**/*.html'
  ],['copyHtml', 'bs-reload']);

});

gulp.task('release', function (callback) {
  buildTarget = 'release';
  forRelease = true;

  runSequence(
      'copyAssets',
      'sass',
      'js',
      'copyjsDev',
      'copyjsVendor',
      'copyHtml',
      'copyJson',
    callback);
});


gulp.task('default', ['serve'], function () {

});
