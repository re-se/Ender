//@flow
import StyleUtil from '../StyleUtil'

export default class Animation {
  isFinished = false
  isStarted = false
  selector: string
  selectorTree: Selector[]
  constructor(selector: string = '') {
    this.selector = selector
    this.selectorTree = StyleUtil.parse(selector)
  }

  start() {}

  finish() {}

  onExec() {}
}
