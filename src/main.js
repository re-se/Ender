import { app, BrowserWindow, Menu, ipcMain } from 'electron'

let mainWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

let menuPath =
  process.env.NODE_ENV === 'development' ? './menu_dev' : './menu_prod'

const gen_menu = require(menuPath).default
const loadDevtool = require('electron-load-devtool')

app.on('ready', () => {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    minWidth: 800,
    minHeight: 600,
  })
  // mainWindow.setMinimumSize(800, 600)
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  ipcMain.on('request-config-path', () => {
    mainWindow.send('set-config-path', process.env.CONFIG_PATH)
  })

  Menu.setApplicationMenu(gen_menu(mainWindow))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  loadDevtool(loadDevtool.REDUX_DEVTOOLS)
  loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS)
  mainWindow.openDevTools()
})
