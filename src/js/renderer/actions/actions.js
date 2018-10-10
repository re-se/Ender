import ComponentUtil from '../util/ComponentUtil'

// root
export const resetState = components => {
  return { type: 'RESET_STATE' }
}

// components
export const addComponents = (components, key = 'default') => {
  return {
    type: 'ADD_COMPONENTS',
    components,
    key,
  }
}

export const deleteComponents = selectorTree => {
  return {
    type: 'DELETE_COMPONENTS',
    selectorTree,
  }
}

export const updateComponentStyle = (selector, style) => {
  return {
    type: 'UPDATE_COMPONENT_STYLE',
    selector,
    style,
  }
}

// MessageBox
export const clearMessage = () => {
  return {
    type: 'CLEAR_MESSAGE',
  }
}

export const addMessage = message => {
  return {
    type: 'ADD_MESSAGE',
    message,
  }
}

export const setMessagePosition = ({ index, position }) => {
  return {
    type: 'SET_MESSAGE_POSITION',
    index,
    position,
  }
}

export const setMessageClassNames = classNames => {
  return {
    type: 'SET_MESSAGE_CLASSNAMES',
    classNames,
  }
}

export const setName = (name = null) => {
  return {
    type: 'SET_NAME',
    name,
  }
}

// animation
export const startAnimation = animation => {
  return {
    type: 'START_ANIMATION',
    animation,
  }
}

export const finishAnimation = () => {
  return {
    type: 'FINISH_ANIMATION',
  }
}

// Image
export const addImage = image => {
  image[3] = ComponentUtil.generateId('image')
  return addComponents(
    [
      {
        type: 'func',
        name: 'Image',
        args: image,
      },
    ],
    'image'
  )
}

// Movie
export const addMovie = movie => {
  return addComponents(
    [
      {
        type: 'func',
        name: 'Movie',
        args: movie,
      },
    ],
    'movie'
  )
}
