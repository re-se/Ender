// @flow
import { ipcRenderer } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import path from 'path'

import Game from '../components/Game'
import Ender from './engine'
import Config from '../util/Config'
import reducers from '../reducers/reducers'
import { toAbsolutePath } from '../util/util'
import type { Store } from '../types/types'

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
  const store: Store = createStore(
    reducers,
    { config, engine, components: [] }
  )

  engine.setStore(store)

  engine.exec()

  render(
    <Provider store={store}>
      <Game />
    </Provider>,
    document.getElementById('contents')
  )
}
