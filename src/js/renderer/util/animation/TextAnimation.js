// @flow
import Animation from './Animation'
import { setMessagePosition } from '../../actions/actions'
import { get } from 'lodash'
import store from '../../main/store'
import engine from '../../main/engine'
import { isAutoPlay } from '../autoPlay/isAutoPlay'
import { autoPlay } from '../autoPlay/autoPlay'

type TextAnimationState = {
  index: ?number,
  position: ?number,
}
const INITIAL_STATE: TextAnimationState = { index: null, position: null }
export default class TextAnimation extends Animation {
  message: Message[]
  position: Iterator<TextAnimationState>
  textSpeed: number
  initialState: TextAnimationState
  intervalID: IntervalID
  isStopped = false
  constructor(message: Message[], offset: number = 0) {
    super()
    this.message = message
    this.position = this.positionGenerator(offset)
    this.textSpeed = engine.getVar('config.text.speed', 1000)
    this.initialState = INITIAL_STATE
  }

  *positionGenerator(
    offset: number
  ): Generator<TextAnimationState, void, void> {
    if (this.message[this.message.length - 1].type === 'br') {
      this.message.pop()
    }
    let position
    for (let index = offset; index < this.message.length; index++) {
      position = 0
      const currentMessage = this.message[index]
      if (
        engine.getVar('config.text.periodWait', false) &&
        currentMessage.type === 'period'
      ) {
        this.stop()
        if (isAutoPlay()) {
          autoPlay()
        }
        yield { index: index + 1, position }
      }

      if (currentMessage.body) {
        while (position < currentMessage.body.length) {
          position += 1
          yield { index: index + 1, position }
        }
      }
    }
  }

  getInitialState() {
    return this.initialState
  }

  _exec() {
    let position = this.position.next()
    if (position.done) {
      this.finish()
      return
    }
    store.dispatch(setMessagePosition(position.value))
  }

  start() {
    this.isStarted = true
    if (this.textSpeed > 0) {
      this._exec()
      const intervalID = setInterval(this._exec.bind(this), this.textSpeed)
      this.intervalID = intervalID
    }
  }

  skip() {
    this.stop()
    let position
    do {
      position = this.position.next()
      if (position.done) {
        this.finish()
        return
      }
    } while (
      position.value.index &&
      this.message[position.value.index - 1].type != 'period'
    )
    store.dispatch(setMessagePosition(position.value))
  }

  stop() {
    this.isStopped = true
    clearInterval(this.intervalID)
  }

  finish() {
    this.stop()
    this.isFinished = true
    store.dispatch(setMessagePosition(INITIAL_STATE))
    engine.exec()
  }

  onExec() {
    if (this.isStopped && !this.isFinished) {
      this.isStopped = false
      this.start()
    } else if (engine.getVar('config.text.periodWait', false)) {
      this.skip()
    } else {
      this.finish()
    }
  }
}
