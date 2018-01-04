import { combineReducers } from 'redux'

/**
 * 描画予定のコンポーネントを保持する State
 */
const components = (state = [], action) => {
  switch(action.type) {
    case 'ADD_COMPONENTS':
      return state.concat(action.components)
    default:
      return state
  }
}

/**
 * コンフィグのパスを保持する State
 */
const configPath = (state = null, action) => {
  switch(action.type) {
    case 'SET_CONFIG_PATH':
      return action.path
    default:
      return state
  }
}

const MessageBox = (
  state = {
    message: [],
    classNames: [],
  }, action
) => {
  switch(action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.message }
    case 'SET_MESSAGE_CLASSNAMES':
      return { ...state, classNames: action.classNames }
    default:
      return state
  }
}

const reducer = combineReducers({
  components,
  configPath,
  MessageBox,
})

const rootReducer = (state, action) => {
  switch(action.type) {
    case 'RESET_STATE':
      state = undefined
      break
  }
  return reducer(state, action)
}

export default rootReducer
