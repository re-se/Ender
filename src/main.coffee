{app, BrowserWindow, Menu, ipcMain} = require('electron')
args = {}
if process.argv.slice(-1).includes("json")
  minimist = require 'minimist'
  args = minimist(process.argv)
# require('crash-reporter').start()
console.log args
mainWindow = null

app.on('window-all-closed', () ->
  if (process.platform != 'darwin')
    app.quit()
)

gen_menu = require('./menu_dev')

app.on('ready', () ->
  # ブラウザ(Chromium)の起動, 初期画面のロード

  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  ipcMain.on 'req-path', ->
    mainWindow.send('set-config-path', args.config)

  Menu.setApplicationMenu(gen_menu mainWindow)

  mainWindow.on('closed', () ->
    mainWindow = null
  )
)
