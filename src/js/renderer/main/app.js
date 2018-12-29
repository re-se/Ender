// @flow
import { ipcRenderer } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import path from 'path'

import Game from '../components/Game'
import engine from './engine'
import { toAbsolutePath, toAbsoluteAppPath } from '../util/util'
import store from './store'
import { generateConfig } from './config'

const DEFAULT_CONFIG_PATH = 'config.json'

ipcRenderer.send('request-config-path')
ipcRenderer.on('set-config-path', (e, requestConfigPath) => {
  let configPath = toAbsoluteAppPath(DEFAULT_CONFIG_PATH)
  if (requestConfigPath !== undefined && requestConfigPath !== null) {
    configPath = toAbsolutePath(requestConfigPath)
  }
  console.log(configPath)

  const config = generateConfig(configPath)

  engine.init(config)

  render(
    <Provider store={store}>
      <Game />
    </Provider>,
    document.getElementById('contents')
  )

  engine.exec()
})
