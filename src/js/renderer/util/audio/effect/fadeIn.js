//@flow
const GAIN_NODE_NAME = 'gain'

export default {
  start: (audioNodes: { [string]: GainNode }, onComplete: () => void): void => {
    console.log(audioNodes)
    audioNodes[GAIN_NODE_NAME].gain.linearRampToValueAtTime(1.0, 2)
    setTimeout(() => {
      onComplete()
    }, 2100)
  },

  nodes: {
    [GAIN_NODE_NAME]: {
      type: 'gain',
      name: 'gain',
      params: { gain: 0.0 },
    },
  },
}
