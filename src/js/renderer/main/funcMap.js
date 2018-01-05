import generateComponent from '../util/generateComponent'
import type { FuncInst } from './instMap'
import { addComponents, addImage } from '../actions/actions'
import store from './store'
import engine from './engine'

export type Image = {
  source: string,
  classList: string[],
  effect: string,
  callback: () => void
}

export default {
  img: (args) => {
    let image: Image = {
      source: engine.eval(args[0]),
      classList: [].concat(engine.eval(args[1])),
      effect: engine.eval(args[2]),
      callback: () => {
        engine.exec()
      }
    }
    store.dispatch(addImage(image))
  },
  layout: (args: FuncInst[]) => {
    store.dispatch(addComponents(args))
  },
  set: (args) => {
    engine.setVar(args[0], args[1])
  },
}
