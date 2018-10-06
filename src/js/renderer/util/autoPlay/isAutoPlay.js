import engine from '../../main/engine'

export function isAutoPlay() {
  return engine.getVar('config.auto', false)
}
