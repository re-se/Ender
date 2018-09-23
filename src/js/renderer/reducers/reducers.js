import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import engine from '../main/engine'
import store from '../main/store'
import { get } from 'lodash'
import ComponentUtil from '../util/ComponentUtil'
import AudioUtil from '../util/AudioUtil'
import { generateAudioNodeKey } from '../util/audio/generateAudioNodeKey'
import { generateAudioSrcBusState } from '../util/audio/generateAudioSrcBusState'
import { AUDIO_NODE_TYPE_LIST } from '../config/audioNodeTypeList'

/**
 * 描画予定のコンポーネントを保持する State
 */
const components = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_COMPONENTS':
      let nextState = { ...state }
      nextState[action.key] = (state[action.key] || []).concat(
        action.components.map(componentInst => {
          return ComponentUtil.generateComponentState(componentInst, action.key)
        })
      )
      return nextState
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
    let component = components[index]

    if (ComponentUtil.matchSelector(component, selector)) {
      nextState[index].props.style = components[index].props.style
        ? { ...components[index].props.style, ...style }
        : { ...style }
    }

    if (component.props.children) {
      nextState[index].props.children = updateComponentStyle(
        components[index].props.children,
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

const audio = (state = { audioEffects: [], audioBuses: {} }, action) => {
  switch (action.type) {
    case 'LOAD_AUDIO':
      return _loadAudio(state, action.src, action.out)

    case 'PLAY_AUDIO':
      // ロードされていなければ、ロードする
      if (!state.audioBuses[action.src]) {
        state = _loadAudio(state, action.src, action.out)
      }

      return _updateAudioNode(
        state,
        action.src,
        state.audioBuses[action.src].firstNode,
        { isPlay: true }
      )

    case 'STOP_AUDIO':
      return _updateAudioNode(
        state,
        action.bus,
        state.audioBuses[action.bus].firstNode,
        { isPlay: false }
      )

    case 'PAUSE_AUDIO':
      return _updateAudioNode(
        state,
        action.src,
        state.audioBuses[action.src].firstNode,
        { isPlay: false }
      )

    case 'EFFECT_AUDIO':
      return _putAudioEvent(state, action.audio, action.effect)

    default:
      return state
  }
}

function _updateAudioNode(
  state: AudioState,
  audioBusKey: string,
  audioNodeKey: string,
  updateParams: Object
): AudioState {
  return {
    ...state,
    audioBuses: {
      ...state.audioBuses,
      [audioBusKey]: {
        ...state.audioBuses[audioBusKey],
        nodes: {
          ...state.audioBuses[audioBusKey].nodes,
          [audioNodeKey]: {
            ...state.audioBuses[audioBusKey].nodes[audioNodeKey],
            ...updateParams,
          },
        },
      },
    },
  }
}

function _loadAudio(state: AudioState, src, out) {
  return {
    ...state,
    audioBuses: {
      ...state.audioBuses,
      [src]: generateAudioSrcBusState(out, src),
    },
  }
}

const reducer = combineReducers({
  components,
  MessageBox,
  animation,
  audio,
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
