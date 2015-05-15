var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var stylish = require('jshint-stylish');
 
gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
 
gulp.task('compress', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
 
gulp.task('webserver', function() {
	var PORT = 3000;
	console.log('starting test server on port :p...'.replace(':p',PORT));
  return gulp.src('.')
    .pipe(webserver({
    	port: PORT,
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['lint', 'compress']);
gulp.task('test', ['lint', 'compress', 'webserver'])
