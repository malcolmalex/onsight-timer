var gulp = require('gulp');
var shell = require('gulp-shell');
var downloadatomshell = require('gulp-download-atom-shell');
var del = require('del');

// Download atom-shell local to the project
gulp.task('downloadatomshell', function(cb) {
    downloadatomshell({
        version: '0.18.1',
        outputDir: 'build'
    }, cb);
});

// Default task does the build, dependent on having atom-shell in place
// This is specific to MacOS
// TODO: Generalize to other OSs
gulp.task('default', ['downloadatomshell'], shell.task([
    'build/Atom.app/Contents/MacOS/Atom ./timer-app'
]));

// Delete the build folder to clean
gulp.task('clean', function(cb) {
  del(['build'], cb);
});
