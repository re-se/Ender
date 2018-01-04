import generateComponent from '../util/generateComponent'
import type { FuncInst } from './instMap'
import { addComponents } from '../actions/actions'
import store from './store'
import engine from './engine'

export default {
  layout: (args: FuncInst[]) => {
    let components = []
    for (const key in args) {
      const component = args[key]
      components.push(generateComponent(
        component.name,
        component.args,
        `${engine.scriptPath}_${engine.pc}_${key}`
      ))
    }
    store.dispatch(addComponents(components))
  },
}
