'use strict';

var _electron = require('electron');

var _menu_dev = require('./menu_dev');

var _menu_dev2 = _interopRequireDefault(_menu_dev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let args = {};
if (process.argv.includes("--config")) {
  const minimist = require('minimist');
  args = minimist(process.argv);
}

let mainWindow = null;

_electron.app.on('window-all-closed', () => {
  _electron.app.quit();
});

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
    mainWindow.send('set-config-path', args.config);
  });

  _electron.Menu.setApplicationMenu((0, _menu_dev2.default)(mainWindow));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});