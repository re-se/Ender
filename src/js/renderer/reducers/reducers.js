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
 * 実行中のエンジンを保持する State
 */
const engine = (state = null, action) => {
  switch(action.type) {
    case 'SET_ENGINE':
      return action.engine
    default:
      return state
  }
}

/**
 * コンフィグを保持する State
 */
const config = (state = null, action) => {
  switch(action.type) {
    case 'SET_CONFIG':
      return action.config
    default:
      return state
  }
}

const MessageBox = (
  state = {
    message: '',
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
  engine,
  config,
  MessageBox
})

export default reducer
