import engine from '../../main/engine'
import { isAutoPlay } from './isAutoPlay'

export function autoPlay() {
  if (isAutoPlay) {
    setTimeout(() => {
      engine.exec()
    }, engine.getVar('config.autoSpeed', 0))
  }
}
