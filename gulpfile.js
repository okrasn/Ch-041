var exec = require('child_process').exec;
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    ngHtml2Js = require("gulp-ng-html2js"),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('server', function (cb) {

    exec('node app.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    // You must create folder 'data' in the root of project folder
    exec('mongod --dbpath ./data/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    console.log("Server is running on port 8080");
});

gulp.task('sass', function () {
    return gulp.src('client/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('client/css'));
});

gulp.task('scripts', function () {
    gulp.src(['./client/js/**/*.js', '!./client/js/**/*.test.js', '!./client/js/app.min.js', '!./client/js/jqscripts/*.js', '!./client/js/old/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(uglify()).on('error', function (e) {
            console.log(e);
        })
        .pipe(gulp.dest('./client/js/'))
});

gulp.task('useref', function () {
    return gulp.src('client/*.html')
        .pipe(useref())
        .pipe(gulp.dest('min'))
});

gulp.task('main', function () {
    gulp.watch('./client/scss/*.scss', ['sass']);
    //    gulp.watch('./client/**/*.js').on('change');
    //    gulp.watch('./client/**/*.css').on('change');
    //    gulp.watch('./client/**/*.html').on('change');
    //    gulp.watch('./client/**/*.json').on('change');
    gulp.watch(['./client/js/**/*.js', '!./client/js/**/*.test.js', '!./client/js/app.min.js', '!./client/js/jqscripts/*.js', '!./client/js/old/*.js'], ['scripts']);
});

gulp.task('default', ['server', 'sass', 'scripts', 'main']);