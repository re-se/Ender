export const addComponents = (components) => {
  return {
    type: 'ADD_COMPONENTS',
    components
  }
}

export const setEngine = (engine) => {
  return {
    type: 'SET_ENGINE',
    engine
  }
}

export const setConfig = (config) => {
  return {
    type: 'SET_CONFIG',
    config
  }
}

// Message
export const setMessage = (message) => {
  return {
    type: 'SET_MESSAGE',
    message
  }
}

// Message
export const setMessageClassNames = (classNames) => {
  return {
    type: 'SET_MESSAGE_CLASSNAMES',
    classNames
  }
}
