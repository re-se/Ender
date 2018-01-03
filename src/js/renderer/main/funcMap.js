import generateComponent from '../util/generateComponent'
import type { FuncInst } from './instMap'
import { addComponents } from '../actions/actions'
import store from './store'

export default {
  layout: (args: FuncInst[]) => {
    let components = []
    for (const key in args) {
      const component = args[key]
      components.push(generateComponent(component.name, component.args))
    }
    store.dispatch(addComponents(components))
  },
}
