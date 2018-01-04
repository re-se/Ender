//@flow
import Ender from './engine.js'
import funcMap from './funcMap'
import { setMessage, setMessagePosition, startAnimation } from '../actions/actions'
import store from './store'
import TextAnimation from '../util/animation/TextAnimation'

export type WaitInst = {
  type: string
}

export type TextInst = {
  type: string,
  value: {
    type: string,
    body?: string,
    expr?: string
  }[]
}

export type FuncInst = {
  type: string,
  name: string,
  args: any[],
}

export type ClearInst = {
  type: string,
  message?: bool,
}

const instMap = {
  wait: function* (waitInst: WaitInst) {
    yield
  },

  text: (textInst: TextInst) => {
    store.dispatch(setMessage(textInst.value))
    const animation = new TextAnimation(textInst.value)
    store.dispatch(setMessagePosition(animation.getInitialState()))
    store.dispatch(startAnimation(animation))
  },

  name: () => {

  },

  nameClear: () => {

  },

  clear: (clearInst) => {
    if (clearInst.message) {
      store.dispatch(setMessage([]))
    }
  },

  func: (funcInst: FuncInst) => {
    funcMap[funcInst.name](funcInst.args)
  },

  funcdecl: () => {

  }
}

export default instMap
