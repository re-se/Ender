//@flow
import Ender from './engine.js';

export type WaitInst = {
  type: string
};

export type TextInst = {
  type: string,
  value: {
    type: string,
    body: string,
    expr: string
  }
};

const instMap = {
  wait: (engine: Ender, waitInst: WaitInst) => {
    //TODO
  },

  text: (textInst: TextInst) => {

  },

  name: () => {

  },

  nameClear: () => {

  },

  clear: () => {

  },

  func: () => {

  },

  funcdecl: () => {

  }
};

export default instMap;
