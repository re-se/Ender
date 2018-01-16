//@flow
import type Animation from './Animation'

export default class ImageAnimation implements Animation {
  effectName: string
  isFinished: bool

  constructor(effectName: string) {
    this.isFinished = false
    this.effectName = effectName
  }

  start() {

  }

  onExec() {

  }
}
