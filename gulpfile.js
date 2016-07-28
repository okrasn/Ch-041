var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');


gulp.task('sass', function() {
    return gulp.src('client/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('client/css'));
});

gulp.task('useref',function(){
    return gulp.src('client/*.html')
        .pipe(useref())
        .pipe(gulp.dest('min'))
});

gulp.task('browserSync',function(){
    browserSync.init({
        server :{
            baseDir : 'client'
        }
    })

    gulp.watch('./client/scss/*.scss',['sass']);
    gulp.watch('./client/**/*.js').on('change', browserSync.reload);
    gulp.watch('./client/**/*.css').on('change', browserSync.reload);
    gulp.watch('./client/**/*.html').on('change', browserSync.reload);
    gulp.watch('./client/**/*.json').on('change', browserSync.reload);
});

gulp.task('default', ['sass','browserSync']);


