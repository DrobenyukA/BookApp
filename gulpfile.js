var gulp         = require('gulp'),
    watch        = require('gulp-watch'),
    less         = require('gulp-less'),
    cssnano      = require('gulp-cssnano'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    sourcemaps   = require('gulp-sourcemaps'),
    compile      = require('gulp-ejs-template');


gulp.task('default', ['build', 'watch']);

gulp.task('build', ['front-end', 'back-end']);

gulp.task('watch', function () {
    return gulp.watch('./src/**/**', ['front-end']);
});

gulp.task('front-end', ['html', 'less', 'js', 'templates']);

gulp.task('html', function(){
   gulp.src('./src/front_end/*.html')
       .pipe(gulp.dest('./dist/public'));
});

gulp.task('less', function(){
    return gulp.src([
        './src/front_end/less/style.less',
        './src/front_end/less/media.less'
    ])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/public/css/'));
});

gulp.task('js', function () {
    return gulp.src([
        './src/front_end/js/models/**',
        './src/front_end/js/collections/**',
        './src/front_end/js/views/**',
        './src/front_end/js/UserApp.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('templates', function() {
    return gulp.src('./src/front_end/templates/*.ejs')
        .pipe(compile({
            moduleName: 'templates',
            escape: false
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('back-end', function () {
    return gulp.src(['./src/back_end/**/**'])
        .pipe(gulp.dest('./dist'));
});


