import { createStore } from 'redux'
import type { Store } from '../types/types'
import reducers from '../reducers/reducers'

const store: Store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
