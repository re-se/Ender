//@flow
const GAIN_NODE_NAME = 'gain'

export default {
  start: (
    audioCxt: AudioContext,
    audioNodes: { [string]: GainNode },
    onComplete: () => void
  ): void => {
    audioNodes[GAIN_NODE_NAME].gain.setValueAtTime(0, audioCxt.currentTime)
    audioNodes[GAIN_NODE_NAME].gain.linearRampToValueAtTime(
      1.0,
      audioCxt.currentTime + 2
    )
    setTimeout(() => {
      onComplete()
    }, 3000)
  },

  nodes: {
    [GAIN_NODE_NAME]: {
      type: 'gain',
      name: 'gain',
      params: { gain: 1.0 },
    },
  },
}
