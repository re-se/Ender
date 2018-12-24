import ComponentUtil from '../util/ComponentUtil'
import MovieAnimation from '../util/animation/MovieAnimation'
import AnimationUtil from '../util/AnimationUtil'

// root
export const resetState = components => {
  return { type: 'RESET_STATE' }
}

export const replaceState = state => {
  return { type: 'REPLACE_STATE', state }
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

export const deleteStyle = filePath => {
  return {
    type: 'DELETE_STYLE',
    filePath,
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
export const addImage = (
  src: string,
  classNames: string | string[],
  effect: string
) => {
  const id = ComponentUtil.generateId('image')
  return addComponents(
    [
      {
        type: 'func',
        name: 'Image',
        args: [src, classNames, effect, id],
      },
    ],
    'image'
  )
}

// Movie
export const addMovie = (
  src: string,
  classNames: string | string[],
  isLoop: boolean
) => {
  const id = ComponentUtil.generateId('movie')
  const animation = new MovieAnimation(id, true)
  const onComplete = () => {
    animation.finish()
  }

  animation.start()
  AnimationUtil.setAnimation(animation)

  return addComponents(
    [
      {
        type: 'func',
        name: 'Movie',
        args: [src, classNames, isLoop, id, onComplete],
      },
    ],
    'movie'
  )
}

// Save
export const updateSave = saveData => {
  return {
    type: 'UPDATE_SAVE',
    saveData,
  }
}

export const deleteSave = name => {
  return {
    type: 'DELETE_SAVE',
    name,
  }
}
