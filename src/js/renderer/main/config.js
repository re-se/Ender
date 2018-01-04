import path from 'path'
import Config from '../util/Config'
import store from './store'
import { toAbsolutePath } from '../util/util'

let config = Config.generateConfig(store.getState().configPath)
config.auto = false
config.extendGetter('basePath', function (key, getter) {
  return function () {
    let basePath = getter() || path.dirname(this._path)
    console.log(basePath)
    return toAbsolutePath(basePath)
  }
})

export default config
