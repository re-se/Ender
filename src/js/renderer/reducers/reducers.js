import { combineReducers } from 'redux'
import engine from '../main/engine'

/**
 * 描画予定のコンポーネントを保持する State
 */
const components = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_COMPONENTS':
      let nextState = { ...state }
      nextState[action.key] =
        (state[action.key] || []).concat(action.components)
      return nextState
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

const LF = '\n'
const MessageBox = (
  state = {
    message: [],
    classNames: [],
    history: '',
    index: null, // message 内の何番目の要素まで表示するか
    position: null // 表示されている要素の内、最後の要素の何文字目まで表示するか
  }, action
) => {
  switch(action.type) {
    case 'SET_MESSAGE':
      let history = ''
      for (const key in action.message) {
        let value = action.message[key]
        if (value.type === 'interpolation') {
          value.type = 'text'
          value.body = engine.getVar(value.expr) // TODO: 変数展開
        } else if (value.type === 'br') {
          value.body = LF
        }
        if (value.body) {
          history += value.body
        }
      }
      return {
        ...state,
        message: action.message,
        history: state.history + history,
      }
    case 'SET_MESSAGE_POSITION':
      return {
        ...state,
        position: action.position,
        index: action.index
      }
    case 'SET_MESSAGE_CLASSNAMES':
      return { ...state, classNames: action.classNames }
    default:
      return state
  }
}

const animation = (state = [], action) => {
  switch(action.type) {
    case 'START_ANIMATION':
      action.animation.start()
      return state.concat(action.animation)
    case 'FINISH_ANIMATION':
      return []
    default:
      return state
  }
}

// Image
const Image = (state = [], action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return state.concat(action.image)
    default:
      return state
  }
}

const reducer = combineReducers({
  components,
  configPath,
  MessageBox,
  animation
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
