// This app uses atom-shell to provide a cross-platform application, built
// with standard web technologies, including node.js, chromium, and also
// polymer. This file sets up atom shell.

var app = require('app');  // Module to control application life.
var os = require('os');
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Check 2nd argument (filename) of command and see if .asar or just a folder
// commands look like "atom timer-app.asar" or "atom timer-app"
// TODO: Can't just double-click the icon in the dist folder as that doesn't
// pass in the parameter for asar archive, as it's been installed in Resources
// and from the command line it doesn't need to be there!
// Running via the gulp-file is the only way at the moment to run the dist
// version.
var protocol = 'file';
if (process.argv[1].indexOf('.asar') > -1) {
    protocol = 'asar';
}

// Quit when all windows are closed.
// FIXME: quit not working.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app, either in asar or regular file
  var url = protocol + '://' + __dirname + '/index.html';
  console.log('loading ' + url);
  mainWindow.loadUrl(url);

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
