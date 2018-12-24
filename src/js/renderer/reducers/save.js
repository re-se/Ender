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

export default save
