var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('clean', function (cb) {
  del('build/**/*.*', cb);
});

gulp.task('build', function () {
  return gulp.src(['providers/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['clean', 'build']);