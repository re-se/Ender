var BrowserWindow, Menu, app, mainWindow, menu, name, ref, showSetting;

ref = require('electron'), app = ref.app, BrowserWindow = ref.BrowserWindow, Menu = ref.Menu;

mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    return app.quit();
  }
});

showSetting = function() {
  return mainWindow.send('show-setting', null);
};

name = 'first';

menu = Menu.buildFromTemplate([
  {
    label: name,
    submenu: [
      {
        label: 'Preferences...',
        accelerator: 'CmdOrCtrl+,',
        click: showSetting
      }, {
        type: 'separator'
      }, {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: app.quit
      }
    ]
  }, {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  }, {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            return focusedWindow.reload();
          }
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            return focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            return focusedWindow.toggleDevTools();
          }
        }
      }
    ]
  }, {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      }, {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: function() {
          return require('electron').shell.openExternal('http://electron.atom.io');
        }
      }
    ]
  }
]);

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  Menu.setApplicationMenu(menu);
  return mainWindow.on('closed', function() {
    return mainWindow = null;
  });
});
