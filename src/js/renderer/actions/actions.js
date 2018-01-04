// root
export const resetState = (components) => {
  return { type: 'RESET_STATE' }
}

// components
export const addComponents = (components) => {
  return {
    type: 'ADD_COMPONENTS',
    components
  }
}

// configPath
export const setConfigPath = (path) => {
  return {
    type: 'SET_CONFIG_PATH',
    path
  }
}

// MessageBox
export const setMessage = (message) => {
  return {
    type: 'SET_MESSAGE',
    message
  }
}

export const setMessageClassNames = (classNames) => {
  return {
    type: 'SET_MESSAGE_CLASSNAMES',
    classNames
  }
}
