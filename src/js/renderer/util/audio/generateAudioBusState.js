import { generateAudioNodeKey } from './generateAudioNodeKey'
import { generateAudioNodeState } from './generateAudioNodeState'
import { AUDIO_NODE_TYPE_LIST } from '../../config/audioNodeTypeList'

export function generateAudioBusState(out, gain) {
  const inGainNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.GAIN)
  const outGainNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.GAIN)

  return {
    out,
    nodes: {
      [inGainNodeKey]: generateAudioNodeState(AUDIO_NODE_TYPE_LIST.GAIN, {
        gain: 1.0,
      }),
      [outGainNodeKey]: generateAudioNodeState(AUDIO_NODE_TYPE_LIST.GAIN, {
        gain,
      }),
    },
    firstNode: inGainNodeKey,
    lastNode: outGainNodeKey,
    nodeOrder: [],
  }
}
