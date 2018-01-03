// @flow
import { ipcRenderer } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import path from 'path'

import Game from '../components/Game'
import Ender from './engine'
import Config from '../util/Config'
import { toAbsolutePath } from '../util/util'
import store from './store'
import { setConfig, setEngine } from '../actions/actions'

ipcRenderer.send('request-config-path')
ipcRenderer.on('set-config-path', (e, requestConfigPath) => {
  let configPath = null
  if (requestConfigPath !== undefined) {
    configPath = toAbsolutePath(requestConfigPath)
  }
  console.log(configPath)
  let config = Config.generateConfig(configPath)
  config.auto = false
  config.extendGetter('basePath', function (key, getter) {
    return function () {
      let basePath = getter() || path.dirname(this._path)
      console.log(basePath)
      return toAbsolutePath(basePath)
    }
  })

  initGame(config, new Ender(config))
})

const initGame = (config: Config, engine: Ender) => {
  store.dispatch(setConfig(config))
  store.dispatch(setEngine(engine))

  engine.exec()

  render(
    <Provider store={store}>
      <Game />
    </Provider>,
    document.getElementById('contents')
  )
}
