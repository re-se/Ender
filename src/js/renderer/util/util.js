import path from 'path'
import fs from 'fs'

import { remote } from 'electron'
const { app } = remote

export const toAbsolutePath = (originPath, prefix = app.getAppPath()) => {
  return path.isAbsolute(originPath)
    ? originPath
    : path.join(prefix, originPath)
}

export const GeneratorFunction = function*() {}.constructor

/**
 * 現在日時(マイクロ秒)でユニークな文字列を生成する
 * @return {string}
 */
export const generateUniqueString = (): string => {
  return (
    new Date().getTime().toString(16) +
    Math.floor(1000 * Math.random()).toString(16)
  )
}

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

/**
 */
function isExistFile(filePath: string): boolean {
  try {
    fs.statSync(filePath)
    return true
  } catch (error) {
    return false
  }
}
