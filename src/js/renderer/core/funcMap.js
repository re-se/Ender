import generateComponent from '../util/generateComponent'
import type { FuncInst } from './instMap'
import { addComponents } from '../actions/actions'

export default {
  layout: (engine, args: FuncInst[]) => {
    let components = []
    for (const key in args) {
      const component = args[key]
      components.push(generateComponent(component.name, component.args))
    }
    engine.store.dispatch(addComponents(components))
  },
}
