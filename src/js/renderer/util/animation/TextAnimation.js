import Animation from './Animation'
import { setMessagePosition } from '../../actions/actions'
import { get } from 'lodash'
import store from '../../main/store'

const INITIAL_STATE = {index: null, position: null}
export default class TextAnimation extends Animation {
  constructor(message) {
    super()
    this.position = this.positionGenerator(message)
    const config = store.getState().config
    this.textSpeed = get(config, 'textSpeed', 1000)
    this.initialState = INITIAL_STATE
    if (this.textSpeed > 0) {
      this.initialState = this.position.next().value
    }
  }

  *positionGenerator(message) {
    let position = 0
    for (const index in message) {
      const currentMessage = message[index]
      if (currentMessage.body) {
        while (position <= currentMessage.body.length) {
          position += 1
          yield {index, position}
        }
      }
    }
  }

  getInitialState() {
      return this.initialState
  }

  start() {
    if (this.textSpeed > 0) {
      const intervalID = setInterval(() => {
        const ret = this.position.next()
        if (ret.done) {
          this.finish()
        } else {
          store.dispatch(setMessagePosition(ret.value))
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
}
