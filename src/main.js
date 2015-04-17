let app = require('app');  // Module to control application life.
let BrowserWindow = require('browser-window');  // Module to create native browser window.
let ipc = require('ipc');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
	app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 1024});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null;
	console.log('closing out');
	app.quit();
    });

    // assuming 'reset' can never be sent before 'did-finish-load'

    // WARNING: delay must be longer than the length of the move clip (plus slop)
    let delay = 1.0;
    let interval_id = null;
    let stopped = false;

    ipc.on('reset', function(event) {
	console.log("received reset");
	stopped = false;
	mainWindow.webContents.send('place piece');
    });

    ipc.on('stop', function(event) {
	console.log("received stop");
	stopped = true;
    });

    ipc.on('stepped', function(event, state) {
	stopped = false;
	console.log("stepped: state=" + state);
	if (state == 'looped' || state == 'off board') {
	    console.log(state);
	    mainWindow.webContents.send('cleanup');
	    return;
	}
    });

    ipc.on('walk', function(event, state) {
	console.log("walk: state=" + state);
	if (state == 'looped' || state == 'off board') {
	    console.log(state);
	    mainWindow.webContents.send('cleanup');
	    return;
	}
	if (stopped) {
	    stopped = false;
	    mainWindow.webContents.send('stopped');
	    return;
	}
	interval_id = setInterval(function() {
	    clearInterval(interval_id);
	    mainWindow.webContents.send('walk');
	}, delay * 1000);
    });
});
