import generateComponent from '../util/generateComponent'
import type { FuncInst } from './instMap'
import { addComponents } from '../actions/actions'
import store from './store'
import engine from './engine'

export default {
  layout: (args: FuncInst[]) => {
    store.dispatch(addComponents(args))
  },
}
