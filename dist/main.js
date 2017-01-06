var BrowserWindow, Menu, app, args, gen_menu, ipcMain, mainWindow, minimist, ref;

ref = require('electron'), app = ref.app, BrowserWindow = ref.BrowserWindow, Menu = ref.Menu, ipcMain = ref.ipcMain;

minimist = require('minimist');

console.log(process.argv);

args = minimist(process.argv);

console.log(args);

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
  ipcMain.on('req-path', function() {
    return mainWindow.send('set-config-path', args.config);
  });
  Menu.setApplicationMenu(gen_menu(mainWindow));
  return mainWindow.on('closed', function() {
    return mainWindow = null;
  });
});
