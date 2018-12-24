import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import animation from './animation'
import audio from './audio'
import components from './components'
import MessageBox from './messageBox'
import save from './save'

const reducer = combineReducers({
  animation,
  audio,
  components,
  MessageBox,
  save,
})

const root = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return {}
    case 'REPLACE_STATE':
      return { ...action.state }
    default:
      return state
  }
}

const rootReducer: Reducer<State, Action> = reduceReducers(root, reducer)

export default rootReducer
