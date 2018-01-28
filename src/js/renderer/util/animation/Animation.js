//@flow
import StyleUtil from '../StyleUtil'

export default class Animation {
  isFinished = false
  isStarted = false
  selector: string
  selectorTree: Selector[]
  constructor(selector: string | string[] = '') {
    this.selector = selector instanceof Array ? selector.join(',') : selector
    this.selectorTree = StyleUtil.parse(this.selector)
  }

  start() {}

  finish() {}

  onExec() {}
}
