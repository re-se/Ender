import path from 'path'
import fs from 'fs'
import os from 'os'
import { v1 as uuid } from 'uuid'

import { remote } from 'electron'
const { app } = remote

export const toAbsolutePath = (originPath, prefix = app.getAppPath()) => {
  return path.isAbsolute(originPath)
    ? originPath
    : path.join(prefix, originPath)
}

export const toAbsoluteAppPath = (originPath, prefix = getAppPath()) => {
  return toAbsolutePath(originPath, prefix)
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

/**
 */
export function isExistFile(filePath: string): boolean {
  try {
    fs.statSync(filePath)
    return true
  } catch (error) {
    return false
  }
}

function getAppPath() {
  const appPath = app.getAppPath()
  let to = ''
  if (path.extname(appPath) === '.asar') {
    const osName = os.type()
    if (osName === 'Windows') {
      to = '../../'
    } else if (osName === 'Darwin') {
      to = '../../../../'
    }
  }
  return path.resolve(appPath, to)
}
