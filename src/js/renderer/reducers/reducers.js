import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import engine from '../main/engine'
import store from '../main/store'
import { get } from 'lodash'
import ComponentUtil from '../util/ComponentUtil'

/**
 * 描画予定のコンポーネントを保持する State
 */
const components = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_COMPONENTS': {
      let nextState = { ...state }
      nextState[action.key] = (state[action.key] || []).concat(
        action.components.map(componentInst => {
          return ComponentUtil.generateComponentState(componentInst, action.key)
        })
      )
      return nextState
    }
    case 'DELETE_COMPONENTS': {
      let nextState = {}
      for (let key in state) {
        nextState[key] = state[key].filter(
          component =>
            !ComponentUtil.matchSelector(component, action.selectorTree)
        )
      }
      return nextState
    }
    case 'UPDATE_COMPONENT_STYLE':
      return updateComponentStyle(state, action.selector, action.style)
    default:
      return state
  }
}

const updateComponentStyle = (state, selector: Selector[], style) => {
  let nextState = {}

  for (const key in state) {
    nextState[key] = _updateComponentStyle(state[key], selector, style)
  }

  return nextState
}

const _updateComponentStyle = (
  components: ComponentState[],
  selector: Selector[],
  style: any
): ComponentState[] => {
  let nextState = [...components]
  for (const index in components) {
    const component = components[index]

    if (ComponentUtil.matchSelector(component, selector)) {
      nextState[index].props.style = component.props.style
        ? { ...component.props.style, ...style }
        : { ...style }
    }

    if (component.props.children) {
      nextState[index].props.children = _updateComponentStyle(
        component.props.children,
        selector,
        style
      )
    }
  }
  return nextState
}

const LF = '\n'
const _evalMessage = messageObject => {
  let message = [...messageObject]
  let history = ''
  if (message.length === 0) {
    return { message, history }
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

  // 改ページの場合、命令列の最後 or wait -> text 以外(clear, func等) になっている
  const nextInst2 = engine.lookahead(2)
  let next
  if (!nextInst2 || nextInst2.type !== 'text') {
    next = 'clear'
  } else {
    next = 'wait'
  }
  return { message, history, next }
}

const MessageBox = (
  state = {
    message: [],
    name: null,
    classNames: [],
    history: '',
    next: null,
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
      const { message, history, next } = _evalMessage(action.message)
      return {
        ...state,
        message: state.message.concat(message),
        history: state.history + history,
        next: next,
      }
    case 'SET_MESSAGE_POSITION':
      return {
        ...state,
        position: action.position,
        index: action.index,
      }
    case 'SET_MESSAGE_CLASSNAMES':
      return { ...state, classNames: action.classNames }
    case 'SET_NAME':
      return { ...state, name: action.name }
    default:
      return state
  }
}

const animation = (state = [], action) => {
  switch (action.type) {
    case 'START_ANIMATION':
      return state.concat(action.animation)
    case 'FINISH_ANIMATION':
      return state.filter(animation => {
        return !animation.isFinished
      })
    default:
      return state
  }
}

const save = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SAVE': {
      const nextState = { ...state }
      nextState[action.saveData.name] = action.saveData
      return nextState
    }
    case 'DELETE_SAVE': {
      const nextState = {}
      for (let name in state) {
        if (name !== action.name) {
          nextState[name] = state[name]
        }
      }
      return nextState
    }
    default:
      return state
  }
}

const reducer = combineReducers({
  components,
  MessageBox,
  animation,
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
