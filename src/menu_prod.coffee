{app, Menu} = require('electron')
name = app.getName()

module.exports = (mainWindow) ->
  showSetting = ->
    mainWindow.send('show-setting', null)
  backToTitle = ->
    mainWindow.send('show-title', null)

  Menu.buildFromTemplate([
    {
      label: name,
      submenu: [
        {label: '設定', accelerator: 'CmdOrCtrl+,', click: showSetting},
        {label: 'タイトルに戻る', click: backToTitle},
        {label: '終了', accelerator: 'CmdOrCtrl+Q', click: app.quit}
      ]
    },
    {
      label: '表示',
      submenu: [
        {
          label: 'フルスクリーン表示',
          accelerator: (() ->
            if (process.platform == 'darwin')
              return 'Ctrl+Command+F'
            else
              return 'F11'
          )(),
          click: (item, focusedWindow) ->
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        },
      ]
    },
    {
      label: 'ウィンドウ',
      role: 'window',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: '閉じる',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
  ])
