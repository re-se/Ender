import { generateAudioNodeState } from './generateAudioNodeState'

export function generateAudioEffectNodeState(
  type,
  params,
  audioEffectKey,
  name
) {
  const audioNodeState = generateAudioNodeState(type, params)
  return {
    ...audioNodeState,
    audioEffectKey,
    name,
  }
}
