import path from 'path'

import { remote } from 'electron'
const { app } = remote

export const toAbsolutePath = (originPath, prefix = app.getAppPath()) => {
  return path.isAbsolute(originPath)
    ? originPath
    : path.join(prefix, originPath)
}

export const GeneratorFunction = function*() {}.constructor

/**
 * JSON を CSS のフォーマットの文字列に変換する
 * @param  {Object} json
 * @return {string}
 */
export const toCss = (json: Object) => {
  let css = ''
  for (const key in json) {
    const child = json[key]
    // selector: style の場合
    if (typeof child === 'object') {
      css += `${key} {${toCss(child)}}\n`
    } else {
      // attribute: value の場合
      css += `${key}: ${child};\n`
    }
  }
  return css
}

export const isDevelop = () => {
  return remote.process.env['NODE_ENV'] === 'development'
}
