// require('electron-reload')(__dirname);

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

var fs = require('fs');

let importer = require('./importer.js');

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on('open-file-dialog', function (e) {
  dialog.showOpenDialog({
    properties: ['openFile', '']
  }, function (files) {
    if (files) e.sender.send('selected-file', files);
  })
})

ipc.on('save-dialog', (e) => {
  const options = {
    title: 'Save data to file',
    filters: [{name: 'text file', extensions: ['txt']}]
  };
  dialog.showSaveDialog(options, (fileName) => {
    e.sender.send('saved-file', fileName);
  })
})

ipc.on('document-ready', (e) => {
  // console.log("document ready, from main");
  fs.readFile('./config/client.secret', {'encoding': 'utf8'}, function (err, data) {
      if (err) return;
      savedConfig = JSON.parse(data);
      e.sender.send('config-available', savedConfig)
  });
})


//following functions are not used, just demo for it's capacity to open another window inside app
function createExternalUrlWindow (anUrl) {
  // Create the browser window.
  let aWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  aWindow.loadURL(anUrl)


  // Emitted when the window is closed.
  aWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    aWindow = null
  })
}
//this is triggered from a renderer by issueing ipc.send(openExternalUrl, anUrl)
ipc.on('openExternalUrl', (e, anUrl) => {
  createExternalUrlWindow(anUrl);
})

ipc.on('doimport', (e, options) => {
  console.log('yes, sir, import now');
  importer(options);
})
ipc.on('importsprintdone', (e) => {
  e.sender.send('updateimportstatus');
})
