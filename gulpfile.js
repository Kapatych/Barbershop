const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const del = require("del");
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const uglify = require("gulp-uglify");
const babel = require('gulp-babel');

function copy() {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}"
  ], {
    base: "src"
  })
    .pipe(gulp.dest("build"))
}

function clean() {
  return del("build")
}

function style() {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({overrideBrowserslist: ["last 2 versions"]})
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
}

function js() {
  return gulp.src("src/js/script.js")
    .pipe(gulp.dest("build/js"))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest("build/js"))
}

function image() {
  return gulp.src('src/img/**')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
}

function html() {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("build"))
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "build/"
    }
  });
  gulp.watch('src/sass/**/*.scss', style);
  gulp.watch('src/js/**/*.js', js).on('change', browserSync.reload);
  gulp.watch("src/*.html", html).on('change', browserSync.reload);
}

exports.copy = copy;
exports.clean = clean;
exports.style = style;
exports.js = js;
exports.image = image;
exports.html = html;
exports.serve = serve;

exports.build = gulp.series(
  clean,
  copy,
  gulp.parallel(style, js, image, html)
);
