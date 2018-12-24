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

export default animation
