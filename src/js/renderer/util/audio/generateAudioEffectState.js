export function generateAudioEffectState(key, effect, isSync = false) {
  return {
    key,
    effect,
    isSync,
    isStarted: false,
    isFinished: false,
  }
}
