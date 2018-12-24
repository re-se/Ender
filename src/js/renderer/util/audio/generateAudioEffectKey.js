import uuid from 'uuid/v1'

export function generateAudioEffectKey(effect) {
  return `audio_effect_${effect}_${uuid()}`
}
