import path from 'path'

import { remote } from 'electron'
const { app } = remote

export const toAbsolutePath = (originPath, prefix = app.getAppPath()) => {
  return path.isAbsolute(originPath) ? originPath : path.join(prefix, originPath)
}

export const GeneratorFunction = (function*(){}).constructor
