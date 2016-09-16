var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('scripts/**/*.ts')
    .pipe(ts({
        noImplicitAny: true
    }))
    .pipe(gulp.dest('dist'));
});