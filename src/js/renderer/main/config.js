import path from 'path'
import Config from '../util/Config'
import store from './store'
import { toAbsolutePath } from '../util/util'

let config = {}

export function generateConfig(configPath) {
  config = Config.generateConfig(configPath)
  config.auto = false
  config.extendGetter('basePath', function (key, getter) {
    return function () {
      let basePath = getter() || path.dirname(this._path)
      return toAbsolutePath(basePath)
    }
  })
  return config
}

export { config }
