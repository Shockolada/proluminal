var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var include = require('gulp-file-include');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var replace = require("gulp-replace");
var minify = require("gulp-csso");
var minifyJS = require('gulp-uglify');
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var imagemin = require("gulp-imagemin");
var svgssprite = require("gulp-svgstore");
var spriteSmith = require("gulp.spritesmith");
var merge = require('merge-stream');
var del = require("del");
var run = require("run-sequence");



/*---------------------------------------------------*/
/*	MAIN TASKS
/*---------------------------------------------------*/

/* HTML */
gulp.task('html', done => {
  gulp.src('source/*.html')
    .pipe(plumber())
    .pipe(include())
    .pipe(gulp.dest('build'))
  done();
});

/* STYLES */
gulp.task('styles', done => {
  gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        cascade: false
      })
    ]))
    // .pipe(replace('/**/', ''))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
  done();
});

/* JAVASCRIPT */
gulp.task('js', done => {
  gulp.src('source/js/main.js')
    .pipe(plumber())
    .pipe(include())
    .pipe(minifyJS())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('build/js'))
  done();
});

/* SERVER */
gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('styles')).on('change', server.reload);
  gulp.watch('source/blocks/**/*.{scss,sass}', gulp.series('styles')).on('change', server.reload);
  gulp.watch('source/**/*.html', gulp.series('html')).on('change', server.reload);
  gulp.watch('source/js/**/*.js', gulp.series('js')).on('change', server.reload);
});


/* COPY FILES FROM SOURCE */
gulp.task('copy', function () {
  return gulp.src([
      'source/fonts/**/*.{woff,woff2}',
      'source/img/**',
      'source/*.ico'
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
});

/* REMOVE OLD BUILD */
gulp.task('clean', function () {
  return del('build');
});

/* MAKE BUILD */
gulp.task('build', gulp.series('clean', 'styles', 'copy', 'html', 'js', 'server', function (done) {
  done();
}));



/*---------------------------------------------------*/
/*	SPRITES
/*---------------------------------------------------*/


/* PNG SPRITES */

gulp.task('pngsprite', function () {
  var spriteData = gulp.src('source/images/icons/**/*.png').pipe(spriteSmith({
    imgName: 'sprite.png',
    imgPath: "../img/sprites/sprite.png",
    retinaImgName: 'sprite@2x.png',
    retinaSrcFilter: 'source/images/icons/**/*/*@2x.png',
    retinaImgPath: "../img/sprites/sprite@2x.png",
    cssName: 'sprite.scss',
    algorithm: 'binary-tree',
    // cssTemplate: 'handlebarsInheritance.scss.handlebars',
    padding: 8
  }));

  var cssStream = spriteData.css.pipe(gulp.dest('source/sass/mixins'));
  var imgStream = spriteData.img.pipe(gulp.dest('source/images/sprites'));

  return merge(imgStream, cssStream);
});


/* SVG SPRITES */

gulp.task("svgsprite", function () {
  return gulp.src("source/images/icons/**/*.svg")
    .pipe(svgssprite({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/images/sprites"));
});


/* MINIFY IMAGES */

gulp.task("imagesmin", function () {
  return gulp.src("source/images/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: false
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest("source/img"));
});


/* IMAGES */

gulp.task('images', gulp.series('pngsprite', 'svgsprite', 'imagesmin', function (done) {
  done();
}));
