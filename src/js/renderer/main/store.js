import { createStore } from 'redux'
import type { Store } from '../types/types'
import reducers from '../reducers/reducers'

const store: Store = createStore(reducers)

export default store
