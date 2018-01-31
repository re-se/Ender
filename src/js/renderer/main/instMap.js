//@flow
import engine from './engine.js'
import funcMap from './funcMap'
import {
  addMessage,
  clearMessage,
  setMessagePosition,
  startAnimation,
} from '../actions/actions'
import store from './store'
import TextAnimation from '../util/animation/TextAnimation'
import { GeneratorFunction } from '../util/util'

export type WaitInst = {
  type: string,
}

export type TextInst = {
  type: string,
  value: {
    type: string,
    body?: string,
    expr?: string,
  }[],
}

export type FuncInst = {
  type: 'func',
  name: string,
  args: any[],
}

export type ClearInst = {
  type: string,
  message?: boolean,
}

const instMap = {
  wait: function*(waitInst: WaitInst): GeneratorFunction {
    yield
  },

  text: (textInst: TextInst) => {
    const beforeMessageLength = store.getState().MessageBox.message.length
    store.dispatch(addMessage(textInst.value))
    const animation = new TextAnimation(
      [...store.getState().MessageBox.message],
      beforeMessageLength
    )
    store.dispatch(setMessagePosition(animation.getInitialState()))
    animation.start()
    store.dispatch(startAnimation(animation))
  },

  name: () => {},

  nameClear: () => {},

  clear: clearInst => {
    if (clearInst.message) {
      store.dispatch(clearMessage())
    }
  },

  func: function*(funcInst: FuncInst): GeneratorFunction {
    if (!funcMap[funcInst.name]) {
      console.warn(`undefined func ${funcInst.name}`)
      return
    }
    if (funcMap[funcInst.name] instanceof GeneratorFunction) {
      yield* funcMap[funcInst.name](funcInst.args)
    } else {
      funcMap[funcInst.name](funcInst.args)
    }
  },

  funcdecl: () => {},

  comment: () => {},
}

export default instMap
