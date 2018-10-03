// @flow
import store from '../../main/store'
import engine from '../../main/engine'
import uuid from 'uuid/v1'

type AudioEffector = {
  start: (audioNodes: { [string]: AudioNode }, onComplete: () => void) => void,
  stop?: (audioNodes: { [string]: AudioNode }, onComplete: () => void) => void,
  nodes: { [string]: Object },
}

export default class AudioEffect {
  key: string
  targetBus: string
  effectName: string
  effector: AudioEffector
  isSync: boolean
  isStarted: boolean = false
  isFinished: boolean = false

  constructor(targetBus: string, effectName: string, isSync: boolean = false) {
    this.key = generateAudioEffectKey(effectName)
    this.targetBus = targetBus
    this.effectName = effectName
    this.effector = require(`./effect/${effectName}`).default
    this.isSync = isSync
  }

  start(audioNodes: { [string]: AudioNode }) {
    this.isStarted = true
    this.effector.start(audioNodes, this.complete.bind(this))
  }

  stop(audioNodes: { [string]: AudioNode }) {
    if (this.effector.stop) {
      this.effector.stop(audioNodes, this.complete.bind(this))
    }
  }

  complete() {
    this.isFinished = true
    if (this.isSync) {
      engine.exec()
    }
  }

  onExec() {
    this.complete()
  }
}

function generateAudioEffectKey(effect) {
  return `audio_effect_${effect}_${uuid()}`
}
