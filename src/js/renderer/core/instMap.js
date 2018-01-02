//@flow
import Ender from './engine.js'
import funcMap from './funcMap'

export type WaitInst = {
  type: string
}

export type TextInst = {
  type: string,
  args: {
    type: string,
    body: string,
    expr: string
  }
}

export type FuncInst = {
  type: string,
  name: string,
  args: any[],
}

const instMap = {
  wait: (engine: Ender, waitInst: WaitInst) => {
    //TODO
  },

  text: (engine: Ender, textInst: TextInst) => {

  },

  name: () => {

  },

  nameClear: () => {

  },

  clear: () => {

  },

  func: (engine: Ender, funcInst: FuncInst) => {
    funcMap[funcInst.name](engine, funcInst.args)
  },

  funcdecl: () => {

  }
}

export default instMap
