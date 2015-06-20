var gulp = require('gulp');
var del = require('del');

var foldersToCopy = [
    'bootstrap/dist',
    'ckeditor',
    'jquery/dist'
];

var filesToCopy = [
    'webcomponentsjs/webcomponents.min.js'
];

var getPathToFile = function(file) {
    var array = file.split('/');
    delete array[array.length-1];
    return array.join('/');
};

gulp.task('clear:assets', function() {
    del(['assets/vendor/*']);
});

gulp.task('copy', function() {
    foldersToCopy.forEach(function(folder) {
        gulp.src('assets/bower_components/' + folder + '/**/*')
            .pipe(gulp.dest('assets/vendor/' + folder));
    });
    filesToCopy.forEach(function(file) {
        gulp.src('assets/bower_components/' + file)
            .pipe(gulp.dest('assets/vendor/' + getPathToFile(file)));
    });
});

gulp.task('default', ['clear:assets', 'copy']);
