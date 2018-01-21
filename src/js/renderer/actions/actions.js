// root
export const resetState = (components) => {
  return { type: 'RESET_STATE' }
}

// components
export const addComponents = (components, key = 'default') => {
  return {
    type: 'ADD_COMPONENTS',
    components,
    key
  }
}

// config
export const setConfig = (config) => {
  return {
    type: 'SET_CONFIG',
    config
  }
}

// MessageBox
export const clearMessage = () => {
  return {
    type: 'CLEAR_MESSAGE',
  }
}

export const addMessage = (message) => {
  return {
    type: 'ADD_MESSAGE',
    message
  }
}

export const setMessagePosition = ({index, position}) => {
  return {
    type: 'SET_MESSAGE_POSITION',
    index,
    position
  }
}

export const setMessageClassNames = (classNames) => {
  return {
    type: 'SET_MESSAGE_CLASSNAMES',
    classNames
  }
}

// animation
export const startAnimation = (animation) => {
  return {
    type: 'START_ANIMATION',
    animation
  }
}

export const finishAnimation = () => {
  return {
    type: 'FINISH_ANIMATION',
  }
}

// Image
export const addImage = (image) => {
  return addComponents({
    name: 'Image',
    args: image
  }, 'image')
}

// AnimationStyle
export const updateAnimationStyle = (animation) => {
  return {
    type: 'UPDATE_ANIMATION_STYLE',
    animation
  }
}
