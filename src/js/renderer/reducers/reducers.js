const initialState = {}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case 'ADD_COMPONENTS':
      return Object.assign({}, state,
        {
          components: state.components.concat(action.components)
        }
      )
    default:
      return state
  }
}
