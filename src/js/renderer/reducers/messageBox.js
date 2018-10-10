import engine from '../main/engine'

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

export default MessageBox
