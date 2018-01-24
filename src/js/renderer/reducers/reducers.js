import {combineReducers} from 'redux'
import reduceReducers from 'reduce-reducers'
import engine from '../main/engine'
import store from '../main/store'
import {get} from 'lodash'

/**
 * 描画予定のコンポーネントを保持する State
 */
const components = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_COMPONENTS':
      let nextState = {...state}
      nextState[action.key] = (state[action.key] || []).concat(
        action.components
      )
      return nextState
    default:
      return state
  }
}

const LF = '\n'
const DEFAULT_MARKER = ['▽', '▼']
const _evalMessage = messageObject => {
  let message = [...messageObject]
  let history = ''
  if (message.length === 0) {
    return {message, history}
  }
  for (const key in message) {
    let value = message[key]
    if (value.type === 'interpolation') {
      value.type = 'text'
      value.body = engine.eval(value.expr)
    } else if (value.type === 'br') {
      value.body = LF
    }
    if (value.body) {
      history += value.body
    }
  }

  const config = engine.getVar('config')
  const markers = get(config, 'text.marker', DEFAULT_MARKER)
  // 改ページの場合、wait -> clear になっている
  const marker =
    engine.lookahead(2) && engine.lookahead(2).type !== 'clear'
      ? markers[0]
      : markers[1]
  return {message, history, marker}
}

const MessageBox = (
  state = {
    message: [],
    classNames: [],
    history: '',
    marker: null,
    index: null, // message 内の何番目の要素まで表示するか
    position: null, // 表示されている要素の内、最後の要素の何文字目まで表示するか
  },
  action
) => {
  switch (action.type) {
    case 'CLEAR_MESSAGE':
      return {
        ...state,
        message: [],
      }

    case 'ADD_MESSAGE':
      const {message, history, marker} = _evalMessage(action.message)
      return {
        ...state,
        message: state.message.concat(message),
        history: state.history + history,
        marker: marker,
      }
    case 'SET_MESSAGE_POSITION':
      return {
        ...state,
        position: action.position,
        index: action.index,
      }
    case 'SET_MESSAGE_CLASSNAMES':
      return {...state, classNames: action.classNames}
    default:
      return state
  }
}

const animation = (state = [], action) => {
  switch (action.type) {
    case 'START_ANIMATION':
      return state.concat(action.animation)
    case 'FINISH_ANIMATION':
      return []
    default:
      return state
  }
}

const animationStyle = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ANIMATION_STYLE':
      const selector = action.animation.selector
      return Object.assign({}, state, {
        [selector]: Object.assign(
          {},
          state[selector],
          action.animation.animationStyle
        ),
      })
    default:
      return state
  }
}

const reducer = combineReducers({
  components,
  MessageBox,
  animation,
  animationStyle,
})

const root = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return {}
    default:
      return state
  }
}

const rootReducer: Reducer<State, Action> = reduceReducers(root, reducer)

export default rootReducer
