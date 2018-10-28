//@flow
import engine from './engine.js'
import { generator } from './funcMap'
import {
  addMessage,
  clearMessage,
  setMessagePosition,
  setName,
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

export type NameInst = {
  type: string,
  name: string | Object, // TODO: Object の型も絞れる
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

export type LambdaInst = {
  type: 'lambda',
  args: any[],
  body: any[],
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

  name: ({ name }: NameInst) => {
    store.dispatch(setName(engine.eval(name)))
  },

  nameClear: () => {
    store.dispatch(setName())
  },

  clear: (clearInst: ClearInst) => {
    if (clearInst.message) {
      store.dispatch(clearMessage())
    }
  },

  func: function*(funcInst: FuncInst): GeneratorFunction {
    yield* generator(funcInst)
  },

  comment: () => {},
}

export default instMap
