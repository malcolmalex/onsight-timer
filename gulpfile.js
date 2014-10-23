// Require various gulp and node plugins
var gulp = require('gulp');
var shell = require('gulp-shell');
var downloadatomshell = require('gulp-download-atom-shell');
var del = require('del');
var os = require('os');
var path = require('path');
var vulcanize = require('gulp-vulcanize');

var atomShellVersion = '0.18.1';
var platform = os.platform();

var runBuildCmd;
var runDistCmd;
var atomResourcesPath;

// Build the commands that will run the app, accounting for platform differences
// and whether we want to run from the dev form (timer-app folder) or dist form
// (.asar archive)
switch(platform) {
  case 'darwin':
    atomResourcesPath = 'dist/Atom.app/Contents/Resources'

    runBuildCmd = 'build/Atom.app/Contents/MacOS/Atom timer-app';
    runDistCmd = 'dist/Atom.app/Contents/MacOS/Atom ' + atomResourcesPath + '/app.asar';
    break;
  case 'win32':
    atomResourcesPath = path.normalize('dist/resources');

    runBuildCmd = 'build\\atom.exe timer-app';
    runDistCmd =  'dist\\atom.exe' + atomResourcesPath + '\\app.asar';
    break;
  default:
    console.log("Platform not supported. Needs to run on windows or mac.");
    process.exit(1);
    break;
}

// Download atom-shell local to the project - to the build folder for dev
gulp.task('downloadatomshell-build', function(cb) {
    downloadatomshell({
        version: atomShellVersion,
        outputDir: 'build'
    }, cb);
});

// Download atom-shell local to the project - to dist folder for distributables
gulp.task('downloadatomshell-dist', function(cb) {
    downloadatomshell({
        version: atomShellVersion,
        outputDir: 'dist'
    }, cb);
});

// TODO: Need to experiment with this and see if can get filesize down.  Network
// trips are not important in this case since it's all local. I'm hoping this
// only pulls in the dependencies, not everything inside the components
// directory.

// But, this likely doesn't pull in anything not in an html import, like rxjs,
// numeralsjs, other libraries
gulp.task('vulcanize', function () {
    return gulp.src('timer-app/index.html')
        .pipe(vulcanize({
            dest: 'dist',
            inline: true
        }))
        .pipe(gulp.dest('dist'));
});

// Generic dev build task
gulp.task('build',['downloadatomshell-build']);

// Create the .asar file.  Assumes you've done npm install -g asar
gulp.task('dist', ['downloadatomshell-dist'], shell.task([
  path.normalize('asar pack timer-app ' + path.join(atomResourcesPath, 'app.asar'))
]));

// Run the local build.  In development using this approach, you can just make
// changes to the application, and hit command-R or ctrl-R to refresh without
// having to put a watch on files or re-run the build task
gulp.task('run-build', ['downloadatomshell-build'], shell.task([ runBuildCmd ]));

// Run the local dist (.asar approach)
gulp.task('run-dist', ['dist'], shell.task([ runDistCmd ]));

// Delete the build and dist folder
gulp.task('clean', function(cb) {
  del(['build', 'dist'], cb);
});


gulp.task('default', ['build']);
