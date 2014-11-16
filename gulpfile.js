 // The build task ultimately serves up content from the root of timer-app, for
 // dev.
 //
 // The build task involves downloading the appropriate version of atom-shell
 // to the build inside the project, and running atom-shell against the
 // timer-app directory.
 //
 // The dist process invovles the following:
 //   1. Download appropriate atom-shell version.
 //   2. Vulcanize index.html.
 //   3. Copy static assets to dist (images/* and audio/*)
 //   4. Create asar file for application.
 //   5. Zip the whole onsight-timer directory in dist/
 //      (zip currently not working)
 //
 // The dist task produces the following structure:
 // Mac OS:
 //  dist/
 //    app/
 //      Atom/*
 //      timer-app.asar
 //        index.html (vulcanized)
 //        images/*
 //        audio/*
 //    run-windows.bat
 //    run-mac.command
 //
 // Windows:
 //  dist/
 //    app/
 //      atom.exe
 //      (whole bunch of .dlls and junk)
 //      timer-app.asar
 //        index.html (vulcanized)
 //        images/*
 //        audio/*
 //    run-windows.bat
 //    run-mac.command

// Set atom shell version
var atomShellVersion = '0.19.2';

// Require various gulp and node plugins
var gulp              = require('gulp');
var shell             = require('gulp-shell');
var downloadatomshell = require('gulp-download-atom-shell');
var del               = require('del');
var os                = require('os');
var path              = require('path');
var vulcanize         = require('gulp-vulcanize');
var zip               = require('gulp-zip');
var fs                = require('node-fs');

// Determine platform, as running the applicaiton requires a different
// command for mac vs. windows
var platform = os.platform();

// Declare some variables for building run commands
var runBuildCmd;
var runDistCmd;

// Build the commands that will run the app, accounting for platform differences
// and whether we want to run from the dev form (timer-app folder) or dist form
// (.asar archive)
switch(platform) {
  case 'darwin':
    runBuildCmd = 'build/Atom.app/Contents/MacOS/Atom timer-app';
    runDistCmd = 'dist/app/Atom.app/Contents/MacOS/Atom dist/app/timer-app.asar';
    break;
  case 'win32':
    runBuildCmd = 'build\\atom.exe timer-app';
    runDistCmd =  'dist\\app\\atom.exe dist\\app\\timer-app.asar';
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
// TODO - make this a copy operation from build, not another download
gulp.task('downloadatomshell-dist', function(cb) {
    var distAppDir = 'dist/app';
    if (!fs.existsSync(distAppDir)){
        fs.mkdirSync(distAppDir,077,true);
    }
    downloadatomshell({
        version: atomShellVersion,
        outputDir: distAppDir
    }, cb);
});

// The timer-app/components directory is pretty large given the items pulled in
// for polymer components. This allows the components directory to have whatever
// is useful for development, but vulcanize includes only the items required.
// Inline is used here to include everything necessary in the one index.html
// FIXME: Vulcanize changes the path in image tags, and for now, need to update
// dist/timer-app/index.html to be relative again and then asar the folder. So
// implication is that gulp-dist does not work once you want to .zip the
// atom.app, timer-app.asar, run.command and move it.
gulp.task('vulcanize', ['downloadatomshell-dist'], function () {
  gulp.src('timer-app/index.html')
    .pipe(vulcanize({
      dest: 'dist/app/timer-app',
      inline: true
    }))
    .pipe(gulp.dest('dist/app/timer-app'));
});

// Copy other files needed.
gulp.task('copy-static-assets', ['vulcanize'], function () {
  gulp.src(['timer-app/images/**',
            'timer-app/audio/**',
            'timer-app/main.js', 
            'timer-app/package.json'], {base: "."})
    .pipe(gulp.dest('dist/app'));
});

// Move the batch files up a level
gulp.task('copy-executable-scripts', ['copy-static-assets'], function () {
  gulp.src(['timer-app/bin/**'])
    .pipe(gulp.dest('dist'));
});

// Generic dev build task
gulp.task('build',['downloadatomshell-build']);

// Create the .asar file.  Assumes you've done npm install -g asar
// FIXME: Note that asar format can't be generated on windows as of 10/23/2014, so
// dist and run-dist will not work for windows.
gulp.task('dist', ['copy-executable-scripts'], shell.task([
  path.normalize('asar pack dist/app/timer-app dist/app/timer-app.asar')
]));

// Run the local build.  In development using this approach, you can just make
// changes to the application, and hit command-R or ctrl-R to refresh without
// having to put a watch on files or re-run the build task
gulp.task('run-build', ['downloadatomshell-build'], shell.task([ runBuildCmd ]));

// Run the local dist (.asar approach)
// FIXME: Note that asar format can't be generated on windows as of 11/23/2014,
// and so dist and run-dist will not work on that OS.
gulp.task('run-dist', ['dist'], shell.task([ runDistCmd ]));

// Delete the build and dist folder
gulp.task('clean', function(cb) {
  del(['build', 'dist'], cb);
});

gulp.task('default', ['build']);
