import fs from 'fs'
import path from 'path'
import { isPlainObject, cloneDeep } from 'lodash'
import { toAbsolutePath } from './util'

const defaultBaseConfigPath = "dist/resource/_base.json"

const toPublic = (key) => key[0] === '@' ? key : `@${key}`

export default class Config {
  static generateConfig (path) {
    let configObject = null
    if (path) {
      configObject = JSON.parse(fs.readFileSync(path, 'utf8'))
    } else {
      configObject = {}
    }
    let config = new Config(configObject)
    config._path = path
    let baseConfigPath = config.base || defaultBaseConfigPath
    if (baseConfigPath != null) {
      baseConfigPath = toAbsolutePath(baseConfigPath)
    }
    if (baseConfigPath != null && path !== baseConfigPath) {
      config.baseConfig = Config.generateConfig(baseConfigPath)
      const accessibilities = ['public', 'private']
      accessibilities.forEach((accessibility) => {
        const keys = config.baseConfig.keys(accessibility)
        for (const i in keys) {
          const key = keys[i]
          if (!config[key]) {
            config.__defineGetter__(key, function() {
              return this.config[accessibility][key] || this.baseConfig[key]
            })
            config.__defineSetter__(key, function(value) {
              this.config[accessibility][key] = value
            })
          }
        }
      })
    }
    return config
  }

  constructor(configObject, isPublic = false) {
    this.configObject = configObject
    this.config = {}
    this.config['public'] = {}
    this.config['private'] = {}
    this.baseConfig = {}
    for (let key in this.configObject) {
      const value = this.configObject[key]
      if (isPublic) {
        key = toPublic(key)
      }
      this.addProperty(key, value)
    }
  }

  addProperty(key, value) {
    let accessibility = 'private'
    if (key[0] === '@') {
      key = key.slice(1)
      accessibility = 'public'
    }
    if (isPlainObject(value)) {
      value = new Config(value, accessibility === 'public')
    }
    this.config[accessibility][key] = value
    this.__defineGetter__(key, () => {
      return this.config[accessibility][key] || this.baseConfig[key]
    })
    this.__defineSetter__(key, (value) => {
      this.config[accessibility][key] = value
    })
  }

  extendGetter(key, f) {
    const getter = this.__lookupGetter__(key).bind(this) || (() => {})
    this.__defineGetter__(key, f(key, getter))
  }

  keys(accessibility = null) {
    if (accessibility) return Object.keys(this.config[accessibility])
    return Object.keys(this.config['public']).concat(Object.keys(this.config['private']))
  }

  toObject() {
    let output = {}
    const accessibilities = ['public', 'private']
    accessibilities.forEach((accessibility) => {
      for (let key in this.config[accessibility]) {
        const value = this.config[accessibility][key]
        if (accessibility === 'public') {
          key = `@${key}`
        }
        output[key] = value instanceof Config ? value.toObject() : value
      }
    })
    return output
  }

  toString() {
    return JSON.stringify(this.toObject(), null, "  ")
  }
}
