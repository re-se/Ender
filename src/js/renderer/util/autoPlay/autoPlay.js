import engine from '../../main/engine'

export function autoPlay() {
  setTimeout(() => {
    engine.exec()
  }, engine.getVar('config.autoSpeed', 0))
}
