// Require various gulp and node plugins
var gulp = require('gulp');
var shell = require('gulp-shell');
var downloadatomshell = require('gulp-download-atom-shell');
var del = require('del');

var atomShellVersion = '0.18.1';

// Download atom-shell local to the project for dev
gulp.task('downloadatomshell-build', function(cb) {
    downloadatomshell({
        version: atomShellVersion,
        outputDir: 'build'
    }, cb);
});

// Download atom-shell for dist with the .asar file
gulp.task('downloadatomshell-dist', function(cb) {
    downloadatomshell({
        version: atomShellVersion,
        outputDir: 'dist'
    }, cb);
});

// Create the .asar file.  Assumes you've done
// npm install -g asar
gulp.task('dist', ['downloadatomshell-dist'], shell.task([
  'asar pack timer-app dist/timer-app.asar'

]));

// Default task does the build, dependent on having atom-shell in place
// TODO: Generalize to other OSs

gulp.task('run-build', ['downloadatomshell-build'], shell.task([
    'build/Atom.app/Contents/MacOS/Atom timer-app'
]));

// For testing the dist-approach using .asar files.  This is the
// default
gulp.task('run-dist', ['dist'], shell.task([
    'dist/Atom.app/Contents/MacOS/Atom dist/timer-app.asar'
]));

// Run-build uses the folder (not the .asar file), meaning you can
// just command-R to refresh while in development, without having to
//re-run a gulp task.
gulp.task('default', ['run-build']);

// Delete the build folder to clean
gulp.task('clean', function(cb) {
  del(['build', 'dist'], cb);
});
