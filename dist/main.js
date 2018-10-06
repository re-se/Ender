'use strict';

var _electron = require('electron');

let mainWindow = null;

_electron.app.on('window-all-closed', () => {
  _electron.app.quit();
});

let menuPath = process.env.NODE_ENV === "development" ? './menu_dev' : './menu_prod';

const gen_menu = require(menuPath).default;

_electron.app.on('ready', () => {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new _electron.BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    minWidth: 800,
    minHeight: 600
  });
  // mainWindow.setMinimumSize(800, 600)
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  _electron.ipcMain.on('request-config-path', () => {
    mainWindow.send('set-config-path', process.env.CONFIG_PATH);
  });

  _electron.Menu.setApplicationMenu(gen_menu(mainWindow));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});