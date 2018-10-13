import { remote } from 'electron'
import engine from '../main/engine'

export function screenshot(isSync = true) {
  remote.getCurrentWindow().capturePage(img => {
    engine.setVar('global.__system__.screenshot', img.resize({ width: 200 }))
    if (isSync) {
      engine.exec()
    }
  })
}
