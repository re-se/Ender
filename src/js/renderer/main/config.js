import path from 'path'
import Config from '../util/Config'
import store from './store'
import { toAbsolutePath, isExistFile, isDevelop } from '../util/util'
import fs from 'fs'

export function generateConfig(configPath: string): Config {
  let config = Config.generateConfig(configPath)
  config.auto = false
  config.extendGetter('basePath', function(key, getter) {
    return function() {
      let basePath = getter() || path.dirname(this._path)
      return toAbsolutePath(basePath)
    }
  })
  return config
}

export function saveConfig(config: Config) {
  // 書き込み予定のセーブファイルがすでにあったら削除
  const configFilePath = path.join(config.basePath, 'config.json')
  if (isExistFile(configFilePath)) {
    fs.unlink(configFilePath, err => {
      if (err) {
        console.warn(err)
      }
    })
  }

  fs.writeFile(configFilePath, config.toString(), err => {
    if (err) {
      console.warn(err)
    } else if (isDevelop()) {
      console.log(`done save config. ${configFilePath}`)
    }
  })
}
