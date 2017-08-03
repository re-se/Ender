module.exports = {
  # target: AudioNode エフェクト対象の AudioNode
  fadeIn: (audioContext, target, onComplete) ->
    targetGainValue = target.gain.value
    startTime = audioContext.currentTime
    target.gain.linearRampToValueAtTime(0, startTime);
    target.gain.linearRampToValueAtTime(targetGainValue, startTime + 2);
  fadeOut: (audioContext, target, onComplete) ->
    targetGainValue = target.gain.value
    startTime = audioContext.currentTime
    target.gain.linearRampToValueAtTime(targetGainValue, startTime);
    target.gain.linearRampToValueAtTime(0, startTime + 3);
    setTimeout(onComplete, 4000)
}
