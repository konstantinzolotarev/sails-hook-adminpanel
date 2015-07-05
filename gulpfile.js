var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var path = require('path');


var ASSETS_DIR = 'assets';
var BOWER_DIR = ASSETS_DIR + '/bower_components/';
var VENDOR_DIR = ASSETS_DIR + '/vendor/';

var foldersToCopy = [
    'bootstrap/dist',
    'ckeditor',
    'jquery/dist'
];

var filesToCopy = [
    'webcomponentsjs/webcomponents-lite.min.js'
];

var getPathToFile = function(file) {
    var array = file.split('/');
    delete array[array.length-1];
    return array.join('/');
};

gulp.task('clear:assets', function() {
    del([VENDOR_DIR]);
});

gulp.task('copy', function() {
    foldersToCopy.forEach(function(folder) {
        gulp.src(BOWER_DIR + folder + '/**/*')
            .pipe(gulp.dest(VENDOR_DIR + folder));
    });
    filesToCopy.forEach(function(file) {
        gulp.src(BOWER_DIR + file)
            .pipe(gulp.dest(VENDOR_DIR + getPathToFile(file)));
    });
});

gulp.task('less', function() {
    return gulp.src(ASSETS_DIR + '/styles/importer.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(ASSETS_DIR + '/styles/'));
});

gulp.task('default', ['clear:assets', 'copy']);
