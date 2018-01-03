//@flow
import Ender from './engine.js'
import funcMap from './funcMap'
import { setMessage } from '../actions/actions'
import store from './store'

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

const instMap = {
  wait: (waitInst: WaitInst) => {
    //TODO
  },

  text: (textInst: TextInst) => {
    store.dispatch(setMessage(textInst.value))
  },

  name: () => {

  },

  nameClear: () => {

  },

  clear: () => {

  },

  func: (funcInst: FuncInst) => {
    funcMap[funcInst.name](funcInst.args)
  },

  funcdecl: () => {

  }
}

export default instMap
