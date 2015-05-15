// Useful variables
var electronVersion = 'v0.26.0';
var deploymentPlatforms = ['win32-ia32', 'darwin-x64'];

// Require various gulp and node plugins
var gulp              = require('gulp');
var shell             = require('gulp-shell');
var del               = require('del');
var os                = require('os');
var path              = require('path');
var vulcanize         = require('gulp-vulcanize');
var zip               = require('gulp-zip');
var gulpAtom          = require('gulp-atom');
var gulpAsar          = require('gulp-asar');
var replace           = require('gulp-replace');

// Determine platform, as running the applicaiton requires a different
// command for mac vs. windows
var platform = os.platform();

// Declare some variables for building run commands
var electronExecutableMac = 'dist/'+ electronVersion + '/darwin-x64/Electron.app/Contents/MacOS/Electron';
var electronExecutableWin = 'dist\\' + electronVersion + '\\win32-ia32\\electron.exe'
var distAppDirMac = 'dist/'+ electronVersion + '/darwin-x64/Electron.app/Contents/Resources';
var distAppDirWin = 'dist/'+ electronVersion + '/win32-ia32/resources';

var releaseAppPath
var runBuildCmd;
var runReleaseCmd;

// Build the commands that will run the app, accounting for platform differences
// and whether we want to run from the dev form (timer-app folder) or dist form
// (.asar archive)

// FIXME: Need to get this runDistCmd fixed ... see release/v${version}/darwin-x64/Atom.app app
// TODO: Make gulp-atom work with ASAR files, not just exploded files structure.
switch(platform) {
  case 'darwin':
    runBuildCmd = electronExecutableMac + ' build/timer-app';
    runReleaseCmd = electronExecutableMac + ' build/app.asar';
    break;
  case 'win32':
    runBuildCmd = electronExecutableWin + 'build\\timer-app';
    runReleaseCmd =  electronExecutableWin + 'build\\app.asar';
    break;
  default:
    console.log("Platform not supported. Needs to run on windows or mac.");
    process.exit(1);
    break;
}

// The timer-app/components directory is pretty large given the items pulled in
// for polymer components. This task allows the components directory to have whatever
// is useful for development, but vulcanize includes only the items required.
// Inline is used here to include everything necessary in the one index.html
// The replace is done here to hack around an issue where vulcanize changes path on
// image src attributes to be relative to the original file location.
gulp.task('vulcanize', function () {
  gulp.src('timer-app/index.html')
    .pipe(vulcanize({
      dest: 'build/timer-app',
      inline: true
    }))
    .pipe(replace('../../timer-app/images/USAclimbing.png', 'images/USAclimbing.png'))
    .pipe(gulp.dest('build/timer-app'));
});

// Copy other files needed. 
gulp.task('copy-static-assets', ['vulcanize'], function () {
  gulp.src(['timer-app/images/**',
            'timer-app/audio/**',
            'timer-app/main.js', 
            'timer-app/package.json'], {base: "."})
    .pipe(gulp.dest('build'));
});

// Move the batch files up a level
gulp.task('copy-executable-scripts', ['copy-static-assets'], function () {
  gulp.src(['timer-app/bin/**'])
    .pipe(gulp.dest('build'));
});

// Package up the app with Electron
gulp.task('dist', ['copy-executable-scripts'], function () {

    return gulpAtom({
        srcPath: './build/timer-app',
        releasePath: './dist',
        cachePath: './cache',
        version: electronVersion,
        rebuild: false,
        platforms: deploymentPlatforms
    });
});

// Create the .asar file, deposit in the dist locations, with the standard app.asar
// name so that we don't need a shell script to execute
gulp.task('build-asar', ['dist'], function (cb) {
  gulp.src('build/timer-app/**/*')
    .pipe(gulpAsar('app.asar'))
    .pipe(gulp.dest(distAppDirMac))
    .pipe(gulp.dest(distAppDirWin))

  // Remove the exploded versions of the app folder to force .asar use
  del([distAppDirWin + '/app', distAppDirMac + '/app'], cb)
});

gulp.task('release', ['build-asar'], function () {

});

// Delete the build and dist folder
gulp.task('clean', function(cb) {
  del(['build', 'release', 'dist'], cb);
});

gulp.task('default', ['release']);
