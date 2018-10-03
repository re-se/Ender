import ComponentUtil from '../util/ComponentUtil'
import AudioEffect from '../util/audio/AudioEffect'
import store from '../main/store'

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

// Audio
export const loadAudio = audio => {
  return {
    type: 'LOAD_AUDIO',
    audio,
  }
}

export const playAudio = (src, out, isLoop, loopOffsetTime) => {
  return {
    type: 'PLAY_AUDIO',
    src,
    out,
    isLoop,
    loopOffsetTime,
  }
}

export const stopAudio = (bus, effect) => {
  return {
    type: 'STOP_AUDIO',
    bus,
    effect,
  }
}

export const pauseAudio = (bus, effect) => {
  return {
    type: 'PAUSE_AUDIO',
    bus,
    effect,
  }
}

export const loadAudioBus = (name, out, gain) => {
  return {
    type: 'LOAD_AUDIO_BUS',
    name,
    out,
    gain,
  }
}

export const loadAudioEffect = (targetBus, effect, isSync = true) => {
  const audioEffect = new AudioEffect(targetBus, effect, isSync)
  return {
    type: 'LOAD_AUDIO_EFFECT',
    audioEffect,
  }
}

export const addAudioEffectNode = (
  audioBusKey,
  audioEffectKey,
  name,
  type,
  params
) => {
  console.log(audioEffectKey)
  return {
    type: 'ADD_AUDIO_EFFECT_NODE',
    audioEffectKey,
    audioBusKey,
    name,
    type,
    params,
  }
}

export const clearAudioEvent = audio => {
  return {
    type: 'CLEAR_AUDIO_EVENT',
    audio,
  }
}
