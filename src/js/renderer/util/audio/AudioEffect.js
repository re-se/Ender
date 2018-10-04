// @flow
import store from '../../main/store'
import engine from '../../main/engine'
import uuid from 'uuid/v1'
import { deleteAudioEffect } from '../../actions/actions'

type AudioEffector = {
  start: (
    audioCxt: AudioContext,
    audioNodes: { [string]: AudioNode },
    onComplete: () => void
  ) => void,
  stop?: (
    audioCxt: AudioContext,
    audioNodes: { [string]: AudioNode },
    onComplete: () => void
  ) => void,
  nodes: { [string]: Object },
}

export default class AudioEffect {
  key: string
  targetBus: string
  effectName: string
  effector: AudioEffector
  isSync: boolean = false
  isStarted: boolean = false
  isFinished: boolean = false
  onComplete: AudioEffect => void

  constructor(
    targetBus: string,
    effectName: string,
    isSync: boolean,
    onComplete: AudioEffect => void
  ) {
    this.key = generateAudioEffectKey(effectName)
    this.targetBus = targetBus
    this.effectName = effectName
    this.effector = require(`./effect/${effectName}`).default
    this.isSync = isSync
    this.onComplete = onComplete
  }

  start(audioCxt: AudioContext, audioNodes: { [string]: AudioNode }) {
    this.isStarted = true
    this.effector.start(audioCxt, audioNodes, this.complete.bind(this))
  }

  stop(audioCxt: AudioContext, audioNodes: { [string]: AudioNode }) {
    if (this.effector.stop) {
      this.effector.stop(audioCxt, audioNodes, this.complete.bind(this))
    }
  }

  complete() {
    this.isFinished = true
    if (this.onComplete) {
      this.onComplete(this)
    }
    // effect の削除を行なうと再生が巻き戻るため、一旦削除しない。FIXME
    // store.dispatch(deleteAudioEffect(this))

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
