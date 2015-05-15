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

// // Terminate when window closed
app.on('window-all-closed', function() {
    app.terminate();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // If NODE_ENV environment variable is not production, assume dev
  var development = process.env.NODE_ENV !== 'production';

  var url = 'file://' + __dirname + '/index.html'

  console.log('loading ' + url);
  mainWindow.loadUrl(url);

  // Launch chrome dev tools in dev
  if (development) {
    mainWindow.openDevTools(['detach']);
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
