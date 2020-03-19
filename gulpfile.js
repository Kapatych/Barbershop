const gulp = require('gulp');
const babel = require("gulp-babel");
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoPrefixer = require("autoprefixer");
const rename = require("gulp-rename");
const del = require("del");
const plumber = require("gulp-plumber");
const htmlMinify = require("gulp-htmlmin");
const cssMinify = require("gulp-csso");
const jsMinify = require("gulp-uglify");
const imageMinify = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

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
      autoPrefixer({overrideBrowserslist: ["last 2 versions"]})
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(cssMinify())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
}

function js() {
  return gulp.src("src/js/script.js")
    .pipe(gulp.dest("build/js"))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(jsMinify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest("build/js"))
}

function image() {
  return gulp.src('src/img/**')
    .pipe(imageMinify([
      imageMinify.gifsicle({interlaced: true}),
      imageMinify.mozjpeg({quality: 75, progressive: true}),
      imageMinify.optipng({optimizationLevel: 3}),
      imageMinify.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
}

function html() {
  return gulp.src("src/*.html")
    .pipe(htmlMinify({ collapseWhitespace: true }))
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
  gulp.parallel(html, style, js, image)
);
