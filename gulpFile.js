/** 
npm install gulp-concat -S
npm install gulp -S
npm install gulp-minify-css -S
npm install gulp-angular-templatecache -S
npm install gulp-uglify -S
*/

var concat 				= require('gulp-concat');
var gulp 					= require('gulp');
var minifyCSS 		= require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var uglify 				= require('gulp-uglify');

gulp.task('js', function() {
  gulp.src('public/javascripts/**/*.js')
	  .pipe(uglify())
	  .pipe(gulp.dest('public/javascripts/'))
});

gulp.task('css', function(){
  gulp.src('public/stylesheets/*.css')
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
		.pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('html', function () {
  return gulp.src('views/templates/*.ejs')
    .pipe(templateCache({
    	transformUrl: function(url) {
		    return '/templates/' + url;
			},
			standalone: true
    }))
    .pipe(gulp.dest('public/dist/javascripts'));
});


gulp.task('default', ['js', 'css', 'html']);