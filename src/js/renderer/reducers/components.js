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

export default components
