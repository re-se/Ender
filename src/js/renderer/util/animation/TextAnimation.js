// @flow
import { setMessagePosition } from '../../actions/actions'
import { get } from 'lodash'
import store from '../../main/store'

type State = {
  index: ?number,
  position: ?number
}
const INITIAL_STATE: State = {index: null, position: null}
export default class TextAnimation implements Animation {
  isFinished = false
  position: Iterator<State>
  textSpeed: number
  initialState: State
  constructor(message, offset = 0) {
    this.isFinished = false
    this.position = this.positionGenerator(message, offset)
    const config = store.getState().config
    this.textSpeed = get(config, 'textSpeed', 1000)
    this.initialState = INITIAL_STATE
    if (this.textSpeed > 0) {
      this.initialState = this.position.next().value
    }
  }

  *positionGenerator(message, offset): Generator<> {
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
