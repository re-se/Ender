// @flow
import { ipcRenderer } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Game from '../components/Game'
import engine from './engine'
import { toAbsolutePath } from '../util/util'
import store from './store'
import { setConfig, setEngine } from '../actions/actions'
import { generateConfig } from './config'

ipcRenderer.send('request-config-path')
ipcRenderer.on('set-config-path', (e, requestConfigPath) => {
  let configPath = null
  if (requestConfigPath !== undefined) {
    configPath = toAbsolutePath(requestConfigPath)
  }
  console.log(configPath)

  const config = generateConfig(configPath)
  store.dispatch(setConfig(config))

  engine.init(config)
  engine.exec()

  render(
    <Provider store={store}>
      <Game />
    </Provider>,
    document.getElementById('contents')
  )
})
