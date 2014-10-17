var gulp = require('gulp');
var shell = require('gulp-shell');
var downloadatomshell = require('gulp-download-atom-shell');

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
        version: '0.18.0',
        outputDir: 'build'
    }, cb);
});

gulp.task('demo', shell.task([
    'build/Atom.app/Contents/MacOS/Atom ./timer-app'
]));
