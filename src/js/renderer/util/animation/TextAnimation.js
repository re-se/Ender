// @flow
import Animation from './Animation'
import { setMessagePosition } from '../../actions/actions'
import { get } from 'lodash'
import store from '../../main/store'

type TextAnimationState = {
  index: ?number,
  position: ?number
}
const INITIAL_STATE: TextAnimationState = {index: null, position: null}
export default class TextAnimation extends Animation {
  position: Iterator<TextAnimationState>
  textSpeed: number
  initialState: TextAnimationState
  intervalID: IntervalID
  constructor(message: Message[], offset: number = 0) {
    super()
    this.position = this.positionGenerator(message, offset)
    const config = store.getState().config
    this.textSpeed = get(config, 'textSpeed', 1000)
    this.initialState = INITIAL_STATE
    if (this.textSpeed > 0) {
      const { value } = this.position.next()
      if (value !== undefined) {
        this.initialState = value
      }
    }
  }

  *positionGenerator(message: Message[], offset: number): Generator<TextAnimationState, void, void> {
    let position = 0
    for (let index = offset; index < message.length; index++) {
      const currentMessage = message[index]
      if (currentMessage.body) {
        while (position < currentMessage.body.length) {
          position += 1
          yield {index: index + 1, position}
        }
      }
    }
  }

  getInitialState() {
    return this.initialState
  }

  start() {
    if (this.textSpeed > 0) {
      let position = this.position.next()
      if (position.done) {
        this.finish()
        return
      }
      const intervalID = setInterval(() => {
        store.dispatch(setMessagePosition(position.value))
        position = this.position.next()
        if (position.done) {
          this.finish()
        }
      }, this.textSpeed)
      this.intervalID = intervalID
    }
  }

  finish() {
    this.isFinished = true
    clearInterval(this.intervalID)
    store.dispatch(setMessagePosition(INITIAL_STATE))
  }

  onExec() {
    this.finish()
  }
}
