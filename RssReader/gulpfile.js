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
            baseDir : ['./','./client']
        }
    })
});
gulp.task('watch',['browserSync','sass'],function(){
    gulp.watch('client/**/*.scss',['sass']);
    gulp.watch('client/**/*.js',browserSync.reload);
    gulp.watch('client/**/*.css',browserSync.reload);
    gulp.watch('client/**/*.html',browserSync.reload);
    gulp.watch('client/**/*.json',browserSync.reload);
});


