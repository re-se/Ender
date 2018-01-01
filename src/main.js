import {app, BrowserWindow, Menu, ipcMain} from 'electron'

let args = {}
if (process.argv.includes("--config")) {
  const minimist = require('minimist')
  args = minimist(process.argv)
}

let mainWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

import gen_menu from './menu_dev'


app.on('ready', () => {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    minWidth: 800,
    minHeight: 600
  })
  // mainWindow.setMinimumSize(800, 600)
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  ipcMain.on('request-config-path', () => {
    mainWindow.send('set-config-path', args.config)
  })
  
  Menu.setApplicationMenu(gen_menu(mainWindow))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})
