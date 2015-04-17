var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var fs = require('fs-extra');
var sourcemaps = require("gulp-sourcemaps");

gulp.task('png', function() {
    return gulp.src('src/img/*.png')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('jpg', function() {
    return gulp.src('src/img/*.jpg')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('wav', function() {
    return gulp.src('src/audio/*.wav')
        .pipe(gulp.dest('dist/audio'));
});

gulp.task('mp3', function() {
    return gulp.src('src/audio/*.mp3')
        .pipe(gulp.dest('dist/audio'));
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('es6', function() {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel()).on('error', function (error) {
            console.log(error.toString());
            this.emit('end');
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

// Empty the build directory to ensure no old build files are left there
// and to ensure we start on a clean slate
gulp.task("clean", function(cb) {
    fs.emptyDir('./dist', cb);
});

// The watch tasks first cleans the dist directory before starting to watch for changes
gulp.task("watch", ["clean"], function() {
    watch("src/img/*.*", {ignoreInitial: false}, function() {
        gulp.start("png");
        gulp.start("jpg");
    });
    watch("src/audio/*.*", {ignoreInitial: false}, function() {
        gulp.start("wav");
        gulp.start("mp3");
    });
    watch("src/**/*.js", {ignoreInitial: false}, function() {
        gulp.start("es6");
    });
    watch("src/**/*.html", {ignoreInitial: false}, function() {
        gulp.start("html");
    });
});

gulp.task('default', ['watch']);
