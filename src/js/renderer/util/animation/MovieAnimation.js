//@flow
import Animation from './Animation'
import store from '../../main/store'
import { deleteComponent } from '../../actions/actions'
import engine from '../../main/engine'

export default class MovieAnimation extends Animation {
  isSync: boolean

  constructor(id: string, isSync: boolean = true) {
    super(`#${id}`)
    this.isSync = isSync
  }

  start() {
    // アニメオブジェクトを開始状態にする
    this.isStarted = true
  }

  finish() {
    // アニメオブジェクトを終了状態にする
    this.isFinished = true

    store.dispatch(deleteComponent(this.selectorTree))

    if (this.isSync) {
      engine.exec()
    }
  }

  onExec() {
    this.finish()
  }
}
