var dev = false;
if (process.argv[2] === 'dev') dev = true;

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

var devCMS

function createWindow () {
  var url = '';
  win = new BrowserWindow({width: 800, height: 600})

  if (dev) {
    //Set up dev environment
    win.webContents.openDevTools()

    var express = require('express')
    var CMS = express()

    CMS.get('/CMS', function (req, res) {
      res.sendFile(__dirname + '/localApp.json')
    })

    devCMS = CMS.listen(3000, function () {
      console.log('Server listening on port 3000')
    })

    url = 'http://localhost:3000/CMS';
  }
  else {
    url = 'http://google.com';
  }

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => {
    if (dev) devCMS.close();
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
