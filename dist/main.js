var BrowserWindow, Menu, app, gen_menu, ipcMain, mainWindow, ref;

ref = require('electron'), app = ref.app, BrowserWindow = ref.BrowserWindow, Menu = ref.Menu, ipcMain = ref.ipcMain;

mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    return app.quit();
  }
});

gen_menu = require('./menu_dev');

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  Menu.setApplicationMenu(gen_menu(mainWindow));
  return mainWindow.on('closed', function() {
    return mainWindow = null;
  });
});
