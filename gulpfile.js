const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const pump = require('pump');

gulp.task('sass', () => {
  pump([
    gulp.src('src/scss/**/*.scss'),
    sass({ style: 'compressed' }).on('error', sass.logError),
    concat('style.css'),
    autoprefixer({ browsers: ['last 2 versions'] }),
    minifyCss(),
    gulp.dest('prod/css'),
    browserSync.stream({match: '**/*.css'})
  ]);
});

gulp.task('html', () => {
  pump([
    gulp.src('src/**/*.html'),
    htmlmin({ collapseWhitespace: true, removeComments: true }),
    gulp.dest('prod')
  ]);
});

gulp.task('js', () => {
  pump([
    gulp.src('src/js/**/*.js'),
    babel({ presets: ['es2015'] }),
    uglify(),
    gulp.dest('prod/js'),
    browserSync.stream()
  ]);
});

gulp.task('image', () => {
  pump([
    gulp.src('src/img/*'),
    imagemin({ verbose: true }),
    gulp.dest('prod/img')
  ]);
});

gulp.task('browserSync', ['sass', 'js', 'html', 'image'], function() {
  browserSync.init({
    injectChanges: true,
    server: './prod'
  });

  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/img/*', ['image']);
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['browserSync']);
